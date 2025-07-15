

# Skill Damage Calculation

<h2>Weapons</h2>
<table>
  <thead>
    <tr>
      <th>Mainhand</th>
      <th>Offhand</th>
    <tr>
  </thead>
  <tbody>
    <tr>
      <th><select name="weaponSelect" id="Mainhand"></select></th>
      <th><select name="weaponSelect" id="Offhand"></select></th>
    </tr>
  </tbody>
</table>

<h2>Data</h2>
<table>
  <tbody>
    <tr>
      <th><label>MainHandDmgMin</label><input type="number" id="mh1"></th>
      <th><label>MainHandDmgMax</label><input type="number" id="mh2"></th>
      <th><label>MainHandAttackSpeed</label><input type="number" id="mhs"></th>
      <th><label>MainOffHandDmgMin</label><input type="number" id="mh3"></th>
      <th><label>MainOffHandDmgMax</label><input type="number" id="mh4"></th>
      <th><label>MainOffHandChance</label><input type="number" id="mh5"></th>
    </tr>
    <tr>
      <th><label>OffHandDmgMin</label><input type="number" id="oh1"></th>
      <th><label>OffHandDmgMax</label><input type="number" id="oh2"></th>
      <th><label>OffHandAttackSpeed</label><input type="number" id="ohs"></th>
      <th><label>OffOffHandDmgMin</label><input type="number" id="oh3"></th>
      <th><label>OffOffHandDmgMax</label><input type="number" id="oh4"></th>
      <th><label>OffOffHandChance</label><input type="number" id="oh3"></th>
    </tr>
    <tr>
      <th><label>Melee Critical Hit Chance</label><input type="number" id="critMelee"></th>
      <th><label>Ranged Critical Hit Chance</label><input type="number" id="critRanged"></th>
      <th><label>Magic Critical Hit Chance</label><input type="number" id="critMagic"></th>
    </tr>
    <tr>
      <th><label>Melee Heavy Attack Chance</label><input type="number" id="heavyMelee"></th>
      <th><label>Ranged Heavy Attack Chance</label><input type="number" id="heavyRanged"></th>
      <th><label>Magic Heavy Attack Chance</label><input type="number" id="heavyMagic"></th>
    </tr>
    <tr>
      <th><label>Skill Damage Boost</label><input type="number" id="SDB"></th>
      <th><label>Bonus Damage</label><input type="number" id="BD"></th>
      <th><label>Critical Damage</label><input type="number" id="CD"></th>
      <th><label>Cooldown Speed</label><input type="number" id="CDR"></th>
    </tr>
    <tr>
      <th><label>Buff Duration</label><input type="number" id="BuffDuration"></th>
      <th><label>Species Damage Boost</label><input type="number" id="speciesBoost"></th>
      <th><label>Species Bonus Damage</label><input type="number" id="speciesDamage"></th>
    </tr>

  </tbody>
</table>


<h2>Skills</h2>
<table>
  <thead>
    <tr>
      <th>Skill</th>
      <th>dmg%</th>
      <th>dmg(F)</th>
      <th>Avg-Dmg</th>
      <th>Max-Dmg</th>
      <th>CDR</th>
      <th>AnimationLock</th>
    </tr>
  </thead>
  <tbody id="table-skills-select"></tbody>
</table>