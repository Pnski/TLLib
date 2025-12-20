---
toc: false
---

# Damage Calculator

```js
import * as math from "/modules/math.js"

const damageParams = view(
  Inputs.form(
    {
      // --- Base Skill & Weapon Stats ---
      skillPer:   Inputs.range([0, 3000], {value: 550,  step: 1, label: "Skill % Damage:", width}),
      skillFlat:  Inputs.range([0, 1500], {value: 35,   step: 1, label: "Skill Flat Damage:", width}),
      minDmg:     Inputs.range([0, 2000], {value: 100,  step: 1, label: "Minimal Damage:", width}),
      maxDmg:     Inputs.range([0, 2000], {value: 670,  step: 1, label: "Maximal Damage:", width}),
      
      // --- Multiplicative Buffs ---
      monsterDmg: Inputs.range([0, 200],  {value: 0,    step: 1, label: "Monster Damage Boost %:", width}),
      dmgBuff1:   Inputs.range([0, 300],  {value: 0,    step: 1,   label: "Damage Buff % (Skill):", width}),
      dmgBuff2:   Inputs.range([0, 300],  {value: 0,    step: 1,   label: "Secondary Buff %:", width}),
      
      // --- Diminishing Return Boosts & Flat Bonus ---
      sdb:        Inputs.range([0, 2000], {value: 300,  step: 0.1, label: "Skill Damage Boost:", width}),
      ssdb:       Inputs.range([0, 1000], {value: 120,  step: 0.1, label: "Species Damage Boost:", width}),
      bonusDmg:   Inputs.range([0, 500],  {value: 20,   step: 1, label: "Bonus Damage:", width}),
      
      // --- Mitigation ---
      defense:    Inputs.range([0, 5000], {value: 0,    step: 1,   label: "Target's Defense:", width}),
      
      // --- Critical & Heavy Stats ---
      critHit:    Inputs.range([0, 5000], {value: 1600, step: 1, label: "Critical Hit Chance:", width}),
      critDamage: Inputs.range([0, 150],  {value: 34,   step: 1, label: "Critical Damage:", width}),
      heavyHit:   Inputs.range([0, 3000], {value: 1400, step: 1, label: "Heavy Hit Chance:", width}),
      heavyDmg:   Inputs.range([0, 300],  {value: 100,  step: 1, label: "Heavy % Increase:", width}),
      curse:      Inputs.range([0, 300],  {value: 113,  step: 0.1, label: "Curse/Heal %:", width})
    },
    {
      template: (inputs) => htl.html`<div class="card">
        ${Object.values(inputs)}
      </div>`
    }
  )
);
```

<div class="card grid grid-cols-3">
    <h1 class="grid-colspan-3">Damage</h1>
    <div class="card">
        <h2>Critical Attack Chance</h2>
        ${(math.getChance(damageParams.critHit) * 100).toFixed(2)} %
    </div>
    <div class="card">
        <h2>Heavy Attack Chance</h2>
        ${(math.getChance(damageParams.heavyHit) * 100).toFixed(2)} %
    </div>
    <div class="card">
        <h2>Total Skill Boost</h2>
        ${((math.getChance(damageParams.sdb) + math.getChance(damageParams.ssdb)) * 100).toFixed(2)} %
    </div>
    <div class="card">
        <h2>Min Damage</h2>
        ${math.calcMinDmg(damageParams).toFixed(2)}
    </div>
    <div class="card">
        <h2>Max Crit Damage</h2>
        ${math.calcMaxCrit(damageParams).toFixed(2)}
    </div>
    <div class="card">
        <h2>Average Total Damage</h2>
        ${math.calcAvgSkillDmg(damageParams).toFixed(2)}
    </div>
    <h1 class="grid-colspan-3">DoT Damage</h1>
    <div class="card">
        <h2>AVG Damage</h2>
        ${math.calcMinDot(damageParams).toFixed(2)}
    </div>
    <div class="card">
        <h2>Max Crit Damage</h2>
        ${math.calcMaxCritDot(damageParams).toFixed(2)}
    </div>
    <div class="card">
        <h2>Average Total Damage</h2>
        ${math.calcAvgDotDmg(damageParams).toFixed(2)}
    </div>
</div>

<div class="card grid grid-cols-3">
    <h1 class="grid-colspan-3">Healing Output</h1>
    <div class="card">
        <h2>Heal Crit Chance</h2>
        ${(math.getHealChance(damageParams.critHit) * 100).toFixed(2)} %
    </div>
    <div class="card">
        <h2>Heal Heavy Chance</h2>
        ${(math.getHealChance(damageParams.heavyHit) * 100).toFixed(2)} %
    </div>
    <div class="card">
        <h2>Heal Skill Boost</h2>
        ${((math.getChance(damageParams.sdb)) * 100).toFixed(2)} %
    </div>
    <div class="card">
        <h2>Min Heal</h2>
        ${math.calcMinHeal(damageParams).toFixed(2)}
    </div>
    <div class="card">
        <h2>Max Crit Heal</h2>
        ${math.calcMaxCritHeal(damageParams).toFixed(2)}
    </div>
    <div class="card text-green-400 font-bold">
        <h2>Average Total Healing</h2>
        ${math.calcAvgHeal(damageParams).toFixed(2)}
    </div>
    <h1 class="grid-colspan-3">HoT Output</h1>
    <div class="card">
        <h2>Min Heal</h2>
        ${math.calcMinHot(damageParams).toFixed(2)}
    </div>
    <div class="card">
        <h2>Max Crit Heal</h2>
        ${math.calcMaxCritHot(damageParams).toFixed(2)}
    </div>
    <div class="card text-green-400 font-bold">
        <h2>Average Total Healing</h2>
        ${math.calcAvgHot(damageParams).toFixed(2)}
    </div>
</div>