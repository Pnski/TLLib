import json
import os

from _utils import sidebarjson, loadFile

outputDir = 'docs/weapon/'

def weaponSpecialization():
    weaponLevel = {}
    TLWeaponSpecializationLevel = loadFile('sources/TLWeaponSpecializationLevel')
    i = 0
    for key, value in TLWeaponSpecializationLevel.items():
        weaponLevel[i] = {
            'Name': value.get("Name"),
            'Level': value.get("level"),
            'expNext': value.get("point_threshold") - weaponLevel.get(i-1,{}).get("TotalExp",0),
            'TotalExp': value.get("point_threshold"),
        }
        i += 1

    outputName = 'mLevel.md'
    output = outputDir + outputName 
    os.makedirs(os.path.dirname(output), exist_ok=True)
    with open(output, "w", encoding="utf-8") as md:
        md.write(f"# Master Level\n\n")

        md.write("| " + " | ".join(weaponLevel[0].keys()) + " |\n")
        md.write("| " + " | ".join(['-' * 3 for h in weaponLevel[0].keys()]) + " |\n")
        for key, row in weaponLevel.items():
            row_values = []
            for v in row.values():
                if isinstance(v, list):
                    row_values.append("<br>".join(f"- {x}" for x in v))
                else:
                    row_values.append(str(v))
            md.write("| " + " | ".join(row_values) + " |\n")
    print(f"Weapon Mastery table written to {output}")
    sidebarjson("Basics", "Weapon", "Weapon Mastery Level", output.removeprefix("docs/"), "docs/sidebar.json")

weaponSpecialization()