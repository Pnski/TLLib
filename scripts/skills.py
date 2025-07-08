import json
import os

""" <span style='position: relative; display: inline-block;'>
<span class="hover-tooltip"><img src='./Image/Skill/Active/S_WP_BO_DefenceAction_Shot.png' style='height:75px; width:auto;'>
<span class="tooltip-text">Damage: 15<br>Modifier: 150%<br>Multiplier: debuffduration</span>
</span> 
 """

def loadFile(filepath):
    try:
        return json.load(open(filepath, encoding="utf-8"))[0]['Rows']
    except FileNotFoundError:
        return {}

def getImg(item):
    rPath = item["IconPath"]["AssetPathName"].split('.')[0].replace("/Game", ".") + ".png"
    return f"<img src='{rPath}' style='height:75px; width:auto;'>"

skillsFolder = 'sources/Skills'
oFolder = 'docs/weapon/skills'


skillsParameter = loadFile('sources/TLFormulaParameterNew.json')
""" skill_params = skillsParameter["DA_DeadlyStrike_DD_SP_STACK_Boss"]["FormulaParameter"]
best_entry = max(skill_params, key=lambda fp: fp.get("skill_level", 0)) 
print(f"Highest skill_level: {best_entry['skill_level']}")"""
#skills = [s for s in skills if s.get("skill_level", 0) <= 15]
""" for skillName, skillData in skillsParameter.items():
    if "FormulaParameter" in skillData:
        skillData["FormulaParameter"] = [
            fp for fp in skillData["FormulaParameter"]
            if fp.get("skill_level", 0) <= 15
        ] """
""" needle = "DA_DeadlyStrike"
filtered_dict = {k: v for k, v in skillsParameter.items() if needle in k}
for k, v in filtered_dict.items():
    best_entry = max(v["FormulaParameter"], key=lambda fp: fp.get("skill_level", 0))
    print(f"Highest skill_level for {k}: {best_entry}") """

for skillName, skillData in skillsParameter.items():
    if "FormulaParameter" in skillData:
        # Filter entries to only those with skill_level <= 15
        filtered_entries = [
            fp for fp in skillData["FormulaParameter"]
            if fp.get("skill_level", 0) <= 15
        ]
        
        if filtered_entries:
            # Keep only the highest skill_level entry among the filtered ones
            best_entry = max(filtered_entries, key=lambda fp: fp.get("skill_level", 0))
            skillData["FormulaParameter"] = [best_entry]
        else:
            # If nothing left, empty the list or handle as you need
            skillData["FormulaParameter"] = []
            print(f"No valid skill_levels <= 15 found for {skillName}, clearing FormulaParameter")

skillOptionalData = loadFile("sources/TLSkillOptionalDataForPC.json")

print(skillsParameter["DA_DeadlyStrike_DD_SP_STACK_Boss"])

sType = loadFile('sources/TLSkill.json')

for fName in os.listdir(skillsFolder):
    ffName = os.path.join(skillsFolder, fName)
    oName = os.path.join(oFolder, ffName.split("_")[-1].split(".")[0]) + ".md"
    _json = loadFile(ffName)
    
    os.makedirs(os.path.dirname(oName), exist_ok=True)
    with open(oName, "w", encoding="utf-8") as md:
        md.write(f"# {ffName.split('_')[-1].split('.')[0]} Skill Types\n\n")
        head = ['SkillName','SkillInternal','SkillPicture','SkillType', 'SkillDelay','HitDelay','MaxChargeDelay','cost_consumption','hp_consumption','cooldown_time']
        md.write("| " + " | ".join(head) + " |\n")
        md.write("| " + " | ".join(['-' * 3 for h in head]) + " |\n")

        for row_name, row in _json.items():
            path = row.get("IconPath", {}).get("AssetPathName", "")
            if path.startswith("/Game/Image/Skill/Active/") and "WeaponSpec" not in path:
                if row_name in sType:
                    if row.get('UIName').get('LocalizedString'):
                        if row_name in skillOptionalData:
                            md.write(f"| {row['UIName']['LocalizedString']} | {row_name} | {getImg(row)} | {sType[row_name]['damage_type'].split('::k')[-1]} | {sType[row_name]['skill_delay']} | {sType[row_name]['hit_delay']} | {sType[row_name]['max_charge_delay']} | {skillOptionalData[row_name].get('cost_consumption','N/A')} | {skillOptionalData[row_name].get('hp_consumption','N/A')} | {skillOptionalData[row_name].get('cooldown_time','N/A')} |\n")
                        else:
                            print("found an error?",row_name,row.get('UIName').get('LocalizedString'))
                            #"stamina_consumption"
                            md.write(f"| {row['UIName']['LocalizedString']} | {row_name} | {getImg(row)} | {sType[row_name]['damage_type'].split('::k')[-1]} | {sType[row_name]['skill_delay']} | {sType[row_name]['hit_delay']} | {sType[row_name]['max_charge_delay']} | N/a | N/a | N/a |\n")
        md.write("\n\n")
        md.write("sources = "+fName)
