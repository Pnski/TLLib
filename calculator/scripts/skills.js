const FilesList = [
  'Bow',
  'Crossbow',
  'Dagger',
  'Spear',
  'Staff',
  'Sword',
  'Sword2h',
  'Wand'
];

import * as load from './loader.js';
import * as math from './math.js'
import * as dom from './dom.js'

// Cached data
let TLSkill = null;
let SkillOptionalData = null;
let FormulaParameter = null;

// Utility: Load all skill-related data once
async function preloadSkillData() {
  if (!TLSkill) TLSkill = await load.SkillsData();
  if (!SkillOptionalData) SkillOptionalData = await load.SkillOptionalData();
  if (!FormulaParameter) FormulaParameter = await load.FormulaParameter();
}

export function parseQuestLogStats(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const stats = {};

  for (let i = 0; i < lines.length - 1; i++) {
    const key = lines[i];
    let value = lines[i + 1];

    // Match numeric-looking values with optional %/s/m/etc.
    if (/^[\d+-,.]+(%|s|m)?$/i.test(value)) {
      // Clean it: remove non-numeric characters, normalize commas
      const cleaned = value.replace(/[^\d.,\-]/g, '').replace(',', '');

      const numeric = parseFloat(cleaned);
      if (!stats[key]) stats[key] = [];
      stats[key].push(numeric);
      i++; // skip value line
    }
  }

  if (stats['Fail']) document.getElementById('MH.M.Min').value = stats['Fail'];
  if (stats['Fail']) document.getElementById('MH.M.Max').value = stats['Fail'];
  if (stats['Fail']) document.getElementById('MH.Spd').value = stats['Fail'];
  if (stats['Fail']) document.getElementById('MH.O.Min').value = stats['Fail'];
  if (stats['Fail']) document.getElementById('MH.O.Max').value = stats['Fail'];
  if (stats['Fail']) document.getElementById('MH.Off').value = stats['Fail'];
  if (stats['Boss Melee Critical Hit Chance']) document.getElementById('critMelee').value = stats['Boss Melee Critical Hit Chance'];
  if (stats['Boss Ranged Critical Hit Chance']) document.getElementById('critRanged').value = stats['Boss Ranged Critical Hit Chance'];
  if (stats['Boss Magic Critical Hit Chance']) document.getElementById('critMagic').value = stats['Boss Magic Critical Hit Chance'];
  if (stats['Boss Melee Heavy Attack Chance']) document.getElementById('heavyMelee').value = stats['Boss Melee Heavy Attack Chance'];
  if (stats['Boss Ranged Heavy Attack Chance']) document.getElementById('heavyRanged').value = stats['Boss Ranged Heavy Attack Chance'];
  if (stats['Boss Magic Heavy Attack Chance']) document.getElementById('heavyMagic').value = stats['Boss Magic Heavy Attack Chance'];
  if (stats['Skill Damage Boost']) document.getElementById('SDB').value = stats['Skill Damage Boost'];
  if (stats['Bonus Damage']) document.getElementById('BD').value = stats['Bonus Damage'];
  if (stats['Critical Damage']) document.getElementById('CD').value = stats['Critical Damage'];
  if (stats['Cooldown Speed']) document.getElementById('CDR').value = stats['Cooldown Speed'];
  if (stats['Buff Duration']) document.getElementById('BuffDuration').value = stats['Buff Duration'];
  if (stats['Species Damage Boost']) document.getElementById('speciesBoost').value = stats['Species Damage Boost'];
}

function querySkillData() {
  const result = {}
  document.querySelectorAll('[data-skill-id]').forEach(qSA => {
    const path = qSA.dataset.skillId;
    //console.warn(path, qSA.value, qSA.value.replace(/,/g, '.'), parseFloat(qSA.value.replace(/,/g, '.')))
    const value = parseFloat(qSA.value.replace(/,/g, '.')) || 0;
    const parts = path.split('.');
    let current = result
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current)) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts.at(-1)] = value
  })
  return result;
}


//info[0].value, info[0].data.slot, index
export async function SkillCalcNew(skillInternal, weaponSlot, index) {
  await preloadSkillData();
  const qSD = querySkillData();
  document.getElementById('cooldown-' + index).textContent = math.getCooldown(FormulaParameter[SkillOptionalData[skillInternal].cooldown_time].FormulaParameter[0].min, qSD.CDR).toFixed(4)
  document.getElementById('animlock-' + index).textContent = math.getAnimLock(TLSkill[skillInternal].skill_delay, TLSkill[skillInternal].hit_delay, qSD[weaponSlot].Spd).toFixed(4)

  const logSkill = FormulaParameter[SkillOptionalData[skillInternal].cooldown_time.replace(/CoolDown/i, 'DD_Boss')] || FormulaParameter[SkillOptionalData[skillInternal].cooldown_time.replace(/CoolDown/i, 'DD')]
  document.getElementById('dmg-percent-' + index).textContent = logSkill?.FormulaParameter[0].tooltip1 || 0
  document.getElementById('dmg-flat-' + index).textContent = logSkill?.FormulaParameter[0].tooltip2 || 0

  document.getElementById('max-dmg-' + index).textContent = math.calcSkillDmg(logSkill?.FormulaParameter[0].tooltip1 || 0, logSkill?.FormulaParameter[0].tooltip2 || 0, qSD[weaponSlot].M.Max, qSD.SDB, qSD.BD, qSD.speciesBoost, qSD.critMelee).toFixed(2)

  //document.getElementById('avg-dmg') = 0

}



