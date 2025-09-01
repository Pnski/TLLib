import { fetchGzip } from './loader.js'

const charts = {};

function makeConfig() {
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
                        boxWidth: 8,
                        padding: 8,
                        align: 'start'
                    }
                },
                zoom: {
                    zoom: {
                        wheel: { enabled: true },
                        pinch: { enabled: true },
                        mode: "xy"
                    },
                    pan: {
                        enabled: true,
                        mode: "xy"
                    }
                }
            },
            scales: {
                x: { type: 'linear', title: { display: true, text: 'Point Value' } },
                y: { type: 'linear', title: { display: true, text: 'Value' } }
            }
        }
    };
}

function createCharts(helperData) {
    for (const statType of Object.keys(helperData)) {
        charts[statType] = new Chart(
            document.getElementById(statType).getContext('2d'),
            makeConfig()
        );

        const datasets = [];
        for (const [statName, data] of Object.entries(helperData[statType])) {
            datasets.push({
                label: statName,
                data,
                tension: 0.1,
                hidden: true // start hidden
            });
        }

        charts[statType].data.datasets = datasets;
        charts[statType].update();
    }
}

console.log("plotstats.js loaded")

window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
    hook.doneEach(async () => {
        const currentPage = vm.route.path;
        if (!currentPage.includes('/calculator/stats')) return;

        try {
            const helperData = JSON.parse(await fetchGzip('sources/TLBaseMainStat.helper'))
            createCharts(helperData);
        } catch (error) {
            console.error("Failed to load helper stats:", error);
        }
    });
});
