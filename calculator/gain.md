# Graph

| | | |
| --- | --- | --- |
| <label for="skillPer" class="block text-sm font-medium text-slate-700">Skill % Damage: </label> | <input type="range" id="skillPer" min="0" max="3000" value="550" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"> | <input type="float" id="skillPerInput" min="0" max="3000" value="550"> |
| <label for="skillFlat" class="block text-sm font-medium text-slate-700">Skill Flat Damage: </label> | <input type="range" id="skillFlat" min="0" max="1500" value="35" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"> | <input type="float" id="skillFlatInput" min="0" max="1500" value="35"> |
| <label for="minDmg" class="block text-sm font-medium text-slate-700">Minimal Damage: </label> | <input type="range" id="minDmg" min="0" max="2000" value="100" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"> | <input type="float" id="minDmgInput" min="0" max="2000" value="100"> |
| <label for="maxDmg" class="block text-sm font-medium text-slate-700">Maximal Damage: </label> | <input type="range" id="maxDmg" min="0" max="2000" value="670" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"> | <input type="float" id="maxDmgInput" min="0" max="2000" value="670"> |
| <label for="sdb" class="block text-sm font-medium text-slate-700">Skill Damage Boost: </label> | <input type="range" id="sdb" min="0" max="2000" value="300" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"> | <input type="float" id="sdbInput" min="0" max="2000" value="300"> |
| <label for="ssdb" class="block text-sm font-medium text-slate-700">Species Damage Boost: </label> | <input type="range" id="ssdb" min="0" max="1000" value="120" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"> | <input type="float" id="ssdbInput" min="0" max="1000" value="120"> |
| <label for="bonusDmg" class="block text-sm font-medium text-slate-700">Bonus Damage: </label> | <input type="range" id="bonusDmg" min="0" max="500" value="20" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"> | <input type="float" id="bonusDmgInput" min="0" max="500" value="20"> |
| <label for="critHit" class="block text-sm font-medium text-slate-700">Critical Hit Chance: </label> | <input type="range" id="critHit" min="0" max="5000" value="1600" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"> | <input type="float" id="critHitInput" min="0" max="5000" value="1600"> |
| <label for="critDamage" class="block text-sm font-medium text-slate-700">Critical Damage: </label> | <input type="range" id="critDamage" min="0" max="150" value="34" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"> | <input type="float" id="critDamageInput" min="0" max="150" value="34"> |
| <label for="heavyHit" class="block text-sm font-medium text-slate-700">Heavy Hit Chance: </label> | <input type="range" id="heavyHit" min="0" max="3000" value="1400" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"> | <input type="float" id="heavyHitInput" min="0" max="3000" value="1400"> |
| <label for="curse" class="block text-sm font-medium text-slate-700">Curse/Heal %: </label> | <input type="range" id="curse" min="0" max="300" value="113" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"> | <input type="float" id="curseInput" min="0" max="300" value="113"> |


## Skill Damage
<div>
  <canvas id="skillDmg"></canvas>
</div>

## Damage over Time (DoT)

<div>
  <canvas id="dotDmg"></canvas>
</div>

## Heal

<div>
  <canvas id="healing"></canvas>
</div>

## Healing over Time (HoT)

<div>
  <canvas id="hot"></canvas>
</div>