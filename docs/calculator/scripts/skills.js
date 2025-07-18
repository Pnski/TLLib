const skillFiles = [
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

function parseQuestLogStats(text) {
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

function querySkillData(index) {
  const result = {}
  document.querySelectorAll('[data-skill-id]').forEach(qSA => {
    const path = qSA.dataset.skillId;
    const value = parseFloat(qSA.value) || 0;
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
async function SkillCalcNew(skillInternal, weaponSlot, index) {
  await preloadSkillData();
  const qSD = querySkillData();
  console.log(skillInternal, weaponSlot, index)
  document.getElementById('cooldown-' + index).textContent = math.getCooldown(FormulaParameter[SkillOptionalData[skillInternal].cooldown_time].FormulaParameter[0].min, qSD.CDR).toFixed(4)
  document.getElementById('animlock-' + index).textContent = math.getAnimLock(TLSkill[skillInternal].skill_delay, TLSkill[skillInternal].hit_delay, qSD[weaponSlot].Spd).toFixed(4)
  /* 
    document.getElementsByName("skillSelect").forEach(qSkills => {
      const rowID = qSkills.id.split('-').at(-1) // 1 - 12
      document.getElementById('cooldown-' + rowID).textContent = math.getCooldown(FormulaParameter[SkillOptionalData[qSkills.value].cooldown_time].FormulaParameter[0].min, qSD.CDR).toFixed(4)
      document.getElementById('animlock-' + rowID).textContent = math.getAnimLock(TLSkill[qSkills.value].skill_delay, TLSkill[qSkills.value].hit_delay, qSD[qSkills.options[qSkills.selectedIndex].getAttribute('data-slot')].Spd).toFixed(4)
      const logSkill = FormulaParameter[SkillOptionalData[qSkills.value].cooldown_time.replace(/CoolDown/i, 'DD_Boss')] || FormulaParameter[SkillOptionalData[qSkills.value].cooldown_time.replace(/CoolDown/i, 'DD')]
      document.getElementById('dmg-percent-' + rowID).textContent = logSkill?.FormulaParameter[0].tooltip1 || 0
      document.getElementById('dmg-flat-' + rowID).textContent = logSkill?.FormulaParameter[0].tooltip2 || 0
      //document.getElementById('avg-dmg') = 0
      document.getElementById('max-dmg-' + rowID).textContent = math.calcSkillDmg(logSkill?.FormulaParameter[0].tooltip1 || 0, logSkill?.FormulaParameter[0].tooltip2 || 0, qSD[qSkills.options[qSkills.selectedIndex].getAttribute('data-slot')].M.Max, qSD.SDB, qSD.BD, qSD.speciesBoost, qSD.critMelee).toFixed(2)
    }) */
  return 0
}

async function fillTraits(weaponType, guid, index) {
  const dataList = []

  console.log("filltraitselect", weaponType, guid, index)
  const select = document.getElementById('trait-' + index)

  const traitList = await load.SkillList(weaponType)
  const traitLooks = await load.SkillLooks(weaponType)
  const match = traitList.find(i => i.guid === guid);
  if (match) {
    for (const traitId of match.trait_list.trait) {
      const traitName = traitId.trait_id

      const skillLooks = traitLooks[traitName]
      console.log(skillLooks)

      dataList.push({
        text: skillLooks.UIName?.LocalizedString,
        value: traitName,
        html: `<span title="${skillLooks.SkillTraitDescription}">${skillLooks.UIName?.LocalizedString}</span>`
      })
    }
  }

  if (select.slim) select.slim.destroy()
  select.innerHTML = "";
  select.slim = new SlimSelect({
    select: select,
    data: dataList,
    events: {
      afterChange: (info) => {
        console.log("trait changed", info)
      }
    }
  })

  return 0
}

async function onWeaponChange() {
  const selects = document.getElementsByName("skillSelect");

  const dataList = [];

  async function pushSkillOptions(WeaponName, slotTag) {
    const [skillList, skillLooks] = await Promise.all([
      load.SkillList(WeaponName),
      load.SkillLooks(WeaponName)
    ])
    for (const weaponSkill of skillList) {
      try {
        const preset = weaponSkill?.context?.presets?.preset?.default?.combo_state_default;
        const rName = preset?.complex || preset?.simple || preset?.recursive_conditional;
        const result = rName?.skill_id || rName?.default_skill_id || rName?.conditional_skills?.skill_id;

        const look = skillLooks[result];
        if (!look) continue;

        const label = look.UIName?.LocalizedString || result;
        const rawPath = look.IconPath?.AssetPathName?.split('.')[0] || "";
        const iconPath = rawPath.replace("/Game/", "") + ".png";

        dataList.push({
          text: label,
          value: result,
          data: {
            slot: slotTag,
            weaponType: WeaponName,
            guid: weaponSkill.guid
          },
          html: `<img src="${iconPath}" style="height: 20px; vertical-align: middle; margin-right: 6px;">${label}`
        });

      } catch (err) {
        console.warn("Failed to parse skill entry:", weaponSkill, err);
      }
    }
  }

  await pushSkillOptions(document.getElementById("Mainhand").value, 'MH');
  await pushSkillOptions(document.getElementById("Offhand").value, 'OH');

  selects.forEach((el, index) => {
    if (el.slim) el.slim.destroy(); // destroy old instance

    el.innerHTML = ""; // clear options

    el.slim = new SlimSelect({
      select: el,
      data: dataList,
      settings: {
        showSearch: true
      },
      events: {
        afterChange: (info) => {
          fillTraits(info[0].data.weaponType, info[0].data.guid, index)
          SkillCalcNew(info[0].value, info[0].data.slot, index)
        }
      }
    });
  })
}

function fillSelectWeapon() {
  const selects = document.getElementsByName("weaponSelect");

  // Prepare shared dataList
  const dataList = [];

  for (const weaponName of skillFiles) {
    try {

      const label = weaponName;
      const iconPath = './Image/Weapon/' + weaponName + ".png";

      dataList.push({
        text: label,
        html: `<img src="${iconPath}" style="height: 30px; vertical-align: middle; margin-right: 6px;">${label}`
      });

    } catch (err) {
      console.warn("Failed to parse skill entry:", weaponSkill, err);
    }
  }

  selects.forEach(el => {
    if (el.slim) el.slim.destroy();
    el.innerHTML = "";

    el.slim = new SlimSelect({
      select: el,
      data: dataList,
      settings: {
        showSearch: false
      },
      selected: true,
      events: {
        afterChange: () => {
          onWeaponChange()
        }
      }
    });
  });
}

console.log("✅ skills.js loaded");

window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
  console.log("✅ Docsify plugin registered");

  hook.doneEach(async () => {
    const currentPage = vm.route.path;

    // Only run this logic if we're on dd_calc.md
    if (!currentPage.includes("/calculator/dd_calc")) return;

    await preloadSkillData();

    console.log("✅ Executing skill table injection for:", currentPage);

    document.getElementById('openPasteWindow').onclick = () => {
      document.getElementById('pasteOverlay').style.display = 'flex';
    };

    document.getElementById('closePasteWindow').onclick = () => {
      document.getElementById('pasteOverlay').style.display = 'none';
    };

    document.getElementById('parseStats').onclick = () => {
      const text = document.getElementById('statInput').value;
      parseQuestLogStats(text);
      document.getElementById('pasteOverlay').style.display = 'none';
    };

    document.getElementById('parseStats').onclick = () => {
      const text = document.getElementById('statInput').value;
      parseQuestLogStats(text);
      document.getElementById('pasteOverlay').style.display = 'none';
    };
    document.getElementById('parseClipboard').onclick = async () => {
      try {
        const text = await navigator.clipboard.readText();
        document.getElementById('statInput').value = text;
      } catch (err) {
        console.warn("Clipboard access denied:", err);
      }
    }

    const tbody = document.getElementById("table-skills-select");
    if (!tbody || tbody.dataset.generated === "true") return;

    for (let i = 0; i < 12; i++) {
      const tr = document.createElement("tr");

      const tdSkill = document.createElement("td");
      const select = document.createElement("select");
      select.id = `skill-${i}`;
      select.name = "skillSelect";
      tdSkill.appendChild(select);
      tr.appendChild(tdSkill);

      const tdTrait = document.createElement("td");
      const selectTrait = document.createElement("select");
      selectTrait.id = `trait-${i}`;
      selectTrait.setAttribute("multiple", "multiple");
      tdTrait.appendChild(selectTrait);
      tr.appendChild(tdTrait);

      ["dmg-percent", "dmg-flat", "max-dmg", "avg-dmg", "cooldown", "animlock"].forEach(field => {
        const td = document.createElement("td");
        td.id = `${field}-${i}`;
        td.textContent = "-";
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }

    tbody.dataset.generated = "true";
    fillSelectWeapon();
    onWeaponChange?.();
    document.querySelectorAll('input:not([name])').forEach(inputField => {
      inputField.oninput = () => {
        document.getElementsByName("skillSelect").forEach((select, index) => {
          for (const i of select.slim.getData()) {
            if (i.selected) {
              SkillCalcNew(i.value, i.data.slot, index);
            }
          }
        });
      };
    });
  });
});
