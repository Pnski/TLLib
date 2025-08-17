import * as math from './math.js'

const state = {
    skillPer: 550,
    skillFlat: 35,
    minDmg: 200,
    maxDmg: 670,
    sdb: 300,
    ssdb: 120,
    bonusDmg: 20,
    critHit: 1600,
    critDamage: 34,
    heavyHit: 1400,
    curse: 113
};

const stats = ['minDmg', 'maxDmg', 'sdb', 'ssdb', 'bonusDmg', 'critHit', 'critDamage', 'heavyHit', 'curse'];

const colors = {
    minDmg: 'rgba(79, 70, 229, 1)',
    maxDmg: 'rgba(234, 179, 8, 1)',
    sdb: 'rgba(16, 185, 129, 1)',
    ssdb: 'rgba(30, 255, 0, 1)',
    bonusDmg: 'rgba(247, 0, 255, 1)',
    critHit: 'rgba(139, 92, 246, 1)',
    critDamage: 'rgba(0, 238, 255, 1)',
    heavyHit: 'rgba(59, 130, 246, 1)',
    curse: 'rgba(100, 0, 131, 1)'
};

const statLabels = {
    minDmg: 'Minimal Damage',
    maxDmg: 'Maximal Damage',
    sdb: 'Skill Damage Boost',
    ssdb: 'Species Damage Boost',
    bonusDmg: 'Bonus Damage',
    critHit: 'Critical Hit Chance',
    critDamage: 'Critical Damage',
    heavyHit: 'Heavy Hit Chance',
    curse: 'Curse/Heal %'
};

let damageChart;
let dotChart;
let healChart;
let hotChart;

function createChart() {
    function makeConfig() {
        const cfg = {
            type: 'line',
            data: { datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1,
                plugins: {
                    legend: { position: 'right' },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: {
                        type: 'linear',
                        position: 'left',
                        beginAtZero: false,
                        title: { display: true, text: 'Damage' }
                    }
                }
            }
        };

        // Dynamically add a scale per stat
        stats.forEach(statVariety => {
            cfg.options.scales[statVariety] = {
                id: statVariety,              // must match dataset xAxisID
                type: 'linear',
                position: 'bottom',
                title: {
                  display: true,
                  text: statLabels[statVariety] || statVariety,
                  color: colors[statVariety]
                },
                ticks: {
                    color: colors[statVariety]
                },
                grid: {
                  color: colors[statVariety]
                }
            };
        });

        return cfg;
    }

    // fresh config objects for each chart
    damageChart = new Chart(document.getElementById('skillDmg').getContext('2d'), makeConfig());
    dotChart = new Chart(document.getElementById('dotDmg').getContext('2d'), makeConfig());
    healChart = new Chart(document.getElementById('healing').getContext('2d'), makeConfig());
    hotChart = new Chart(document.getElementById('hot').getContext('2d'), makeConfig());
    updateChart();
}

