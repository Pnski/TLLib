import os
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
        json.dump(data, f, indent=1, ensure_ascii=False)

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

def get_image_url(asset_path_name):
    """Converts a raw asset path name to a clean image URL."""
    if not asset_path_name:
        return None
    return asset_path_name.split('.')[0].replace("/Game", ".") + ".png"

def get_image_tag(asset_path_name, style='height:75px; width:auto;'):
    """Generates an HTML <img> tag with a specified style."""
    img_url = get_image_url(asset_path_name)
    if not img_url:
        return ""
    return f"<img src='{img_url}' style='{style}'>"

def writeMarkdown(output_path, title, sidebar_config, content):
    """
    Writes content to a markdown file and updates the sidebar.
    :param output_path: Full path to the output markdown file.
    :param title: The title for the markdown file.
    :param sidebar_config: A dictionary with 'cat1', 'sub1', and 'headline'.
    :param content_writer_func: A function that takes a file handle and writes content.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as md:
        md.write(f"# {title}\n\n")

        md.write("| " + " | ".join(content[0].keys()) + " |\n")
        md.write("| " + " | ".join(['-' * 3 for h in content[0].keys()]) + " |\n")
        for key, row in content.items():
            row_values = []
            for v in row.values():
                if isinstance(v, list):
                    row_values.append("<br>".join(f"- {x}" for x in v))
                else:
                    row_values.append(str(v))
            md.write("| " + " | ".join(row_values) + " |\n")
    
    sidebarjson(
        cat1=sidebar_config['cat1'],
        sub1=sidebar_config['sub1'],
        headline=title,
        file=output_path.removeprefix("docs/"),
        json_path="docs/sidebar.json"
    )
    print(f"File written to {output_path}")