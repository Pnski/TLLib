import json
from pathlib import Path

def sidebarjson(cat1, sub1, headline, file, json_path="sidebar.json"):
    """
    Add an entry to sidebar.json in the structure:
    { "cat1": { "sub1": [ { "headline": headline, "file": file } ] } }
    Everything is kept in alphabetical order.
    """

    # Load existing sidebar.json
    path = Path(json_path)
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    else:
        data = {}

    # Ensure category exists
    if cat1 not in data:
        data[cat1] = {}

    # Ensure subcategory exists (empty string allowed for direct entries)
    if sub1 not in data[cat1]:
        data[cat1][sub1] = []

    # Ensure file ends with .md
    if not file.endswith(".md"):
        file = f"{file}.md"

    # Check if entry already exists
    exists = any(entry["file"] == file for entry in data[cat1][sub1])
    if not exists:
        data[cat1][sub1].append({"headline": headline, "file": file})

    # Sort entries alphabetically
    data[cat1][sub1] = sorted(data[cat1][sub1], key=lambda x: x["headline"].lower())

    # Sort subcategories
    data[cat1] = {k: data[cat1][k] for k in sorted(data[cat1].keys(), key=str.lower)}

    # Sort categories
    data = {k: data[k] for k in sorted(data.keys(), key=str.lower)}

    # Write back to file
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


# Example usage:
# sidebarjson("Basics", "Amitoi", "Expedition Rewards", "doll/expeditionRewards.md")

def loadFile(filepath):
    try:
        data = json.load(open(filepath, encoding="utf-8"))
        if not data or 'Rows' not in data[0]:
            print(f"[Warning] {filepath} is empty or missing 'Rows'")
            return {}
        return data[0]['Rows']
    except FileNotFoundError:
        print(f"[Warning] {filepath} not found")
        return {}