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
import {
  Damage_AVG,
  Damage_Max,
  getCooldown
} from './damage.js'

function parseQuestLogStats(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '');
  const data = {};

  for (let i = 0; i < lines.length - 1; i++) {
    const key = lines[i];
    const next = lines[i + 1];

    // Match a number or percent or time
    if (/^[\d,.]+(%|s|m)?$/i.test(next)) {
      data[key] = next;
      i++; // Skip next line
    }
  }

  console.log("Parsed stats:", data);
}


function querySkillData() {
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

async function SkillCalcNew() {
  const qSD = querySkillData();
  const SkillOptionalData = await load.SkillOptionalData();
  const TLSkill = await load.SkillsData();
  const FormulaParameter = await load.FormulaParameter();
  document.getElementsByName("skillSelect").forEach(qSkills => {
    console.log(qSkills.value, qSkills.id.split('-').at(-1))
    const rowID = qSkills.id.split('-').at(-1) // 1 - 12
    //const rowVal = qSkills.value //WP_BO_S_StrongShot_Hero
    document.getElementById('cooldown-' + rowID).textContent = getCooldown(FormulaParameter[SkillOptionalData[qSkills.value].cooldown_time].FormulaParameter[0].min, qSD.CDR) / 1000

    document.getElementById('animlock-' + rowID).textContent = (TLSkill[qSkills.value].skill_delay + TLSkill[qSkills.value].hit_delay) * qSD[qSkills.options[qSkills.selectedIndex].getAttribute('data-slot')].Spd
  })
  return 0
}

async function onWeaponChange() {
  const selects = document.getElementsByName("skillSelect");

  const MHand = document.getElementById("Mainhand").value;
  const OHand = document.getElementById("Offhand").value;

  const [mSkillList, oSkillList, mSkillLooks, oSkillLooks] = await Promise.all([
    load.SkillList(MHand),
    load.SkillList(OHand),
    load.SkillLooks(MHand),
    load.SkillLooks(OHand)
  ]);

  const dataList = [];

  function pushSkillOptions(skillList, skillLooks, slotTag) {
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
          data: { slot: slotTag },
          html: `<img src="${iconPath}" style="height: 20px; vertical-align: middle; margin-right: 6px;">${label}`
        });

      } catch (err) {
        console.warn("Failed to parse skill entry:", weaponSkill, err);
      }
    }
  }

  pushSkillOptions(mSkillList, mSkillLooks, 'MH');
  pushSkillOptions(oSkillList, oSkillLooks, 'OH');

  selects.forEach((el) => {
    if (el.slim) el.slim.destroy(); // destroy old instance

    el.innerHTML = ""; // clear options

    el.slim = new SlimSelect({
      select: el,
      data: dataList,
      settings: {
        showSearch: true,
        placeholderText: "Select a Weapon"
      }
    });

    el.addEventListener("change", SkillCalcNew);
  });
}


function fillSelectWeapon() {
  const selects = document.getElementsByName("weaponSelect");

  // Prepare shared dataList
  const dataList = [];

  for (const weaponName of skillFiles) {
    try {

      const label = weaponName;
      //const rawPath = look.IconPath?.AssetPathName?.split('.')[0] || "";
      const iconPath = './Image/Weapon/' + weaponName + ".png";

      dataList.push({
        text: label,
        value: label,
        html: `<img src="${iconPath}" style="height: 30px; vertical-align: middle; margin-right: 6px;">${label}`
      });

    } catch (err) {
      console.warn("Failed to parse skill entry:", weaponSkill, err);
    }
  }

  selects.forEach((el, i) => {
    if (el.slim) el.slim.destroy(); // remove previous SlimSelect instance

    // Clear any old options (not needed with data mode, but just in case)
    el.innerHTML = "";

    // Attach new SlimSelect with image-enabled entries
    el.slim = new SlimSelect({
      select: el,
      data: dataList,
      settings: {
        showSearch: true,
        placeholderText: "Select a skill"
      }
    });
    el.addEventListener("change", onWeaponChange);
  });
}

console.log("✅ skills.js loaded");

window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
  console.log("✅ Docsify plugin registered");

  hook.doneEach(() => {
    const currentPage = vm.route.path;

    // Only run this logic if we're on dd_calc.md
    if (!currentPage.includes("/calculator/dd_calc")) return;

    console.log("✅ Executing skill table injection for:", currentPage);

    const tbody = document.getElementById("table-skills-select");
    if (!tbody || tbody.dataset.generated === "true") return;

    for (let i = 1; i <= 12; i++) {
      const tr = document.createElement("tr");

      const tdSkill = document.createElement("td");
      const select = document.createElement("select");
      select.id = `skill-${i}`;
      select.name = "skillSelect";
      tdSkill.appendChild(select);
      tr.appendChild(tdSkill);

      ["dmg-percent", "dmg-flat", "avg-dmg", "max-dmg", "cooldown", "animlock"].forEach(field => {
        const td = document.createElement("td");
        td.id = `${field}-${i}`;
        td.textContent = "-";
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    }

    tbody.dataset.generated = "true";
    fillSelectWeapon?.();
    onWeaponChange?.();

    document.querySelectorAll('input:not([name])').forEach(i => {
      i.oninput = SkillCalcNew()
    });

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
  });
});
