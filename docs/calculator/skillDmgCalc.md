# Skill Damage Calculation

## Alpha Stage 0.1b

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

<table>
  <thead>
    <tr>
      <th scope="col">Mainhand Weapon</th>
      <th scope="col">Secondary Weapon</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <label for="mainhandWeaponSelect" class="sr-only">Select Mainhand Weapon</label>
        <select name="weaponSelect" data-slot="MainHand" id="mainhandWeaponSelect"></select>
      </td>
      <td>
        <label for="offhandWeaponSelect" class="sr-only">Select Secondary Weapon</label>
        <select name="weaponSelect" data-slot="OffHand" id="offhandWeaponSelect"></select>
      </td>
    </tr>
  </tbody>
</table>

## Data

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
      <th colspan="6">Main Weapon Statistics</th>
    </tr>
    <tr>
      <td><label for="MainHand.M.Min">Dmg Min</label></td>
      <td><input type="number" step="any" data-skill-id="MainHand.M.Min" id="MainHand.M.Min"></td>
      <td><label for="MainHand.M.Max">Dmg Max</label></td>
      <td><input type="number" step="any" data-skill-id="MainHand.M.Max" id="MainHand.M.Max"></td>
      <td><label for="MainHand.Spd">Attack Speed</label></td>
      <td><input type="number" step="any" data-skill-id="MainHand.Spd" id="MainHand.Spd"></td>
    </tr>
    <tr>
      <td><label for="MainHand.O.Min">OffHand Dmg Min</label></td>
      <td><input type="number" step="any" data-skill-id="MainHand.O.Min" id="MainHand.O.Min"></td>
      <td><label for="MainHand.O.Max">OffHand Dmg Max</label></td>
      <td><input type="number" step="any" data-skill-id="MainHand.O.Max" id="MainHand.O.Max"></td>
      <td><label for="MainHand.Off">OffHand Chance</label></td>
      <td><input type="number" step="any" data-skill-id="MainHand.Off" id="MainHand.Off"></td>
    </tr>
    <tr>
      <th colspan="6">Secondary Weapon Statistics</th>
    </tr>
    <tr>
      <td><label for="OffHand.M.Min">Dmg Min</label></td>
      <td><input type="number" step="any" data-skill-id="OffHand.M.Min" id="OffHand.M.Min"></td>
      <td><label for="OffHand.M.Max">Dmg Max</label></td>
      <td><input type="number" step="any" data-skill-id="OffHand.M.Max" id="OffHand.M.Max"></td>
      <td><label for="OffHand.Spd">Attack Speed</label></td>
      <td><input type="number" step="any" data-skill-id="OffHand.Spd" id="OffHand.Spd"></td>
    </tr>
    <tr>
      <td><label for="OffHand.O.Min">OffHand Dmg Min</label></td>
      <td><input type="number" step="any" data-skill-id="OffHand.O.Min" id="OffHand.O.Min"></td>
      <td><label for="OffHand.O.Max">OffHand Dmg Max</label></td>
      <td><input type="number" step="any" data-skill-id="OffHand.O.Max" id="OffHand.O.Max"></td>
      <td><label for="OffHand.Off">OffHand Chance</label></td>
      <td><input type="number" step="any" data-skill-id="OffHand.Off" id="OffHand.Off"></td>
    </tr>
    <tr>
      <th colspan="6">Crit and Heavy Chances</th>
    </tr>
    <tr>
      <td><label for="critMelee">Melee Crit Chance</label></td>
      <td><input type="number" step="any" data-skill-id="critMelee" id="critMelee"></td>
      <td><label for="critRanged">Ranged Crit Chance</label></td>
      <td><input type="number" step="any" data-skill-id="critRanged" id="critRanged"></td>
      <td><label for="critMagic">Magic Crit Chance</label></td>
      <td><input type="number" step="any" data-skill-id="critMagic" id="critMagic"></td>
    </tr>
    <tr>
      <td><label for="heavyMelee">Melee Heavy Chance</label></td>
      <td><input type="number" step="any" data-skill-id="heavyMelee" id="heavyMelee"></td>
      <td><label for="heavyRanged">Ranged Heavy Chance</label></td>
      <td><input type="number" step="any" data-skill-id="heavyRanged" id="heavyRanged"></td>
      <td><label for="heavyMagic">Magic Heavy Chance</label></td>
      <td><input type="number" step="any" data-skill-id="heavyMagic" id="heavyMagic"></td>
    </tr>
    <tr>
      <th colspan="6">Damage and Utility Boosts</th>
    </tr>
    <tr>
      <td><label for="SDB">Skill Damage Boost</label></td>
      <td><input type="number" step="any" data-skill-id="SDB" id="SDB"></td>
      <td><label for="BD">Bonus Damage</label></td>
      <td><input type="number" step="any" data-skill-id="BD" id="BD"></td>
      <td><label for="CD">Critical Damage</label></td>
      <td><input type="number" step="any" data-skill-id="CD" id="CD"></td>
    </tr>
    <tr>
      <td><label for="CDR">Cooldown Speed</label></td>
      <td><input type="number" step="any" data-skill-id="CDR" id="CDR"></td>
      <td><label for="BuffDuration">Buff Duration</label></td>
      <td><input type="number" step="any" data-skill-id="BuffDuration" id="BuffDuration"></td>
      <td><label for="speciesBoost">Species Dmg Boost</label></td>
      <td><input type="number" step="any" data-skill-id="speciesBoost" id="speciesBoost"></td>
    </tr>
  </tbody>
</table>

## Skills

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
      <th>Buff Duration</th>
      <th>Avg-Dmg/s</th>
    </tr>
  </thead>
  <tbody id="table-skills-select"></tbody>
  <tfoot>
  <tr>
    <th colspan="5">Average</th>
    <th id='avg-avg-dmg'></th>
    <th id='avg-cooldown'></th>
    <th id='avg-animation'></th>
    <th>SUM:</th>
    <th id='avg-avg-dps'></th>
  </tr>
  </tfood>
</table>

## Changelog

### 0.1b
- refractored dom contend
- more responsive slimselects
- doesnt rebuild the whole page anymore when changing 1 item