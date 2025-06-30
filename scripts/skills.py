import json
import os

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

sType = loadFile('sources/TLSkill.json')

for fName in os.listdir(skillsFolder):
    ffName = os.path.join(skillsFolder, fName)
    oName = os.path.join(oFolder, ffName.split("_")[-1].split(".")[0]) + ".md"
    _json = loadFile(ffName)
    
    os.makedirs(os.path.dirname(oName), exist_ok=True)
    with open(oName, "w", encoding="utf-8") as md:
        md.write(f"# {ffName.split('_')[-1].split('.')[0]} Skill Types\n\n")
        head = ['SkillName','SkillInternal','SkillPicture','SkillType', 'SkillDelay','HitDelay','MaxChargeDelay']
        md.write("| " + " | ".join(head) + " |\n")
        md.write("| " + " | ".join(['-' * 3 for h in head]) + " |\n")

        for row_name, row in _json.items():
            path = row.get("IconPath", {}).get("AssetPathName", "")
            if path.startswith("/Game/Image/Skill/Active/") and "WeaponSpec" not in path:
                if row_name in sType:
                    if row.get('UIName').get('LocalizedString'):
                        md.write(f"| {row['UIName']['LocalizedString']} | {row_name} | {getImg(row)} | {sType[row_name]['damage_type'].split('::k')[-1]} | {row[row_name]['skill_delay']} | {row[row_name]['hit_delay']} | {row[row_name]['max_charge_delay']} |\n")
        md.write("\n\n")
        md.write("sources = "+fName)
