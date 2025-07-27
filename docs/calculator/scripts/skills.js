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
  var lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const stats = {};
  //check for floating point
  for (let i = 0; i < lines.length - 1; i++) {

    if (lines[i].includes('.') && lines[i].includes(',')) {
      console.log("myline ,.", lines[i])
      if (lines[i].indexOf(',') < lines[i].indexOf('.')) {
        console.log(", < .")
        lines = text.replace(/\,/g, '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      } else {
        console.log(", > .")
        lines = text.replace(/\./g, '').replace(/\,/g, '.').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      }
      break
    } else if (lines[i].includes('.') && lines[i].endsWith('%')) {
      console.log("myline .%", lines[i])
      lines = text.replace(/\,/g, '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      break
    } else if (lines[i].includes(',') && lines[i].endsWith('%')) {
      console.log("myline ,%", lines[i])
      lines = text.replace(/\./g, '').replace(/\,/g, '.').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      break
    }
  }
  //should find at least one floating point break the loop and cleaned up the whole text and therefor all lines
  for (let i = 0; i < lines.length - 1; i++) {
    const key = lines[i];
    let value = lines[i + 1];

    if (parseFloat(value)) { //any number
      if (!stats[key]) stats[key] = [];
      stats[key].push(parseFloat(value));
    }
  }

  console.log(stats)

  const statMapWithFallbacks = {
    'critMelee': ['Boss Melee Critical Hit Chance', 'Melee Critical Hit Chance'],
    'critRanged': ['Boss Ranged Critical Hit Chance', 'Ranged Critical Hit Chance'],
    'critMagic': ['Boss Magic Critical Hit Chance', 'Magic Critical Hit Chance'],
    'heavyMelee': ['Boss Melee Heavy Attack Chance', 'Melee Heavy Attack Chance'],
    'heavyRanged': ['Boss Ranged Heavy Attack Chance', 'Ranged Heavy Attack Chance'],
    'heavyMagic': ['Boss Magic Heavy Attack Chance', 'Magic Heavy Attack Chance'],
    'SDB': ['Skill Damage Boost'],
    'BD': ['Bonus Damage'],
    'CD': ['Critical Damage'],
    'CDR': ['Cooldown Speed'],
    'BuffDuration': ['Buff Duration'],
    'speciesBoost': ['Species Damage Boost']
  };

  for (const elementId in statMapWithFallbacks) {
    if (statMapWithFallbacks.hasOwnProperty(elementId)) {
      const possibleStatKeys = statMapWithFallbacks[elementId];
      let foundValue = null;

      for (const statKey of possibleStatKeys) {
        if (stats.hasOwnProperty(statKey) && stats[statKey] !== undefined && stats[statKey] !== null) {
          foundValue = stats[statKey];
          break;
        }
      }

      const element = document.getElementById(elementId);
      if (element) {
        if (foundValue !== null) {
          element.value = foundValue[0] || foundValue;
        }
      }
    }
  }
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

  //check if trait changes skill (e.g. guillotineBlade)


  //Check for dynamic stats?
  console.log("check dynamic stats", FormulaParameter[SkillOptionalData[skillInternal].cooldown_time])

  document.getElementById('cooldown-' + index).textContent = math.getCooldown(FormulaParameter[SkillOptionalData[skillInternal].cooldown_time].FormulaParameter[0].min, qSD.CDR).toFixed(4)
  document.getElementById('animlock-' + index).textContent = math.getAnimLock(TLSkill[skillInternal].skill_delay, TLSkill[skillInternal].hit_delay, qSD[weaponSlot].Spd).toFixed(4)

  const logSkill = FormulaParameter[SkillOptionalData[skillInternal].cooldown_time.replace(/CoolDown/i, 'DD_Boss')] || FormulaParameter[SkillOptionalData[skillInternal].cooldown_time.replace(/CoolDown/i, 'DD')]
  //if (logSkill?.FormulaParameter[0].)
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