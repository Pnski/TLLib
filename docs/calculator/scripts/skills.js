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


async function loadSkills() {
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
}

//const skills = await loadSkills();
//console.log(skills.dagger); // shows parsed JSON for dagger skill

function onWeaponChange(weapon) {
  console.log("new weapon", weapon)
}

function fillSelect(containerID) {
  const container = document.getElementById(containerID);
  for (const opt of skillFiles) {
    const selectOption = document.createElement('option');
    selectOption.value = opt;
    selectOption.textContent = opt;
    container.appendChild(selectOption);
  }
  container.addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    onWeaponChange(selectedValue);
  });
}