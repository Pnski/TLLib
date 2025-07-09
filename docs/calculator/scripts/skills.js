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


/* def loadFile(filepath):
    try:
        return json.load(open(filepath, encoding="utf-8"))[0]['Rows']
    except FileNotFoundError:
        return {}

def getImg(item):
    rPath = item["IconPath"]["AssetPathName"].split('.')[0].replace("/Game", ".") + ".png"
    return f"<img src='{rPath}' style='height:75px; width:auto;'>" */

async function loadSkillLooks(weapon) {
  const basePath = './calculator/sources/Skills/TLSkillPcLooks_Weapon_';
  const response = await fetch(basePath + weapon + ".json");
  const json = await response.json();
  return json[0]["Rows"];
}

async function loadSkillList(weapon) {
  const basePath = './calculator/sources/Skills/cJson/Weapon_';
  const response = await fetch(basePath + weapon);
  const json = await response.json();
  return json;
}

/* async function loadSkills() {
  const basePath = './calculator/sources/Skills/TLSkillPcLooks_Weapon_';

  const entries = await Promise.all(
    skillFiles.map(async (filename) => {
      const response = await fetch(basePath + filename);
      const json = await response.json();

      // Clean name for object key
      const key = filename.replace('TLSkillPcLooks_Weapon_', '').replace('.json', '').toLowerCase();

      return [key, json];
    })
  );

  return Object.fromEntries(entries);
} */

async function onWeaponChange() {
  const MHand = document.getElementById("Mainhand").value
  const OHand = document.getElementById("Offhand").value
  const mSkillList = await loadSkillList(MHand)
  const oSkillList= await loadSkillList(OHand)
  const mSkillLooks = await loadSkillLooks(MHand)
  console.warn(mSkillLooks)
  const oSkillLooks = await loadSkillLooks(MHand)
  mSkillList.forEach(element => {
    console.log(element);
    //console.log(mSkillLooks[element.default_skill_id])
    //console.log("Key:", element.id, "| Available keys:", Object.keys(mSkillLooks));
  });
  
}

function fillSelect(containerID) {
  const container = document.getElementById(containerID);
  for (const opt of skillFiles) {
    const selectOption = document.createElement('option');
    selectOption.value = opt;
    selectOption.textContent = opt;
    container.appendChild(selectOption);
  }
  onWeaponChange();
  container.addEventListener('change', () => {
    onWeaponChange();
  });
}