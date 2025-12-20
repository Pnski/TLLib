---
toc: false
---

# Review File

Notice using the datarangeslider is usefull but depending on your computer and logfile it might be laggy.

Throne and Liberty Damage meter files are stored in:
```
%LOCALAPPDATA%/TL/Saved/CombatLogs
```

```js
import { interval } from "/modules/interval.js";
import { sparkbar } from "/modules/sparkbar.js";
import { uidToColor } from "/modules/uidToColor.js";
import { csvParse } from "npm:d3-dsv@3";

const logFile = view(Inputs.file({
  label: "Upload Combat Log",
  accept: ".txt",
  required: true,
  multiple: true
}));
```

```js
const logFilesSelection = view(Inputs.table(logFile,
    {required: false,
    value: Object.values(logFile || {}),  // This selects ALL files
    format: {lastModified: x => Date(x)},
    layout:"auto"}))

const filters = view(Inputs.checkbox(["Zeros", "Raid Skill"], {label: "Filter"}));
const filterTime = view(interval([0, 100], {
  step: 1, 
  value: [0, 100],
  label: "Select Datarange",
  format: () => ""
}));
```

<div class="grid grid-cols-4">
    <a class="card">
        <h2>Date of Log</h2>
        <span class="medium">${stats.firstTimestamp ? stats.firstTimestamp.toLocaleDateString() : 'N/A'}</span>
    </a>
    <a class="card">
        <h2>Start Time</h2>
        <span class="medium">${stats.startTime ? stats.startTime.toFixed(1) : '0'}</span>
        <span class="muted">seconds</span>
    </a>
    <a class="card">
        <h2>End Time</h2>
        <span class="medium">${stats.endTime ? stats.endTime.toFixed(1) : '0'}</span>
        <span class="muted">seconds</span>
    </a>
    <a class="card">
        <h2>Total Damage</h2>
        <span class="medium">${totalDamageAll.toLocaleString()}</span>
    </a>
</div>
<!--
<div class="card">
    <h2>Floor Q1 Median Q3 Ceiling Best</h2>
    ${
        Plot.plot({
            x: {
                label: "Damage",
                labelAnchor: "right",
                tickFormat: x => x.toFixed(0),
                grid: true
            },
            y: {
                grid: true,
                label: null
            },
            marks: [
                Plot.ruleX([0]),
                Plot.tickX(masterTable,{
                    x: "Damage",
                    y: "SkillName",
                    fill: "red"
                }),
                Plot.boxX(masterTable, {
                    x: "Damage",
                    y: "SkillName",
                    fill: d => uidToColor(d.SkillId),
                    //whisker: "minmax",
                    //box: false,
                    //outliers: false,
                    stroke: d => uidToColor(d.SkillId),
                    strokeWidth: 1.5,
                    whiskerCap: true,
                    r: 2
                })
            ],
            marginLeft: 0.1 * width,
            marginRight: 0.1 * width,
            marginBottom: width / 25,
            width,
            height: width / 2.5
        })
    }
</div>-->
<div class="card">
    <h2>Skill Table</h2>
    ${view(viewTableData)}
</div>
<div class="card">
    <h2>Heat Graph</h2>
    ${view(viewHeatMap)}
</div>

<h2>Detailed Tables per Monster</h2>
${
    Object.entries(monsterTables).map(([target, targetData]) => html`
        <div class="card">
            <h3>${target}</h3>
            ${Inputs.table(targetData, {
                columns: [
                    "SkillName", "Damage", "Ratio", "HitCount", "CritChance", "HeavyChance", "CritDouble", "DPS"
                ],
                header: {
                    SkillName: "Skill Name",
                    Damage: "Damage",
                    Ratio: "Ratio",
                    HitCount: "Hit Count",
                    CritChance: "Critical \%",
                    HeavyChance: "Heavy \%",
                    CritDouble: "Critical + Heavy \%",
                    DPS: "DPS"
                },
                format: {
                    Damage: sparkbar(d3.max(targetData, d => d.Damage)),
                    Ratio: (x) => x.toFixed(1) + "%",
                    CritChance: (x) => x.toFixed(1) + "%",
                    HeavyChance: (x) => x.toFixed(1) + "%",
                    CritDouble: (x) => x.toFixed(1) + "%",
                    DPS: (x) => x.toFixed(0)
                },
                sort: "Damage",
                reverse: true,
                layout: "fixed",
                rows: 30,
                select: false})
            }
        </div>`)
}

