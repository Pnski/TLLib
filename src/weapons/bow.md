---
toc: false
---

# Bow

```js
const TLFormulaParameterNewFile = FileAttachment("/static/sources/TLFormulaParameterNew.gz")
const TLSkillOptionalDataForPcFile = FileAttachment("/static/sources/TLSkillOptionalDataForPc.gz")
const TLSkillPcLooks_WeaponFile = FileAttachment("/static/sources/TLSkillPcLooks_Weapon_Bow.gz")
const TLSkillFile = FileAttachment("/static/sources/TLSkill.gz")

async function unzipJson(file) {
  const stream = await file.stream()
  const decompressed = stream.pipeThrough(new DecompressionStream("gzip"))
  return new Response(decompressed).json()
}

const [TLFormulaParameterNew, TLSkillOptionalDataForPc, TLSkillPcLooks_Weapon, TLSkill] = await Promise.all([
  (await unzipJson(TLFormulaParameterNewFile))[0].Rows,
  (await unzipJson(TLSkillOptionalDataForPcFile))[0].Rows,
  (await unzipJson(TLSkillPcLooks_WeaponFile))[0].Rows,
  (await unzipJson(TLSkillFile))[0].Rows,
])
```

```js
const skillList = []

for (const [key, value] of Object.entries(TLSkillPcLooks_Weapon)) {
    // Check if skill exists in the optional data
    if (key in TLSkillOptionalDataForPc) {
        
        const optional = TLSkillOptionalDataForPc[key] || {};
        const skillMain = TLSkill[key] || {};

        // Helper function to extract "tooltip1" from the FormulaParameter structure
        // This replaces the complex Python walrus logic
        const getTooltipValue = (paramKey) => {
            const formulaId = optional[paramKey];
            const fpList = TLFormulaParameterNew[formulaId]?.FormulaParameter || [];
            return fpList[0]?.tooltip1; // Returns the value or undefined
        };

        skillList.push({
            'Skill Name': value.UIName?.LocalizedString,
            'Skill Internal': key,
            'Skill Picture': value.IconPath?.AssetPathName,
            'Skill Type': skillMain.damage_type?.split('::k')[1],
            'Skill Delay': skillMain.skill_delay,
            'Hit Delay': skillMain.hit_delay,
            'Max Charge Delay': skillMain.max_charge_delay,
            
            // Re-enabled fields using the helper function
            'MP Consumption': getTooltipValue('cost_consumption'),
            'HP Consumption': getTooltipValue('hp_consumption'),
            'Cooldown (s)': getTooltipValue('cooldown_time')
        });
    }
}

const query = view(Inputs.search(skillList, {
  placeholder: "Search skillList..."
}))
```

```js
view(
    Inputs.table(
        query,
        {width: width,
        rows: 31,
        select: false,
        sort: "Skill Name",
        format: {
            "Skill Picture": d => htl.html`<img src="${d.split('.')[0].replace('/Game','https://pnski.github.io/TLLib')}.png" />`
        }}
    )
)
```