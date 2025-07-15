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

async function onSkillChange() {
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

  const WeaponMerged = [...mSkillList, ...oSkillList];
  const LooksMerged = { ...mSkillLooks, ...oSkillLooks };

  // Prepare shared dataList
  const dataList = [];

  for (const weaponSkill of WeaponMerged) {
    try {
      const preset = weaponSkill?.context?.presets?.preset?.default?.combo_state_default;
      const rName = preset?.complex || preset?.simple || preset?.recursive_conditional;
      const result = rName?.skill_id || rName?.default_skill_id || rName?.conditional_skills.skill_id;

      const look = LooksMerged[result];
      if (!look) continue;

      const label = look.UIName?.LocalizedString || result;
      const rawPath = look.IconPath?.AssetPathName?.split('.')[0] || "";
      const iconPath = rawPath.replace("/Game/", "") + ".png";

      dataList.push({
        text: label,
        value: result,
        html: `<img src="${iconPath}" style="height: 20px; vertical-align: middle; margin-right: 6px;">${label}`
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
        placeholderText: "Select a Weapon"
      }
    });
    el.addEventListener("change", onSkillChange);
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

      ["dmg-percent", "dmg-flat", "avg-dmg", "max-dmg", "cdr", "animlock"].forEach(field => {
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
  });
});