```js process masterTable
// Process files and create master table
const masterTable = await (async () => {
    if (!logFilesSelection || logFilesSelection.length === 0) {
        return aq.table({
            Timestamp: [], LogType: [], SkillName: [], SkillId: [], Damage: [], 
            HitCritical: [], HitDouble: [], HitType: [], CasterName: [], TargetName: [], 
            FileSHA: [], CritDouble: [], Time: []
        });
    }

    const allRecords = []; 
    const processedShas = new Set();
    const files = Object.values(logFilesSelection);
    
    for (let file of files) {
        try {
            const text = await file.text();
            
            // Compute SHA-256 hash
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const sha = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            if (processedShas.has(sha) || !text.includes("CombatLogVersion,4")) {
                continue;
            }
            
            const csvText = text.replace(
                "CombatLogVersion,4",
                "Timestamp,LogType,SkillName,SkillId,Damage,HitCritical,HitDouble,HitType,CasterName,TargetName"
            );
            
            // Parse CSV
            const parsed = csvParse(csvText);
            
            // Convert to objects with proper types
            parsed.forEach(d => {
                // Parse timestamp
                const timestampStr = d.Timestamp;
                const isoStr = timestampStr.replace(
                    /^(\d{4})(\d{2})(\d{2})-(\d{2}:\d{2}:\d{2}):(\d{3})$/,
                    "$1-$2-$3T$4.$5"
                );
                const timestamp = new Date(isoStr);
                
                // Convert numeric fields
                const skillId = Number(d.SkillId);
                const damage = Number(d.Damage);
                const hitCritical = d.HitCritical === "1" ? 1 : 0;
                const hitDouble = d.HitDouble === "1" ? 1 : 0;
                const critDouble = (hitCritical && hitDouble) ? 1 : 0;
                
                // Apply filters if needed
                if (filters.includes("Zeros") && damage === 0) return;
                if (filters.includes("Raid Skill") && skillId === 940574531) return;
                
                allRecords.push({
                    Timestamp: timestamp,
                    LogType: d.LogType,
                    SkillName: d.SkillName,
                    SkillId: skillId,
                    Damage: damage,
                    HitCritical: hitCritical,
                    HitDouble: hitDouble,
                    HitType: d.HitType,
                    CasterName: d.CasterName,
                    TargetName: d.TargetName,
                    FileSHA: sha,
                    CritDouble: critDouble
                });
            });
            
            processedShas.add(sha);
            
        } catch (fileError) {
            console.error(`Error processing file ${file.name}:`, fileError);
        }
    }
    
    // Sort by timestamp
    allRecords.sort((a, b) => a.Timestamp - b.Timestamp);
    
    // Add relative time column
    if (allRecords.length > 0) {
        const firstTimestamp = allRecords[0].Timestamp;
        allRecords.forEach(d => {
            d.Time = (d.Timestamp - firstTimestamp) / 1000;
        });
    }
    
    return aq.from(allRecords);
})();
// Apply time filter
const filteredTable = (() => {
    if (masterTable.numRows() === 0) return masterTable;
    
    const dataArray = masterTable.objects();
    const startIndex = Math.floor((filterTime[0] / 100) * dataArray.length);
    const endIndex = Math.ceil((filterTime[1] / 100) * dataArray.length);
    
    return aq.from(dataArray.slice(startIndex, endIndex));
})();
```

```js statistics
// Calculate statistics for display cards
const stats = filteredTable
    .rollup({
        firstTimestamp: aq.op.min('Timestamp'),
        lastTimestamp: aq.op.max('Timestamp'),
        startTime: aq.op.min('Time'),
        endTime: aq.op.max('Time'),
        totalDamage: aq.op.sum('Damage'),
        maxTime: aq.op.max('Time'),
        minTime: aq.op.min('Time')
    })
    .objects()[0] || {};

const timeRange = stats.maxTime - stats.minTime || 1;
const totalDamageAll = stats.totalDamage || 0;
```

