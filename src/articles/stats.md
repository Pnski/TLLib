# Stats

```js
const TLBaseMainStatStream = await FileAttachment("/static/sources/TLBaseMainStat.gz").stream()
const TLBaseMainStatStreamDecompressed = TLBaseMainStatStream.pipeThrough(new DecompressionStream("gzip"));
const TLBaseMainStat = (await new Response(TLBaseMainStatStreamDecompressed).json())[0].Rows;
```

```js
const allStatsFlat = Object.values(TLBaseMainStat).flatMap(entry => {
  const point = entry.Point;
  const type = entry.Type;

  return Object.entries(entry.Stat).flatMap(([statName, val]) => {
    if (val && typeof val === "object") {
      return Object.entries(val)
        .filter(([_, num]) => num !== 0)
        .map(([nestedName, num]) => ({
          point,
          type,
          stat: `${statName}.${nestedName}`,
          value: num
        }));
    } 
    if (val !== 0) {
      return { point, type, stat: statName, value: val };
    }
    return [];
  });
});

```

```js
const createStatExplorer = (typeSuffix, label) => {
  const data = allStatsFlat.filter(d => d.type.endsWith(typeSuffix));
  const uniqueStats = [...new Set(data.map(d => d.stat))].sort();

  const input = Inputs.checkbox(uniqueStats, {
    label: `Select ${label} Stats`
  });

  const container = html`<div style="card">
    ${input}
    <div class="plot-container"></div>
  </div>`;

  const plotDiv = container.querySelector(".plot-container");

  const update = () => {
    const selectedValues = input.value; 

    const newPlot = Plot.plot({
      title: `${label} Progression`,
      x: { label: `${label} Points`, grid: true },
      y: { label: "Value", grid: true, nice: true },
      color: { legend: true },
      width: width,
      height: width / 3,
      marks: [
        Plot.ruleY([0]),
        Plot.lineY(data.filter(d => selectedValues.includes(d.stat)), {
          x: "point",
          y: "value",
          stroke: "stat",
          strokeWidth: 2,
          tip: true
        })
      ]
    });

    plotDiv.replaceChildren(newPlot);
  };

  input.addEventListener("input", update);

  update();

  return container;
};
```

## Strength

```js
createStatExplorer("STR", "Strength")
```

## Dexterity

```js
createStatExplorer("DEX", "Dexterity")
```

## Wisdom

```js
createStatExplorer("INT", "Wisdom")
```

## Perception

```js
createStatExplorer("PER", "Perception")
```

## Fortitude

```js
createStatExplorer("CON", "Fortitude")
```

## Secondary Stats

## Hit and Evasion

Evasion Chance Formula for PvP:

```tex
Eva_{Chance} = \frac{Your_{Evasion} − Enemy_{Hit}}{Your_{Evasion} − Enemy_{Hit} + 1000}*100
```

Evasion Chance Formula for PvE (Diminishing Returns):

```tex
Eva_{Chance} = \frac{Your_{Evasion}}{Your_{Evasion} + 1000}*100
```

```js
view(Plot.plot({
    title: "Hit Evasion / Evasion Curve", 
    marks: [
        Plot.line(
            d3.range(0,4050,50),
            {
                x: d => d, 
                y: d => (d / (d + 1000)) * 100, 
                stroke: "var(--theme-foreground-focus)",
                tip: true
            }
        ),
    ],
    x: {
        label: "Evasion Stat",
        grid: true
    },
    y: {
        label: "Resulting %",
        domain: [0, 100],
        tickFormat: d => `${d}%`,
        grid: true
    },
    width: width, 
    height: width / 3
}))
```
## Critical Hit and Endurance

Critical Chance Formula for PvP:
```tex
Crit_{Chance} = \frac{Your_{Crit}-Enemy_{Endurance}}{Your_{Crit}-Enemy_{Endurance}+1000}*100
```

Critical Chance Formula for PvE (Diminishing Returns):
```tex
Crit_{Chance} = \frac{Your_{Crit}}{Your_{Crit}+1000}*100
```