function updateChart() {
    const datasetsSkills = [];
    const datasetsDots = [];
    const datasetsHeal = [];
    const datasetsHots = [];

    const avgBaseDamage = math.calcAvgSkillDmg(
        state.skillPer, state.skillFlat,
        {Min:state.minDmg, Max:state.maxDmg},
        state.sdb, state.bonusDmg, state.ssdb,
        state.critDamage, state.critHit, state.heavyHit
    );

    const avgDotDmg = math.calcAvgDotDmg(
        state.skillPer, state.skillFlat,
        {Min:state.minDmg, Max:state.maxDmg},
        state.sdb, state.ssdb,
        state.critDamage, state.critHit, state.heavyHit,
        state.curse
    );

    const avgBaseHeal = math.calcAvgSkillDmg(
        state.skillPer, state.skillFlat,
        {Min:state.minDmg, Max:state.maxDmg},
        state.sdb, state.bonusDmg, state.ssdb,
        state.critDamage, state.critHit, state.heavyHit
    ) * (1+(state.curse/100));

    const avgHot = math.calcAvgDotDmg(
        state.skillPer, state.skillFlat,
        {Min:state.minDmg, Max:state.maxDmg},
        state.sdb, state.ssdb,
        state.critDamage, state.critHit, state.heavyHit,
        state.curse
    );

    // reference marker (assign it to one axis, e.g. minDmg)
    datasetsSkills.push({
        label: 'Average Damage',
        data: [{x: state.maxDmg, y: avgBaseDamage}],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        pointRadius: 10,
        showLine: false,
        pointStyle: 'star',
        xAxisID: 'maxDmg',
        yAxisID: 'y'
    });
    datasetsDots.push({
        label: 'Average Damage',
        data: [{x: state.maxDmg, y: avgDotDmg}],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        pointRadius: 10,
        showLine: false,
        pointStyle: 'star',
        xAxisID: 'maxDmg',
        yAxisID: 'y'
    });
    datasetsHeal.push({
        label: 'Average Damage',
        data: [{x: state.maxDmg, y: avgBaseHeal}],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        pointRadius: 10,
        showLine: false,
        pointStyle: 'star',
        xAxisID: 'maxDmg',
        yAxisID: 'y'
    });
    datasetsHots.push({
        label: 'Average Damage',
        data: [{x: state.maxDmg, y: avgHot}],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        pointRadius: 10,
        showLine: false,
        pointStyle: 'star',
        xAxisID: 'maxDmg',
        yAxisID: 'y'
    });

    // datasets per stat
    stats.forEach(statVariety => {
        const dataPointsSkills = [];
        const dataPointsDots = [];
        const dataPointsHeal = [];
        const dataPointsHots = [];
        const startVal = state[statVariety] * 0.5;
        const endVal = state[statVariety] * 1.5;
        const step = Math.max(1, Math.floor((endVal - startVal) / 100));

        for (let i = startVal; i <= endVal; i += step) {
            const tempState = { ...state, [statVariety]: i };
            const damage = math.calcAvgSkillDmg(
                tempState.skillPer, tempState.skillFlat,
                {Min:tempState.minDmg, Max:tempState.maxDmg},
                tempState.sdb, tempState.bonusDmg, tempState.ssdb,
                tempState.critDamage, tempState.critHit, tempState.heavyHit
            );
            dataPointsSkills.push({ x: i, y: damage });
            const dot = math.calcAvgDotDmg(
                tempState.skillPer, tempState.skillFlat,
                {Min:tempState.minDmg, Max:tempState.maxDmg},
                tempState.sdb, tempState.ssdb,
                tempState.critDamage, tempState.critHit, tempState.heavyHit,
                tempState.curse
            );
            dataPointsDots.push({ x: i, y: dot });
            const heal = (math.calcAvgSkillDmg(
                tempState.skillPer, tempState.skillFlat,
                {Min:tempState.minDmg, Max:tempState.maxDmg},
                tempState.sdb, tempState.bonusDmg, tempState.ssdb,
                tempState.critDamage, tempState.critHit, tempState.heavyHit
            ) * ( 1 + ( tempState.curse / 100 )));
            console.log(tempState.curse)
            dataPointsHeal.push({ x: i, y: heal });
            const hot = math.calcAvgDotDmg(
                tempState.skillPer, tempState.skillFlat,
                {Min:tempState.minDmg, Max:tempState.maxDmg},
                tempState.sdb, tempState.ssdb,
                tempState.critDamage, tempState.critHit, tempState.heavyHit,
                tempState.curse
            );
            dataPointsHots.push({ x: i, y: hot });
        }

        datasetsSkills.push({
            label: statLabels[statVariety],
            data: dataPointsSkills,
            borderColor: colors[statVariety],
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            xAxisID: statVariety,
            yAxisID: 'y'
        });
        datasetsDots.push({
            label: statLabels[statVariety],
            data: dataPointsDots,
            borderColor: colors[statVariety],
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            xAxisID: statVariety,
            yAxisID: 'y'
        });
        datasetsHeal.push({
            label: statLabels[statVariety],
            data: dataPointsHeal,
            borderColor: colors[statVariety],
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            xAxisID: statVariety,
            yAxisID: 'y'
        });
        datasetsHots.push({
            label: statLabels[statVariety],
            data: dataPointsHots,
            borderColor: colors[statVariety],
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            xAxisID: statVariety,
            yAxisID: 'y'
        });
    });

    stats.forEach(statVariety => {
        const center = state[statVariety];
        const range = center * 0.5;

        damageChart.options.scales[statVariety].min = center - range;
        damageChart.options.scales[statVariety].max = center + range;
        dotChart.options.scales[statVariety].min = center - range;
        dotChart.options.scales[statVariety].max = center + range;
        healChart.options.scales[statVariety].min = center - range;
        healChart.options.scales[statVariety].max = center + range;
        hotChart.options.scales[statVariety].min = center - range;
        hotChart.options.scales[statVariety].max = center + range;
    });

    damageChart.data.datasets = datasetsSkills;
    damageChart.update();
    dotChart.data.datasets = datasetsDots;
    dotChart.update();
    healChart.data.datasets = datasetsHeal;
    healChart.update();
    hotChart.data.datasets = datasetsHots;
    hotChart.update();
}

console.log("✅ plot.js loaded");

const CALCULATOR_PATH = '/calculator/gain';

// --- Main Docsify Plugin Logic ---

window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
  console.log("✅ Docsify plugin registered");

  // This hook runs after each page is loaded.
  hook.doneEach(async () => {
    const currentPage = vm.route.path;

    if (!currentPage.includes(CALCULATOR_PATH)) {
      console.log("Skipping calculator logic on non-calculator page.");
      return;
    }

    console.log("✅ Executing calculator logic for:", currentPage);

    createChart();

    const sliders = document.querySelectorAll('input[type="range"]');
    const numberInputs = document.querySelectorAll('input[type="float"]');

    sliders.forEach(slider => {
        slider.addEventListener('input', (event) => {
            const value = parseInt(event.target.value);
            state[event.target.id] = value;
            document.getElementById(event.target.id + 'Input').value = value;
            updateChart();
        });
    });

    numberInputs.forEach(input => {
        input.addEventListener('input', (event) => {
            const value = parseInt(event.target.value);
            const sliderId = event.target.id.replace('Input', '');
            if (!isNaN(value)) {
                state[sliderId] = value;
                document.getElementById(sliderId).value = value;
                updateChart();
            }
        });
    });

    updateChart();
  });
});