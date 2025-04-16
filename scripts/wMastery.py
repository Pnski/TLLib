import json
import os

def loadFile(filepath):
    try:
        return json.load(open(filepath, encoding="utf-8"))[0]['Rows']
    except FileNotFoundError:
        return {}

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