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
    heavyDmg: 100,
    curse: 113
};

const stats = ['minDmg', 'maxDmg', 'sdb', 'ssdb', 'bonusDmg', 'critHit', 'critDamage', 'heavyHit', 'heavyDmg', 'curse'];

const colors = {
    minDmg: 'rgba(79, 70, 229, 1)',
    maxDmg: 'rgba(234, 179, 8, 1)',
    sdb: 'rgba(16, 185, 129, 1)',
    ssdb: 'rgba(30, 255, 0, 1)',
    bonusDmg: 'rgba(247, 0, 255, 1)',
    critHit: 'rgba(139, 92, 246, 1)',
    critDamage: 'rgba(0, 238, 255, 1)',
    heavyHit: 'rgba(59, 130, 246, 1)',
    heavyDmg: 'rgba(0, 37, 97, 1)',
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
    heavyDmg: 'Heavy % Increase',
    curse: 'Curse/Heal %'
};

// Charts will be stored here
const charts = {};

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
                //tooltip: { mode: 'index', intersect: false }
                 zoom: {
                    zoom: {
                        wheel: { enabled: true },   // Zoom with mouse wheel
                        pinch: { enabled: true },   // Zoom with pinch gesture
                        mode: "xy"                  // Zoom both axes
                    },
                    pan: {
                        enabled: true,
                        mode: "xy",
                        modifierKey: null,
                        scaleMode: "xy",
                        treshold: 1
                    }
                }
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
    stats.forEach(stat => {
        cfg.options.scales[stat] = {
            id: stat,
            type: 'linear',
            position: 'bottom',
            title: {
                display: true,
                text: statLabels[stat] || stat,
                color: colors[stat]
            },
            ticks: { color: colors[stat] },
            grid: { color: colors[stat] }
        };
    });

    return cfg;
}

function createCharts() {
    ["skillDmg", "dotDmg", "healing", "hot"].forEach(id => {
        charts[id] = new Chart(document.getElementById(id).getContext('2d'), makeConfig());
    });
    updateChart();
}

function generateData(stat, calcFn) {
    const data = [];
    const start = state[stat] * 0.5;
    const end = state[stat] * 1.5;
    const step = Math.max(1, Math.floor((end - start) / 100));

    for (let i = start; i <= end; i += step) {
        const tempState = { ...state, [stat]: i };
        data.push({ x: i, y: calcFn(tempState) });
    }
    return data;
}

function centerAxes() {
    Object.values(charts).forEach(chart => {
        stats.forEach(stat => {
            const center = state[stat];
            const range = center * 0.5;
            chart.options.scales[stat].min = center - range;
            chart.options.scales[stat].max = center + range;
        });
    });
}

function updateChart() {
    const datasets = {
        skillDmg: [],
        dotDmg: [],
        healing: [],
        hot: []
    };

    // Reference markers
    const avgBaseDamage = math.calcAvgSkillDmg(
        state.skillPer, state.skillFlat,
        { Min: state.minDmg, Max: state.maxDmg },
        state.sdb, state.bonusDmg, state.ssdb,
        state.critDamage, state.critHit, state.heavyHit
    );
    const avgDot = math.calcAvgDotDmg(
        state.skillPer, state.skillFlat,
        { Min: state.minDmg, Max: state.maxDmg },
        state.sdb, state.ssdb,
        state.critDamage, state.critHit, state.heavyHit,
        state.curse
    );
    const avgHeal = avgBaseDamage * (1 + state.curse / 100);
    const avgHot = avgDot;

    const marker = (val, axis) => ({
        label: 'Average',
        data: [{ x: state[axis], y: val }],
        borderColor: 'rgb(255,99,132)',
        backgroundColor: 'rgba(255,99,132,0.8)',
        pointRadius: 10,
        showLine: false,
        pointStyle: 'star',
        xAxisID: axis,
        yAxisID: 'y'
    });

    datasets.skillDmg.push(marker(avgBaseDamage, "maxDmg"));
    datasets.dotDmg.push(marker(avgDot, "maxDmg"));
    datasets.healing.push(marker(avgHeal, "maxDmg"));
    datasets.hot.push(marker(avgHot, "maxDmg"));

    // Per-stat curves
    stats.forEach(stat => {
        const opts = {
            borderColor: colors[stat],
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            xAxisID: stat,
            yAxisID: 'y',
            label: statLabels[stat]
        };

        datasets.skillDmg.push({
            ...opts,
            data: generateData(stat, s => math.calcAvgSkillDmg(
                s.skillPer, s.skillFlat,
                { Min: s.minDmg, Max: s.maxDmg },
                s.sdb, s.bonusDmg, s.ssdb,
                s.critDamage, s.critHit,
                s.heavyHit, s.heavyDmg
            ))
        });

        datasets.dotDmg.push({
            ...opts,
            data: generateData(stat, s => math.calcAvgDotDmg(
                s.skillPer, s.skillFlat,
                { Min: s.minDmg, Max: s.maxDmg },
                s.sdb, s.ssdb,
                s.critDamage, s.critHit,
                s.heavyHit, s.heavyDmg,
                s.curse
            ))
        });

        datasets.healing.push({
            ...opts,
            data: generateData(stat, s =>
                math.calcAvgSkillDmg(
                    s.skillPer, s.skillFlat,
                    { Min: s.minDmg, Max: s.maxDmg },
                    s.sdb, s.bonusDmg, s.ssdb,
                    s.critDamage, s.critHit,
                s.heavyHit, s.heavyDmg
                ) * (1 + s.curse / 100)
            )
        });

        datasets.hot.push({
            ...opts,
            data: generateData(stat, s => math.calcAvgDotDmg(
                s.skillPer, s.skillFlat,
                { Min: s.minDmg, Max: s.maxDmg },
                s.sdb, s.ssdb,
                s.critDamage, s.critHit,
                s.heavyHit, s.heavyDmg,
                s.curse
            ))
        });
    });

    // Apply datasets
    Object.entries(datasets).forEach(([id, data]) => {
        charts[id].data.datasets = data;
        charts[id].update();
    });

    // Center axes dynamically
    centerAxes();
}

console.log("plotSkillGraph.js loaded");

window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
    hook.doneEach(async () => {
        const currentPage = vm.route.path;
        if (!currentPage.includes('/calculator/skillGraph')) {
            return;
        }

        console.log(currentPage);
        createCharts();

        const sliders = document.querySelectorAll('input[type="range"]');
        const numberInputs = document.querySelectorAll('input[type="float"]');

        sliders.forEach(slider => {
            slider.addEventListener('input', e => {
                const value = parseInt(e.target.value);
                state[e.target.id] = value;
                document.getElementById(e.target.id + 'Input').value = value;
                updateChart();
            });
        });

        numberInputs.forEach(input => {
            input.addEventListener('input', e => {
                const value = parseInt(e.target.value);
                const sliderId = e.target.id.replace('Input', '');
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
