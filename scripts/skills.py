import json
import os

weaponList = [
    'Bow',
    'Crossbow',
    'Dagger',
    'Spear',
    'Staff',
    'Sword',
    'Sword2h',
    'Wand'
]

def loadFile(filepath):
    try:
        return json.load(open(filepath, encoding="utf-8"))[0]['Rows']
    except FileNotFoundError:
        return {}

outputFolder = 'docs/weapon/skills/'

TLFormulaParameterNew = loadFile('sources/TLFormulaParameterNew')
TLSkillOptionalDataForPC = loadFile("sources/TLSkillOptionalDataForPC")
TLSkill = loadFile('sources/TLSkill')

for skillName, skillData in TLFormulaParameterNew.items():
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

def TLSkillPCLooks(short):
    return 'sources/TLSkillPcLooks_Weapon_'+short

for weapon in weaponList:

    def getSkills(skillPcLooks):
        skillList = {}
        i = 0
        for key, value in skillPcLooks.items():
            if key not in TLSkillOptionalDataForPC:
                continue
            imgPath = value.get("IconPath", {}).get("AssetPathName", None).split('.')[0].replace("/Game", ".") + ".png"
            skillList[i] = {
                'Skill Name': value.get("UIName",{}).get("LocalizedString",None),
                'Skill Internal': key,
                'Skill Picture': f"<img src='{imgPath}' style='height:auto; width:auto;'>",
                'Skill Type': TLSkill.get(key,{}).get("damage_type","").split('::k')[-1],
                'Skill Delay': TLSkill.get(key,{}).get("skill_delay", None),
                'Hit Delay': TLSkill.get(key,{}).get("hit_delay", None),
                'Max Charge Delay': TLSkill.get(key,{}).get("max_charge_delay", None),
                'MP Consumption': (
                    (fp_list := TLFormulaParameterNew
                        .get(TLSkillOptionalDataForPC.get(key, {}).get("cost_consumption", None), {})
                        .get("FormulaParameter", []))
                    and fp_list[0].get("tooltip1")
                ),

                'HP Consumption': (
                    (fp_list := TLFormulaParameterNew
                        .get(TLSkillOptionalDataForPC.get(key, {}).get("hp_consumption", None), {})
                        .get("FormulaParameter", []))
                    and fp_list[0].get("tooltip1")
                ),
                'Cooldown (s)': (
                    (fp_list := TLFormulaParameterNew
                        .get(TLSkillOptionalDataForPC.get(key,{}).get("cooldown_time",None),{})
                        .get("FormulaParameter", []))
                    and fp_list[0].get("tooltip1")
                )
            }
            i += 1
        return skillList

    skillListMD = getSkills(loadFile(TLSkillPCLooks(weapon)))

    outputName = outputFolder + weapon + '.md'
    os.makedirs(os.path.dirname(outputName), exist_ok=True)
    with open(outputName, "w", encoding="utf-8") as md:
        md.write(f"# {weapon} Skill Types\n\n")

        md.write("| " + " | ".join(skillListMD[0].keys()) + " |\n")
        md.write("| " + " | ".join(['-' * 3 for h in skillListMD[0].keys()]) + " |\n")
        for key, row in skillListMD.items():
            md.write("| " + " | ".join(str(v) for v in skillListMD[key].values()) + " |\n")
    print(f"Skill Types table written to {outputName}")