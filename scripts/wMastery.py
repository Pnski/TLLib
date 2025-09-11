import json
import os

def loadFile(filepath):
    try:
        return json.load(open(filepath, encoding="utf-8"))[0]['Rows']
    except FileNotFoundError:
        return {}

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
    print(f"Fishing Habitat table written to {output}")

weaponSpecialization()


def extract_value(data, key_path):
    """Recursively walk through data using dot-separated key paths, handling lists and empty gracefully."""
    keys = key_path.split(".")
    for key in keys:
        if isinstance(data, dict):
            data = data.get(key, "")
        elif isinstance(data, list):
            try:
                key = int(key)
                data = data[key]
            except (ValueError, IndexError):
                return "[null]"
        else:
            return "[null]" if isinstance(data, list) and not data else ""

    if isinstance(data, list):
        if not data:
            return "[null]"
        return ", ".join(str(item.get("Key", item)) if isinstance(item, dict) else str(item) for item in data)
    
    return str(data) if data != "" else "[null]"

def getRows(fields, filepath):
    rows = []
    for _, row in loadFile(filepath).items():
        extracted = [extract_value(row, field) for field in fields]
        rows.append(extracted)
    return rows

def writeMarkdown(title, head, dataField, filepath, output):

    markdown = "\n\n".join(title)
    markdown += "| " + " | ".join(head) + " |\n"
    markdown += "| " + " | ".join(['-' * len(h) for h in head]) + " |\n"
    for data in getRows(dataField, filepath):
        markdown += "| " + " | ".join(data) + " |\n"

    markdown += "\n\n" + filepath

    os.makedirs(os.path.dirname(output), exist_ok=True)
    
    with open(output, "w", encoding="utf-8") as f:
        f.write(markdown)
    print(filepath, "success")

#Weapon Mastery
writeMarkdown(
    title=['# Mastery', '## Level',''],
    head=["Name", "Level", "Threshold"],
    dataField=["Name", "level", "point_threshold"],
    filepath="sources/TLWeaponSpecializationLevel.json",
    output="docs/weapon/mLevel.md",
)