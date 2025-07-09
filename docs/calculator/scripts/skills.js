

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

import { XMLParser } from 'https://cdn.jsdelivr.net/npm/fast-xml-parser@5.2.5/+esm';


/* def loadFile(filepath):
    try:
        return json.load(open(filepath, encoding="utf-8"))[0]['Rows']
    except FileNotFoundError:
        return {}

def getImg(item):
    rPath = item["IconPath"]["AssetPathName"].split('.')[0].replace("/Game", ".") + ".png"
    return f"<img src='{rPath}' style='height:75px; width:auto;'>" */

async function loadSkillLooks(weapon) {
  const basePath = 'sources/Skills/TLSkillPcLooks_Weapon_';
  const response = await fetch(basePath + weapon + ".json");
  const json = await response.json();
  return json[0]["Rows"];
}

/* 
loadSkillList
after exporting with fmodel files are as .json, in it is xml data, with wapon_ we get the most usefull list to sort for actives, passives AA and block

*/

async function loadSkillList(weapon) {
  const options = {
    ignoreAttributes: false,
    attributeNamePrefix: "",
    ignoreRootElement: true,
    attributeValueProcessor: (tagName, tagValue, jPath, hasAttributes, isLeafNode) => {
      return tagValue
    }
  };

  const basePath = './sources/Skills/xml/Weapon_';
  const response = await fetch(basePath + weapon + '.json');
  const text = await response.text();
  const parser = new XMLParser(options);
  const result = parser.parse(text);

  let filtered = [];

  try {
    const skillList = result["hero_skill_set"]["skill_complex_list"]["skill_complex"];

    // Ensure skillList is an array
    const list = Array.isArray(skillList) ? skillList : [skillList];

    // Combined filters
    filtered = list.filter(s =>
      s?.skill_type === "kActiveSkill" &&
      s?.is_basic_attack === "false" &&
      s?.skill_slot_affinity !== "kDefenseAction"
    );

  } catch (error) {
    console.error("Error in loadSkillList:", error);
  }

  return filtered;
}

async function onWeaponChange() {
  const selects = document.getElementsByName("skillSelect");

  const MHand = document.getElementById("Mainhand").value;
  const OHand = document.getElementById("Offhand").value;

  const [mSkillList, oSkillList] = await Promise.all([
    loadSkillList(MHand),
    loadSkillList(OHand)
  ]);
  const [mSkillLooks, oSkillLooks] = await Promise.all([
    loadSkillLooks(MHand),
    loadSkillLooks(OHand)
  ]);

  const WeaponMerged = [...mSkillList, ...oSkillList];
  const LooksMerged = { ...mSkillLooks, ...oSkillLooks };

  // Prepare shared dataList
  const dataList = [];

  for (const weaponSkill of WeaponMerged) {
    try {
      const preset = weaponSkill?.context?.presets?.preset?.default?.combo_state_default;
      const rName = preset?.complex || preset?.simple;
      const result = rName?.skill_id || rName?.default_skill_id;

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

  // Reset and re-initialize each SlimSelect
  selects.forEach((el, i) => {
    if (el.slim) el.slim.destroy(); // remove previous SlimSelect instance

    // Clear any old options (not needed with data mode, but just in case)
    el.innerHTML = "";

    // Attach new SlimSelect with image-enabled entries
    el.slim = new SlimSelect({
      select: el,
      data: dataList,
      settings: {
        showSearch: false,
        placeholderText: "Select a skill"
      }
    });
  });
}


function fillSelectWeapon() {
  const container = document.getElementsByName("weaponSelect");

  for (const el of container) {
    for (const opt of skillFiles) {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      el.appendChild(option);
    }
    el.addEventListener("change", onWeaponChange);
  }
}


console.warn("loaded skills.js")

// initial fills

window.addEventListener("load", (event) => {
  console.log("page is fully loaded");
  fillSelectWeapon();
  onWeaponChange();
});