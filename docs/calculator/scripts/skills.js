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

import { getKeys, getObjects, getValues } from './deepSeek.js'

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

function sumAvg() {
  // Helper function to sum values by regex-matching ID
  function sumByIdPattern(regex, onlySum = false) {
    let sum = 0;
    let count = 0;

    document.querySelectorAll('*[id]').forEach(element => {
      if (regex.test(element.id)) {
        const val = parseFloat(element.textContent);
        if (!isNaN(val) && val !== 0) {
          sum += val;
          count++;
        }
      }
    });
    if (onlySum) return sum
    return count > 0 ? (sum / count) : 0;
  }

  // Match only ids like avg-dmg-[0-12]
  document.getElementById('avg-avg-dmg').textContent = sumByIdPattern(/^avg-dmg-\d{1,2}$/).toFixed(2);

  // Match only cooldown-[0-12]
  document.getElementById('avg-cooldown').textContent = sumByIdPattern(/^cooldown-\d{1,2}$/).toFixed(2);

  // Match only animlock-[0-12]
  document.getElementById('avg-animation').textContent = sumByIdPattern(/^animlock-\d{1,2}$/).toFixed(2);

  // Match only avg-dmg-s-[0-12]
  document.getElementById('avg-avg-dps').textContent = sumByIdPattern(/^avg-dmg-s-\d{1,2}$/, true).toFixed(2);
}



//info[0].value, info[0].data.slot, index
export async function SkillCalcNew(skillInternal, weaponSlot, index) {
  await preloadSkillData(); //only for slow connection, usually it skips fully
  const qSD = querySkillData();

  const weaponType = document.querySelector(`select[data-slot="${weaponSlot}"]`).slim.getSelected();

  const skillList = await load.SkillList(weaponType) //needed for traits

  const activeTraitList = [] //trait holder

  if (document.getElementById(`trait-${index}`).slim.getSelected().length === 0) {
    console.log('Nothing selected');
  } else {
    for (const skill of Object.values(document.getElementById(`trait-${index}`).slim.getSelected())) {
      //console.log(getObjects(skillList, '', skill))
      const changeSkill = [...getValues(getObjects(skillList, '', skill), 'default_skill_id'), ...getValues(getObjects(skillList, '', skill), 'skill_id')]
      if (!(changeSkill.length == 0)) {
        console.log("changed skill new", changeSkill, skillInternal, weaponSlot, index)
        skillInternal = changeSkill //WP_SW2_S_PowerAttack -> WP_SW2_S_PowerAttack_SP
      }

      for (let i = 1; i <= 4; i++) {
        const value = getValues(getObjects(skillList, '', skill), 'trait_dynamic_stat_id_0' + i);
        if (value && value.length > 0) {
          activeTraitList.push(value);
        }
      }
    }
  }

  console.log(skillInternal, SkillOptionalData[skillInternal])
  var logSkill = FormulaParameter[SkillOptionalData[skillInternal].cooldown_time.replace(/CoolDown/i, 'DD_Boss')] || FormulaParameter[SkillOptionalData[skillInternal].cooldown_time.replace(/CoolDown/i, 'DD')]

  //console.log("active traits", activeTraitList)

  let [critHit, heavyHit] = [0, 0];

  switch (TLSkill[skillInternal].damage_type) {
    case "ETLDamageType::kMagic":
      //console.log("magic")
      critHit = qSD.critMagic
      heavyHit = qSD.heavyMagic
      break
    case "ETLDamageType::kMelee":
      //console.log("melee")
      critHit = qSD.critMelee
      heavyHit = qSD.heavyMelee
      break
    case "ETLDamageType::kRanged":
      //console.log("ranged")
      critHit = qSD.critRanged
      heavyHit = qSD.heavyRanged
      break;
    default:
      console.warn("error in dmg type")
  }

  //Damage
  let dmgPercent = null;
  let dmgFlat = null;

  if (TLSkill[skillInternal].max_charge_delay) {
    dmgPercent = logSkill?.FormulaParameter[0].mul / 100 * logSkill?.FormulaParameter[0].max / 10000;
    dmgFlat = logSkill?.FormulaParameter[0].add * logSkill?.FormulaParameter[0].max / 10000;
  } else { // NoCharge
    dmgPercent = logSkill?.FormulaParameter[0].mul / 100;
    dmgFlat = logSkill?.FormulaParameter[0].add;
  }

  document.getElementById('dmg-percent-' + index).textContent = dmgPercent;
  document.getElementById('dmg-flat-' + index).textContent = dmgFlat;

  const maxCritDmg = math.calcSkillDmg(dmgPercent, dmgFlat, qSD[weaponSlot].M.Max, qSD.SDB, qSD.BD, qSD.speciesBoost, qSD.CD)

  document.getElementById('max-dmg-' + index).textContent = maxCritDmg.toFixed(2)

  const avgDmgNonCrit = math.calcSkillDmg(dmgPercent, dmgFlat, ((qSD[weaponSlot].M.Max + qSD[weaponSlot].M.Min) / 2), qSD.SDB, qSD.BD, qSD.speciesBoost, 0) //avgdmg noncrit
  const avgDmgNonHeavy = (avgDmgNonCrit * (1 - math.AttackModChance(critHit)) + maxCritDmg * (math.AttackModChance(critHit)))
  const avgDmg = (avgDmgNonHeavy * (1 - math.AttackModChance(heavyHit))) + (avgDmgNonHeavy * 2 * math.AttackModChance(heavyHit))

  /*   console.warn(avgDmgNonCrit, avgDmg, math.AttackModChance(critHit), math.AttackModChance(heavyHit))
    console.log(avgDmgNonCrit * (1 - math.AttackModChance(critHit)))
    console.log(maxCritDmg * (math.AttackModChance(critHit))) */

  document.getElementById('avg-dmg-' + index).textContent = avgDmg.toFixed(2)

  console.warn(avgDmg, FormulaParameter[SkillOptionalData[skillInternal].cooldown_time].FormulaParameter[0].min, qSD[weaponSlot].Spd, TLSkill[skillInternal].max_charge_delay)
  console.log(avgDmg / (FormulaParameter[SkillOptionalData[skillInternal].cooldown_time].FormulaParameter[0].min + (qSD[weaponSlot].Spd * TLSkill[skillInternal].max_charge_delay)))



  //AnimationLock
  document.getElementById('animlock-' + index).textContent = math.getAnimLock(TLSkill[skillInternal].skill_delay, TLSkill[skillInternal].hit_delay, qSD[weaponSlot].Spd, TLSkill[skillInternal].max_charge_delay).toFixed(4)


  //Check for dynamic stats?
  console.log("check dynamic stats", FormulaParameter[SkillOptionalData[skillInternal].cooldown_time])

  const cooldown = math.getCooldown(FormulaParameter[SkillOptionalData[skillInternal].cooldown_time].FormulaParameter[0].min, qSD.CDR)

  document.getElementById('cooldown-' + index).textContent = cooldown.toFixed(4)

  document.getElementById('avg-dmg-s-' + index).textContent = (avgDmg / (cooldown + (qSD[weaponSlot].Spd * TLSkill[skillInternal].max_charge_delay))).toFixed(2)






  //document.getElementById('avg-dmg') = 0
  sumAvg()
}


/* 
async function onTraitChange(weaponType, guid, blubb) {
  console.log(guid, blubb)
  const skillList = await load.SkillList(weaponType)
  const match = skillList.find(i => i.guid === guid);
  if (match) {
    if (match.context?.presets?.preset?.specialization.traits === blubb[0].value) {
      console.log("myshitfound")
    }
  }
} */

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