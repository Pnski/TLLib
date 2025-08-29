import { fetchGzip } from './loader.js'

var baseStats = {}
const charts = {};

function makeConfig() {
    const xMin = 0
    const xMax = 150
    return {
        type: 'line',
        data: { datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 0.5,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 8,   // smaller color boxes
                        padding: 8,     // tighter spacing
                        align: 'start',
                        filter: function (legendItem, chart) {
                            const chartData = chart.datasets[legendItem.datasetIndex].data
                            const allZero = chartData.every(point => {
                                if (typeof point === "number") return point === 0;
                                if (typeof point === "object" && "y" in point) return point.y === 0;
                                return false;
                            });
                            return !allZero; // only keep if not all zero
                        }
                    }
                },
                //tooltip: { mode: 'index', intersect: false },
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
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Point Value'
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Value'
                    }
                }
            }
        }
    };
}

function createCharts(stats) {
    [
        'EPcStatsType::kSTR',
        'EPcStatsType::kDEX',
        'EPcStatsType::kINT',
        'EPcStatsType::kPER',
        'EPcStatsType::kCON'
    ].forEach(id => {
        charts[id] = new Chart(document.getElementById(id).getContext('2d'), makeConfig());
    });

    updateCharts(stats)
}

function updateCharts(stats) {
    for (const chartId in charts) {
        const datasets = []
        stats.forEach(element => {
            const dataSet = {
                label: element,
                data: [],
                tension: 0.1,
                hidden: true
            };

            for (const key in baseStats) {
                const entry = baseStats[key];
                if (entry.Type === chartId && entry.Point >= 10 && entry.Point <= 99) {
                    let yValue = null;
                    if (element.includes('.')) {
                        const [parent, nested] = element.split('.');
                        if (entry.Stat[parent] && entry.Stat[parent][nested] !== undefined) {
                            yValue = entry.Stat[parent][nested];
                        }
                    } else {
                        yValue = entry.Stat[element];
                    }

                    if (yValue !== null && yValue !== undefined) {
                        dataSet.data.push({ x: entry.Point, y: yValue });
                    }
                }
            }
            datasets.push(dataSet)
        });


        charts[chartId].data.datasets = datasets;
        charts[chartId].update();
    }
}

console.log("plotstats.js loaded")

window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
    hook.doneEach(async () => {
        const currentPage = vm.route.path;
        if (!currentPage.includes('/calculator/stats')) {
            return;
        }

        try {
            baseStats = JSON.parse(await fetchGzip('sources/TLBaseMainStat'))[0]["Rows"];
            const stats = new Set();
            for (const point in baseStats) {
                for (const statName in baseStats[point].Stat) {
                    if (typeof baseStats[point].Stat[statName] === 'object') {
                        for (const nestedStat in baseStats[point].Stat[statName]) {
                            stats.add(`${statName}.${nestedStat}`);
                        }
                    } else {
                        stats.add(statName);
                    }
                }
            }
            createCharts(stats);
        } catch (error) {
            console.error("Failed to load or parse base stats:", error);
        }
    });
});