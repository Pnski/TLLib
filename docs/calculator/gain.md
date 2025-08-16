# Gains

<div class="p-4 sm:p-8 bg-slate-50 min-h-screen font-inter text-slate-800">
  <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
    <h1 class="text-3xl font-bold text-center mb-6 text-indigo-800">Damage Parameters</h1>
    <p class="text-center text-lg mb-8 text-slate-600">
      Adjust the sliders to set the base values for your damage calculations.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- First Column of Sliders -->
      <div class="space-y-6">
        <div>
          <label for="skillPer" class="block text-sm font-medium text-slate-700">Skill % Damage: <span id="skillPerValue" class="font-semibold text-indigo-600">170</span></label>
          <input type="range" id="skillPer" min="0" max="3000" value="170" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label for="skillFlat" class="block text-sm font-medium text-slate-700">Skill Flat Damage: <span id="skillFlatValue" class="font-semibold text-indigo-600">500</span></label>
          <input type="range" id="skillFlat" min="0" max="1000" value="500" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label for="minDmg" class="block text-sm font-medium text-slate-700">Minimal Damage: <span id="minDmgValue" class="font-semibold text-indigo-600">100</span></label>
          <input type="range" id="minDmg" min="0" max="1000" value="100" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label for="maxDmg" class="block text-sm font-medium text-slate-700">Maximal Damage: <span id="maxDmgValue" class="font-semibold text-indigo-600">500</span></label>
          <input type="range" id="maxDmg" min="0" max="1000" value="500" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer">
        </div>
      </div>
      <!-- Second Column of Sliders -->
      <div class="space-y-6">
        <div>
          <label for="sdb" class="block text-sm font-medium text-slate-700">Skill Damage Boost: <span id="sdbValue" class="font-semibold text-indigo-600">200</span></label>
          <input type="range" id="sdb" min="0" max="1000" value="200" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label for="bonusDmg" class="block text-sm font-medium text-slate-700">Bonus Damage: <span id="bonusDmgValue" class="font-semibold text-indigo-600">100</span></label>
          <input type="range" id="bonusDmg" min="0" max="1000" value="100" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label for="critHit" class="block text-sm font-medium text-slate-700">Critical Hit Chance: <span id="critHitValue" class="font-semibold text-indigo-600">250</span></label>
          <input type="range" id="critHit" min="0" max="1000" value="250" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label for="critDamage" class="block text-sm font-medium text-slate-700">Critical Damage: <span id="critDamageValue" class="font-semibold text-indigo-600">500</span></label>
          <input type="range" id="critDamage" min="0" max="1000" value="500" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer">
        </div>
        <div>
          <label for="heavyHit" class="block text-sm font-medium text-slate-700">Heavy Hit Chance: <span id="heavyHitValue" class="font-semibold text-indigo-600">500</span></label>
          <input type="range" id="heavyHit" min="0" max="1000" value="500" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer">
        </div>
      </div>
    </div>
  </div>
</div>

<div>
  <canvas id="skillDmg"></canvas>
</div>
<div>
  <canvas id="dotDmg"></canvas>
</div>