```js viewTableData
// Main skill statistics table - using Apache Arrow style
const tableData = (() => {
    if (filteredTable.numRows() === 0) {
        return aq.from([{
            SkillName: 'ALL',
            Damage: 0,
            Ratio: 0,
            MaxDamage: 0,
            HitCount: 0,
            CritChance: 0,
            HeavyChance: 0,
            CritDouble: 0,
            DPS: 0
        }]);
    }
    
    // Calculate overall stats
    const overallResult = filteredTable
        .rollup({
            total_damage: aq.op.sum('Damage'),
            maxDamage: aq.op.max('Damage'),
            total_hits: aq.op.count(),
            sumCrits: d => aq.op.sum(d.HitCritical),
            sumHeavies: d => aq.op.sum(d.HitDouble),
            sumCritDoubles: d => aq.op.sum(d.CritDouble)
        })
        .objects()[0];
    
    const totalDamageAll = overallResult.total_damage || 0;
    const overallMaxDamage = overallResult.maxDamage || 0;
    const overallHitCount = overallResult.total_hits || 0;
    const overallCritChance = overallResult.total_hits > 0 ? 
        (overallResult.sumCrits / overallResult.total_hits) * 100 : 0;
    const overallHeavyChance = overallResult.total_hits > 0 ? 
        (overallResult.sumHeavies / overallResult.total_hits) * 100 : 0;
    const overallCritDouble = overallResult.total_hits > 0 ? 
        (overallResult.sumCritDoubles / overallResult.total_hits) * 100 : 0;
    
    // Calculate skill-specific stats
    const skillTable = filteredTable
        .groupby('SkillName')
        .rollup({
            Damage: aq.op.sum('Damage'),
            MaxDamage: aq.op.max('Damage'),
            HitCount: aq.op.count(),
            sumCrits: d => aq.op.sum(d.HitCritical),
            sumHeavies: d => aq.op.sum(d.HitDouble),
            sumCritDoubles: d => aq.op.sum(d.CritDouble)
        })
        .derive({
            Ratio: aq.escape(d => (d.Damage / totalDamageAll) * 100),
            DPS: aq.escape(d => d.Damage / timeRange),
            CritChance: aq.escape(d => d.HitCount > 0 ? (d.sumCrits / d.HitCount) * 100 : 0),
            HeavyChance: aq.escape(d => d.HitCount > 0 ? (d.sumHeavies / d.HitCount) * 100 : 0),
            CritDouble: aq.escape(d => d.HitCount > 0 ? (d.sumCritDoubles / d.HitCount) * 100 : 0)
        })
        .select(
            'SkillName',
            'Damage',
            { Ratio: aq.op.round('Ratio', 1) },
            'MaxDamage',
            'HitCount',
            { CritChance: aq.op.round('CritChance', 1) },
            { HeavyChance: aq.op.round('HeavyChance', 1) },
            { CritDouble: aq.op.round('CritDouble', 1) },
            { DPS: aq.op.round('DPS') }
        );
    
    // Create ALL row
    const allRow = aq.from([{
        SkillName: 'ALL',
        Damage: Math.round(totalDamageAll),
        Ratio: 100,
        MaxDamage: overallMaxDamage,
        HitCount: overallHitCount,
        CritChance: Math.round(overallCritChance * 10) / 10,
        HeavyChance: Math.round(overallHeavyChance * 10) / 10,
        CritDouble: Math.round(overallCritDouble * 10) / 10,
        DPS: Math.round(totalDamageAll / timeRange)
    }]);
    
    return allRow.concat(skillTable);
})();

const viewTableData = Inputs.table(tableData, {
    columns: [
        "SkillName", "Damage", "Ratio", "MaxDamage", "HitCount", "CritChance", "HeavyChance", "CritDouble", "DPS"
    ],
    header: {
        SkillName: "Skill Name",
        Damage: "Damage",
        Ratio: "Ratio (%)",
        MaxDamage: "Max Hit",
        HitCount: "Hit Count",
        CritChance: "Critical Hit Chance",
        HeavyChance: "Heavy Attack Chance",
        CritDouble: "Critical + Heavy Attack Chance",
        DPS: "DPS"
    },
    format: {
        Damage: sparkbar(Math.max(...tableData.column('Damage'))),
        Ratio: x => x.toFixed(1) + "%",
        CritChance: x => x.toFixed(1) + "%",
        HeavyChance: x => x.toFixed(1) + "%",
        CritDouble: x => x.toFixed(1) + "%",
        DPS: x => x.toFixed(0)
    },
    sort: "Damage",
    reverse: true,
    layout: "auto",
    rows: 30,
    select: false
});
```