```js
view(Plot.plot({
    title: "Critical Chance Curve", 
    marks: [
        Plot.line(
            d3.range(0,4050,50),
            {
                x: d => d, 
                y: d => (d / (d + 1000)) * 100, 
                stroke: "var(--theme-foreground-focus)",
                tip: true
            }
        ),
    ],
    x: {
        label: "Critical Hit Stat",
        grid: true
    },
    y: {
        label: "Resulting %",
        domain: [0, 100],
        tickFormat: d => `${d}%`,
        grid: true
    },
    width: width, 
    height: width / 3
}))
```

## Skill Damage Boost and Skill Damage Resistance

Skill Damage Resistance Formula for PvE:

```tex
Skill_{DamageResistance} = \frac{Skill_{DamageResistance}}{Skill_{DamageResistance}+1000}*100
```

Skill Damage Boost Formula for PvE:

```tex
Skill_{DamageBoost} = \frac{Skill_{DamageBoost}}{Skill_{DamageBoost}+1000}*100
```

```js
view(Plot.plot({
    title: "Skill Damage Boost Curve", 
    marks: [
        Plot.line(
            d3.range(0,2010,10),
            {
                x: d => d, 
                y: d => (d / (d + 1000)) * 100, 
                stroke: "var(--theme-foreground-focus)",
                tip: true
            }
        ),
    ],
    x: {
        label: "Skill Damage Boost Stat",
        grid: true
    },
    y: {
        label: "Resulting %",
        domain: [0, 100],
        tickFormat: d => `${d}%`,
        grid: true
    },
    width: width, 
    height: width / 3
}))
```


## Bonus Damage and Damage Reduction

```tex
Damage_{Total} = Damage_{Base} + Damage_{Bonus}
```

```tex
DamageRed_{Total} = EnemyDamage_{Total} - Damage_{Reduction}
```

## Cooldown Speed

Cooldown Speed to Cooldown Reduction Formula:
```tex
Cooldownreduction = \frac {Cooldown_{Speed}}{100 + Cooldown_{Speed}}
```

```js
view(Plot.plot({
    title: "Cooldown Speed Curve", 
    marks: [
        Plot.line(
            d3.range(0,150,1),
            {
                x: d => d, 
                y: d => (d / (d + 100)) * 100, 
                stroke: "var(--theme-foreground-focus)",
                tip: true
            }
        ),
    ],
    x: {
        label: "Skill Damage Boost Stat",
        grid: true
    },
    y: {
        label: "Resulting %",
        domain: [0, 100],
        tickFormat: d => `${d}%`,
        grid: true
    },
    width: width, 
    height: width / 3
}))
```

## Heavy Attack Chance

Heavy Attack Chance Formula:

```tex
HeavyAttackChance = \frac{HeavyAttack}{HeavyAttack + 1000}*100
```

```js
view(Plot.plot({
    title: "Heavy Attack Chance Curve", 
    marks: [
        Plot.line(
            d3.range(0,3050,50),
            {
                x: d => d, 
                y: d => (d / (d + 1000)) * 100, 
                stroke: "var(--theme-foreground-focus)",
                tip: true
            }
        ),
    ],
    x: {
        label: "Heavy Attack Stat",
        grid: true
    },
    y: {
        label: "Resulting %",
        domain: [0, 100],
        tickFormat: d => `${d}%`,
        grid: true
    },
    width: width, 
    height: width / 3
}))
```

## Defense

Defense Formula:

```tex
DmgReduction = \frac{Defense}{Defense + 2500}*100
```

```js
view(Plot.plot({
    title: "Damage Reduction Curve", 
    marks: [
        Plot.line(
            d3.range(0,6050,50),
            {
                x: d => d, 
                y: d => (d / (d + 2500)) * 100, 
                stroke: "var(--theme-foreground-focus)",
                tip: true
            }
        ),
    ],
    x: {
        label: "Defense Stat",
        grid: true
    },
    y: {
        label: "Resulting %",
        domain: [0, 100],
        tickFormat: d => `${d}%`,
        grid: true
    },
    width: width, 
    height: width / 3
}))
```

## Sources

Source: [Maxroll](https://maxroll.gg/throne-and-liberty/resources/in-depth-stats-guide)

Source: [Reddit](https://www.reddit.com/r/throneandliberty/comments/1ig5mjt/comment/mam1ek2)