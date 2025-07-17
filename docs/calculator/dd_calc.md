# Skill Damage Calculation

## Alpha Stage 0.1a

- no traits
- avg not working
- offhand not working
- multihits not calculated
- some skills seem to have no animationspeed?
- Weapon from Questlogparse is currently not parsed... need new idea how to get all the stuff in the right order
- dmg/s /min not calculated
- heavy not calculated
- species bonus damage not calculated

- should currently working on basic skills at 1 hit

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

<button id="openPasteWindow">📋 Paste Stats</button>

<div id="pasteOverlay" style="display: none;">
  <div id="pasteModal">
    <h3>Paste Your Stats from Questlog.gg</h3>
    <div class="pasteContent">
      <textarea id="statInput" placeholder="Paste stats here..."></textarea>
      <img src="./calculator/questlog1.png" alt="Questlog Screenshot" id="pasteImage">
    </div>
    <div>
      <button id="parseStats">Parse</button>
      <button id="parseClipboard">Clipboard</button>
      <button id="closePasteWindow">Cancel</button>
    </div>
  </div>
</div>

<table>
  <tbody>
    <tr>
      <th><label for="MH.M.Min">MainHand Dmg Min</label><input type="float" inputmode=" data-skill-id="MH.M.Min" id="MH.M.Min"></th>
      <th><label for="MH.M.Max">MainHand Dmg Max</label><input type="float" data-skill-id="MH.M.Max" id="MH.M.Max"></th>
      <th><label for="MH.Spd">MainHand Attack Speed</label><input type="float" data-skill-id="MH.Spd" id="MH.Spd"></th>
      <th><label for="MH.O.Min">OffHand Dmg Min</label><input type="float" data-skill-id="MH.O.Min" id="MH.O.Min"></th>
      <th><label for="MH.O.Max">OffHand Dmg Max</label><input type="float" data-skill-id="MH.O.Max" id="MH.O.Max"></th>
      <th><label for="MH.Off">OffHand Chance</label><input type="float" step="any" data-skill-id="MH.Off" id="MH.Off"></th>
    </tr>
    <tr>
      <th><label for="OH.M.Min">Alt OffHand Dmg Min</label><input type="float" data-skill-id="OH.M.Min" id="OH.M.Min"></th>
      <th><label for="OH.M.Max">Alt OffHand Dmg Max</label><input type="float" data-skill-id="OH.M.Max" id="OH.M.Max"></th>
      <th><label for="OH.Spd">Alt OffHand Attack Speed</label><input type="float" data-skill-id="OH.Spd" id="OH.Spd"></th>
      <th><label for="OH.O.Min">OffOffHand Dmg Min</label><input type="float" data-skill-id="OH.O.Min" id="OH.O.Min"></th>
      <th><label for="OH.O.Max">OffOffHand Dmg Max</label><input type="float" data-skill-id="OH.O.Max" id="OH.O.Max"></th>
      <th><label for="OH.Off">OffOffHand Chance</label><input type="float" step="any" data-skill-id="OH.Off" id="OH.Off"></th>
    </tr>
    <tr>
      <th><label for="critMelee">Melee Crit Chance</label><input type="float" data-skill-id="critMelee" id="critMelee"></th>
      <th><label for="critRanged">Ranged Crit Chance</label><input type="float" data-skill-id="critRanged" id="critRanged"></th>
      <th><label for="critMagic">Magic Crit Chance</label><input type="float" data-skill-id="critMagic" id="critMagic"></th>
    </tr>
    <tr>
      <th><label for="heavyMelee">Melee Heavy Chance</label><input type="float" data-skill-id="heavyMelee" id="heavyMelee"></th>
      <th><label for="heavyRanged">Ranged Heavy Chance</label><input type="float" data-skill-id="heavyRanged" id="heavyRanged"></th>
      <th><label for="heavyMagic">Magic Heavy Chance</label><input type="float" data-skill-id="heavyMagic" id="heavyMagic"></th>
    </tr>
    <tr>
      <th><label for="SDB">Skill Damage Boost</label><input type="float" data-skill-id="SDB" id="SDB"></th>
      <th><label for="BD">Bonus Damage</label><input type="float" data-skill-id="BD" id="BD"></th>
      <th><label for="CD">Critical Damage</label><input type="float" step="any" data-skill-id="CD" id="CD"></th>
      <th><label for="CDR">Cooldown Speed</label><input type="float" step="any" data-skill-id="CDR" id="CDR"></th>
    </tr>
    <tr>
      <th><label for="BuffDuration">Buff Duration</label><input type="float" step="any" data-skill-id="BuffDuration" id="BuffDuration"></th>
      <th><label for="speciesBoost">Species Dmg Boost</label><input type="float" data-skill-id="speciesBoost" id="speciesBoost"></th>
    </tr>
  </tbody>
</table>

## Buffs

| ActivateBuffs? |
| --- |
| 0/1 |

| Buffname1 | Buffname2 |
| --- | --- |
| X | X


<h2>Skills</h2>
<table>
  <thead>
    <tr>
      <th>Skill</th>
      <th>Traits</th>
      <th>dmg(%)</th>
      <th>dmg(Flat)</th>
      <th>Max-Crit</th>
      <th>Avg-Dmg</th>
      <th>Cooldown (s)</th>
      <th>AnimationLock (s)</th>
    </tr>
  </thead>
  <tbody id="table-skills-select"></tbody>
</table>