async function onTraitChange(weaponType, guid, blubb) {
  console.log(guid, blubb)
  const skillList = await load.SkillList(weaponType)
  const match = skillList.find(i => i.guid === guid);
  if (match) {
    if (match.context?.presets?.preset?.specialization.traits === blubb[0].value) {
      console.log("myshitfound")
    }
  }
}

export async function fillTraits(weaponType, guid, index) {
  const dataList = []

  const [traitList, traitLooks] = await Promise.all([
    load.SkillList(weaponType),
    load.SkillLooks(weaponType)
  ])
  traitList.find(match => {
    if (match.guid === guid) {
      for (const traitId of match.trait_list.trait) {
        const skillLooks = traitLooks[traitId.trait_id]

        dataList.push({
          text: skillLooks.UIName?.LocalizedString,
          value: traitId.trait_id,
          html: `<span title="${skillLooks.SkillTraitDescription}">${skillLooks.UIName?.LocalizedString}</span>`
        })
      }
    }
  })
  document.getElementById('trait-' + index).slim.setData(dataList)
}

/**
 * 
 * @param {*} WeaponName info[0].value 
 * @param {*} slot select.dataset.slot
 */

async function onWeaponChange(WeaponName, slot) {

  const resultList = [];
  const [skillList, skillLooks] = await Promise.all([
    load.SkillList(WeaponName),
    load.SkillLooks(WeaponName)
  ])

  for (const weaponSkill of skillList) {
    const preset = weaponSkill?.context?.presets?.preset?.default?.combo_state_default;
    const rName = preset?.complex || preset?.simple || preset?.recursive_conditional;
    const result = rName?.skill_id || rName?.default_skill_id || rName?.conditional_skills?.skill_id;

    const look = skillLooks[result];
    if (!look) continue;

    const label = look.UIName?.LocalizedString || result;
    const rawPath = look.IconPath?.AssetPathName?.split('.')[0] || "";
    const iconPath = rawPath.replace("/Game/", "") + ".png";

    resultList.push({
      text: label,
      value: result,
      data: {
        slot: slot,
        weaponType: WeaponName,
        guid: weaponSkill.guid
      },
      html: `<img src="${iconPath}" style="height: 20px; vertical-align: middle; margin-right: 6px;">${label}`
    });
  }

  document.getElementsByName("skillSelect").forEach(async (select) => {
    var dataList = select.slim.getData();
    dataList = dataList.filter(item => {
      return !item.label?.includes(slot);
    })

    dataList.push({
      label: slot,
      options: resultList
    })
    select.slim.setData(dataList);
  })
}

function fillSelectWeapon() {
  document.getElementsByName("weaponSelect").forEach(select => {
    if (!select.slim) {
      const dataList = [];
      dataList.push({
        text: 'Select a Weapon',
        value: '',
        placeholder: true,
        disabled: true
      })
      for (const WeaponName of FilesList) {
        const label = WeaponName;
        const iconPath = './Image/Weapon/' + WeaponName + ".png";

        dataList.push({
          text: label,
          html: `<img src="${iconPath}" style="height: 30px; vertical-align: middle; margin-right: 6px;">${label}`
        });
      }
      select.slim = new SlimSelect({
        select: select,
        data: dataList,
        settings: {
          showSearch: false
        },
        events: {
          afterChange: async (info) => {
            onWeaponChange(info[0].value, select.dataset.slot)
          }
        }
      })
    }
  })
}

console.log("✅ skills.js loaded");

// --- Main Docsify Plugin Logic ---

window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
  console.log("✅ Docsify plugin registered");

  // This hook runs after each page is loaded.
  hook.doneEach(async () => {
    const currentPage = vm.route.path;

    // Only execute specific logic for the calculator page.
    if (!currentPage.includes(dom.CALCULATOR_PATH)) {
      console.log("Skipping calculator logic on non-calculator page.");
      return;
    }

    console.log("✅ Executing calculator logic for:", currentPage);

    // Preload data if needed
    await preloadSkillData();

    // Setup UI event listeners
    dom.setupPasteWindowListeners();

    // Inject and initialize the skill table
    dom.injectSkillTable();

    dom.dataFieldChange();

    fillSelectWeapon()
  });
});