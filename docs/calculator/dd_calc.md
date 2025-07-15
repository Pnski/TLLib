

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
      <th><label for="MH.M.Min">MainHand Dmg Min</label><input type="number" data-skill-id="MH.M.Min" id="MH.M.Min"></th>
      <th><label for="MH.M.Max">MainHand Dmg Max</label><input type="number" data-skill-id="MH.M.Max" id="MH.M.Max"></th>
      <th><label for="MH.Spd">MainHand Attack Speed</label><input type="number" data-skill-id="MH.Spd" id="MH.Spd"></th>
      <th><label for="MH.O.Min">OffHand Dmg Min</label><input type="number" data-skill-id="MH.O.Min" id="MH.O.Min"></th>
      <th><label for="MH.O.Max">OffHand Dmg Max</label><input type="number" data-skill-id="MH.O.Max" id="MH.O.Max"></th>
      <th><label for="MH.Off">OffHand Chance</label><input type="number" step="any" data-skill-id="MH.Off" id="MH.Off"></th>
    </tr>
    <tr>
      <th><label for="OH.M.Min">Alt OffHand Dmg Min</label><input type="number" data-skill-id="OH.M.Min" id="OH.M.Min"></th>
      <th><label for="OH.M.Max">Alt OffHand Dmg Max</label><input type="number" data-skill-id="OH.M.Max" id="OH.M.Max"></th>
      <th><label for="OH.Spd">Alt OffHand Attack Speed</label><input type="number" data-skill-id="OH.Spd" id="OH.Spd"></th>
      <th><label for="OH.O.Min">OffOffHand Dmg Min</label><input type="number" data-skill-id="OH.O.Min" id="OH.O.Min"></th>
      <th><label for="OH.O.Max">OffOffHand Dmg Max</label><input type="number" data-skill-id="OH.O.Max" id="OH.O.Max"></th>
      <th><label for="OH.Off">OffOffHand Chance</label><input type="number" step="any" data-skill-id="OH.Off" id="OH.Off"></th>
    </tr>
    <tr>
      <th><label for="critMelee">Melee Crit Chance</label><input type="number" data-skill-id="critMelee" id="critMelee"></th>
      <th><label for="critRanged">Ranged Crit Chance</label><input type="number" data-skill-id="critRanged" id="critRanged"></th>
      <th><label for="critMagic">Magic Crit Chance</label><input type="number" data-skill-id="critMagic" id="critMagic"></th>
    </tr>
    <tr>
      <th><label for="heavyMelee">Melee Heavy Chance</label><input type="number" data-skill-id="heavyMelee" id="heavyMelee"></th>
      <th><label for="heavyRanged">Ranged Heavy Chance</label><input type="number" data-skill-id="heavyRanged" id="heavyRanged"></th>
      <th><label for="heavyMagic">Magic Heavy Chance</label><input type="number" data-skill-id="heavyMagic" id="heavyMagic"></th>
    </tr>
    <tr>
      <th><label for="SDB">Skill Damage Boost</label><input type="number" data-skill-id="SDB" id="SDB"></th>
      <th><label for="BD">Bonus Damage</label><input type="number" data-skill-id="BD" id="BD"></th>
      <th><label for="CD">Critical Damage</label><input type="number" step="any" data-skill-id="CD" id="CD"></th>
      <th><label for="CDR">Cooldown Speed</label><input type="number" step="any" data-skill-id="CDR" id="CDR"></th>
    </tr>
    <tr>
      <th><label for="BuffDuration">Buff Duration</label><input type="number" step="any" data-skill-id="BuffDuration" id="BuffDuration"></th>
      <th><label for="speciesBoost">Species Dmg Boost</label><input type="number" data-skill-id="speciesBoost" id="speciesBoost"></th>
      <th><label for="speciesDamage">Species Bonus Damage</label><input type="number" data-skill-id="speciesDamage" id="speciesDamage"></th>
    </tr>
  </tbody>
</table>


<h2>Skills</h2>
<table>
  <thead>
    <tr>
      <th>Skill</th>
      <th>dmg%</th>
      <th>dmg(Flat)</th>
      <th>Avg-Dmg</th>
      <th>Max-Dmg</th>
      <th>CDR</th>
      <th>AnimationLock</th>
    </tr>
  </thead>
  <tbody id="table-skills-select"></tbody>
</table>