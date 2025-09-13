import json
from pathlib import Path

def generate_sidebar(data: dict) -> str:
    lines = []

    for category, subcats in data.items():
        lines.append(f"- {category}")
        for subcat, items in subcats.items():
            if subcat:  # Only print if not empty
                lines.append(f"    - {subcat}")
                indent = "        "
            else:
                indent = "    "
            for item in items:
                headline = item["headline"]
                file = item["file"].replace(".md", "")
                lines.append(f"{indent}- [{headline}]({file})")
    return "\n".join(lines)

def main():
    base = './docs/'
    with open(base + "sidebar.json", encoding="utf-8") as f:
        data = json.load(f)

    sidebar_md = generate_sidebar(data)

    with open(base + "_sidebar.md", "w", encoding="utf-8") as f:
        f.write("<!-- Auto-generated file. Do not edit manually. -->\n\n")
        f.write(sidebar_md + "\n")

if __name__ == "__main__":
    main()
