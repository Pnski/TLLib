import json
import os

from collections import defaultdict

def loadFile(filepath):
    try:
        return json.load(open(filepath, encoding="utf-8"))[0]['Rows']
    except FileNotFoundError:
        return {}

def getImg(item):
    try:
        rPath = itemLooks[item]["IconPath"]["AssetPathName"].split('.')[0].replace("/Game", ".") + ".png"
        return f"<img src='{rPath}' style='height:75px; width:auto;'>"
    except:
        return "noIMG"

oFolder = 'docs/weapon/items'
os.makedirs(os.path.dirname(oFolder), exist_ok=True)

itemStats = loadFile('sources/TLItemStats.json')
itemLooks = loadFile('sources/TLItemLooks.json')

itemDict = defaultdict(lambda: defaultdict(list))

for itemName, itemKeys in itemStats.items():
    if 'test' in itemName.lower():
        continue
    category = itemKeys.get("enchant_category")
    enchant_id = itemKeys.get("enchant_id")
    if 'error' in enchant_id.lower():
        continue
    if 'test' in enchant_id.lower():
        continue
    if category is None or enchant_id is 'None':
        continue  # skip items missing these keys
    itemDict[category][enchant_id].append(itemName)

for category in itemDict.keys():
    print(category.split("::")[-1])
    oName = os.path.join(oFolder, category.split("::k")[-1]) + ".md"
    with open(oName, "w", encoding="utf-8") as md:
        md.write(f"# {category.split('::k')[-1]}\n\n")

        for enchant_id in itemDict[category].keys():
            md.write(f"## {enchant_id}\n\n<details><summary>{enchant_id}</summary>\n\n")
            head = ['Weapon', 'Icon']
            md.write("| " + " | ".join(head) + " |\n")
            md.write("| " + " | ".join(['-' * 3 for h in head]) + " |\n")
            for item in itemDict[category][enchant_id]:
                md.write(f"| {item} | {getImg(item)} |\n")
            md.write("</details>\n\n")