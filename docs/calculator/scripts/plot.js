import * as math from './math.js'

const state = {
    skillPer: 170,
    skillFlat: 35,
    minDmg: 100,
    maxDmg: 500,
    sdb: 200,
    bonusDmg: 20,
    critHit: 1500,
    critDamage: 25,
    heavyHit: 1000
};

const stats = ['minDmg', 'maxDmg', 'sdb', 'bonusDmg', 'critHit', 'critDamage', 'heavyHit'];

const colors = {
    minDmg: 'rgba(79, 70, 229, 1)',
    maxDmg: 'rgba(234, 179, 8, 1)',
    sdb: 'rgba(16, 185, 129, 1)',
    bonusDmg: 'rgba(239, 68, 68, 1)',
    critHit: 'rgba(139, 92, 246, 1)',
    critDamage: 'rgba(0, 238, 255, 1)',
    heavyHit: 'rgba(59, 130, 246, 1)'
};

const statLabels = {
    minDmg: 'Minimal Damage',
    maxDmg: 'Maximal Damage',
    sdb: 'Skill Damage Boost',
    bonusDmg: 'Bonus Damage',
    critHit: 'Critical Hit Chance',
    critDamage: 'Critical Damage',
    heavyHit: 'Heavy Hit Chance'
};

let damageChart;
let dotChart;

function createChart() {
    function makeConfig() {
        const cfg = {
            type: 'line',
            data: { datasets: [] },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 0.75,
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
                    text: statLabels[statVariety] || statVariety
                }
            };
        });

        return cfg;
    }

    // fresh config objects for each chart
    damageChart = new Chart(document.getElementById('skillDmg').getContext('2d'), makeConfig());
    dotChart    = new Chart(document.getElementById('dotDmg').getContext('2d'), makeConfig());

    updateChart();
}

function updateChart() {
    const datasets = [];

    const avgBaseDamage = math.calcAvgSkillDmg(
        state.skillPer, state.skillFlat,
        {Min:state.minDmg, Max:state.maxDmg},
        state.sdb, state.bonusDmg, 0,
        state.critDamage, state.critHit, state.heavyHit
    );

    const avgDotDmg = math.calcDotDmg(
        state.skillPer, state.skillFlat,
        {Min:state.minDmg, Max:state.maxDmg},
        state.sdb, state.bonusDmg, 0,
        state.critDamage, state.critHit, state.heavyHit
    )

    // reference marker (assign it to one axis, e.g. minDmg)
    datasets.push({
        label: 'Average Damage',
        data: [{x: state.minDmg, y: avgBaseDamage}],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        pointRadius: 10,
        showLine: false,
        pointStyle: 'star',
        xAxisID: 'minDmg',
        yAxisID: 'y'
    });

    // datasets per stat
    stats.forEach(statVariety => {
        const dataPoints = [];
        const startVal = state[statVariety] * 0.5;
        const endVal = state[statVariety] * 1.5;
        const step = Math.max(1, Math.floor((endVal - startVal) / 50));

        for (let i = startVal; i <= endVal; i += step) {
            const tempState = { ...state, [statVariety]: i };
            const damage = math.calcAvgSkillDmg(
                tempState.skillPer, tempState.skillFlat,
                {Min:tempState.minDmg, Max:tempState.maxDmg},
                tempState.sdb, tempState.bonusDmg, 0,
                tempState.critDamage, tempState.critHit, tempState.heavyHit
            );
            dataPoints.push({ x: i, y: damage });
        }

        datasets.push({
            label: statLabels[statVariety],
            data: dataPoints,
            borderColor: colors[statVariety],
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            xAxisID: statVariety,   // matches scale id
            yAxisID: 'y'
        });
    });

    damageChart.data.datasets = datasets;
    damageChart.update();
    dotChart.data.datasets = datasets;
    dotChart.update();
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

    // Only execute specific logic for the calculator page.
    if (!currentPage.includes(CALCULATOR_PATH)) {
      console.log("Skipping calculator logic on non-calculator page.");
      return;
    }

    console.log("✅ Executing calculator logic for:", currentPage);

    createChart();

    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.addEventListener('input', (event) => {
            state[event.target.id] = parseInt(event.target.value);
            document.getElementById(event.target.id + 'Value').innerText = event.target.value;
            updateChart();
        });
    });

    // Preload data if needed
    updateChart();
  });
});