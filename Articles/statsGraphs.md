# PvE Stats

## Hit and Evasion

<div>
  <canvas id="HitEvasion"></canvas>
</div>

## Critical Hit and Endurance

<div>
  <canvas id="CritEndurance"></canvas>
</div>

## Skill Damage Boost and Skill Damage Resistance

<div>
  <canvas id="sdbsdr"></canvas>
</div>

## Cooldown Speed

<div>
  <canvas id="cdr"></canvas>
</div>

## Heavy Attack Chance

<div>
  <canvas id="doubleAttack"></canvas>
</div>

## Defense

<div>
  <canvas id="dmgReduction"></canvas>
</div>


<script>
const charts = {};

function makeConfig() {
    return {
        type: 'line',
        data: { datasets: [] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1,
            scales: {
                x: { type: 'linear', title: { display: true, text: 'Points Invested' } },
                y: { type: 'linear', title: { display: true, text: '%' } }
            }
        }
    };
}

const makeCharts = ["HitEvasion", "CritEndurance", "sdbsdr", "cdr", "doubleAttack", "dmgReduction"];
for (const statType of makeCharts) {
    charts[statType] = new Chart(
        document.getElementById(statType).getContext('2d'),
        makeConfig()
    );
}

function createCharts(chartName, chartData) {
    const datasets = [{
            label: chartName,
            data: chartData,
            tension: 0.1,
            hidden: false
        }];

    charts[chartName].data.datasets = datasets;
    charts[chartName].update();

}

let HitEvaDataSet = []
for (let i = 0; i <= 6000; i += 100) {
    const yValue = (i/(i+1000)*100);
    HitEvaDataSet.push({ x: i, y: yValue });
}
createCharts("HitEvasion", HitEvaDataSet)
createCharts("CritEndurance", HitEvaDataSet)
createCharts("doubleAttack", HitEvaDataSet)
let sdbsdrDataSet = []
for (let i = 0; i <= 2000; i += 50) {
    const yValue = (i/(i+1000)*100);
    sdbsdrDataSet.push({ x: i, y: yValue });
}
createCharts("sdbsdr", sdbsdrDataSet)
let cdrDataSet = []
for (let i = 0; i <= 200; i += 10) {
    const yValue = (i/(100+i));
    cdrDataSet.push({ x: i, y: yValue });
}
createCharts("cdr", cdrDataSet)
let dmgRedDataSet = []
for (let i = 0; i <= 8000; i += 200) {
    const yValue = (i/(i+2500)*100);
    dmgRedDataSet.push({ x: i, y: yValue });
}
createCharts("dmgReduction", dmgRedDataSet)

</script>