```js heatMap
// Heat map visualization
const maxTime = stats.maxTime || 0;
const timeTicks = d3.range(0, maxTime + 30, 30);
const dataArray = filteredTable.objects();

// Calculate cumulative damage
const cumulative = [];
let runningTotal = 0;
dataArray.forEach(d => {
    runningTotal += d.Damage;
    cumulative.push({
        Time: d.Time,
        CumulativeDamage: runningTotal
    });
});

const _options = {
    marginLeft: 0.1*width,
    marginRight: 0.1*width,
    marginBottom: width/2.5/10,
    width: width,
    height: width/2.5
};

const viewHeatMap = Plot.plot({
    marks: [
        Plot.dot(dataArray, { x: "Time", y: "Damage", r: 0.1 }),
        () => Plot.plot({
            ..._options,
            marks: [
                Plot.line(cumulative, {
                    x: "Time",
                    y: "CumulativeDamage",
                    stroke: "var(--theme-foreground-focus)",
                })
            ],
            x: {
                label: "Time in Minutes",
                tickFormat: d => d / 60,
                ticks: timeTicks
            },
            y: { axis: "right", nice: true, line: true }
        })
    ],
    ..._options,
    x: {
        label: "Time in Minutes",
        tickFormat: d => d / 60,
        ticks: timeTicks
    },
    y: { axis: "left" }
});
```

```js
// Monster-specific tables
const monsterTables = (() => {
    const result = {};
    const dataArray = filteredTable.objects();
    
    if (dataArray.length === 0) return result;
    
    // Group by target name manually since we need the actual group structure
    const groupedByTarget = {};
    
    // First, group the data manually
    for (const row of dataArray) {
        const targetName = row.TargetName || "Unknown";
        if (!groupedByTarget[targetName]) {
            groupedByTarget[targetName] = [];
        }
        groupedByTarget[targetName].push(row);
    }
    
    // Process each target group
    for (const [targetName, targetRows] of Object.entries(groupedByTarget)) {
        if (!targetRows || targetRows.length === 0) continue;
        
        // Create table from target rows
        const targetTable = aq.from(targetRows);
        
        // Calculate target-specific totals
        const targetStats = targetTable
            .rollup({
                totalDamage: aq.op.sum('Damage'),
                minTime: aq.op.min('Time'),
                maxTime: aq.op.max('Time')
            })
            .objects()[0] || {};
        
        const totalDamage = targetStats.totalDamage || 0;
        const minTime = targetStats.minTime || 0;
        const maxTime = targetStats.maxTime || 0;
        const durationSec = Math.max(maxTime - minTime, 1);
        
        // Group by skill for this target
        const skillGroups = targetTable
            .groupby('SkillName')
            .rollup({
                Damage: aq.op.sum('Damage'),
                HitCount: aq.op.count(),
                sumCrits: d => aq.op.sum(d.HitCritical),
                sumHeavies: d => aq.op.sum(d.HitDouble),
                sumCritDoubles: d => aq.op.sum(d.CritDouble)
            })
            .derive({
                Ratio: aq.escape(d => totalDamage > 0 ? (d.Damage / totalDamage) * 100 : 0),
                DPS: aq.escape(d => d.Damage / durationSec),
                CritChance: aq.escape(d => d.HitCount > 0 ? (d.sumCrits / d.HitCount) * 100 : 0),
                HeavyChance: aq.escape(d => d.HitCount > 0 ? (d.sumHeavies / d.HitCount) * 100 : 0),
                CritDouble: aq.escape(d => d.HitCount > 0 ? (d.sumCritDoubles / d.HitCount) * 100 : 0)
            })
            .select(
                'SkillName',
                'Damage',
                { Ratio: aq.op.round('Ratio', 1) },
                'HitCount',
                { CritChance: aq.op.round('CritChance', 1) },
                { HeavyChance: aq.op.round('HeavyChance', 1) },
                { CritDouble: aq.op.round('CritDouble', 1) },
                { DPS: aq.op.round('DPS', 2) }
            );
        
        result[targetName] = skillGroups;
    }
    
    return result;
})();
```