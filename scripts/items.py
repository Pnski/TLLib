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

itemLooks = loadFile('sources/TLItemLooks.json')
outMD = 'docs/weapon/items.md'

os.makedirs(os.path.dirname(outMD), exist_ok=True)
with open(outMD, "w", encoding="utf-8") as md:
        #md.write(f"# Items\n\n")
        head = ['ItemName','ItemPicture','ItemLocations']
        #md.write("| " + " | ".join(head) + " |\n")
        #md.write("| " + " | ".join(['-' * 3 for h in head]) + " |\n")

        for row_name, row in itemLooks.items():
            if row["GachaCategory"] == 'ETLGachaCategory::Equip':
                print(row_name, row["UIName"].get("LocalizedString", "NotFound"))
            breakpoint