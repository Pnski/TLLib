import json
import os
from collections import defaultdict

def loadFile(filepath):
    try:
        return json.load(open(filepath, encoding="utf-8"))[0]['Rows']
    except FileNotFoundError:
        return {}

def getImg(item):
    rPath = item["IconPath"]["AssetPathName"].split('.')[0].replace("/Game", ".") + ".png"
    return f"<img src='{rPath}' style='height:75px; width:auto;'>"

itemLooks = loadFile('sources/TLItemLooks.json')
itemLotteryUnit = defaultdict(list)#loadFile('sources/TLItemLotteryUnit.json')
outMD = 'docs/weapon/items.md'

for unit_name, unit_data in loadFile('sources/TLItemLotteryUnit.json').items():
    entries = unit_data.get("ItemLotteryUnitEntry", [])
    for entry in entries:
        item_name = entry.get("item")
        prob = entry.get("prob", 0)
        if item_name:
            itemLotteryUnit[item_name].append((unit_name, prob))

os.makedirs(os.path.dirname(outMD), exist_ok=True)
with open(outMD, "w", encoding="utf-8") as md:
        md.write(f"# Items\n\n")
        head = ['ItemName','ItemLocale','ItemPicture','ItemLocations']
        md.write("| " + " | ".join(head) + " |\n")
        md.write("| " + " | ".join(['-' * 3 for h in head]) + " |\n")

        for row_name, row in itemLooks.items():
            if row["GachaCategory"] == 'ETLGachaCategory::Equip':
                print(row_name, row["UIName"].get("LocalizedString", "NotFound"))
                rPath = row["IconPath"]["AssetPathName"].split('.')[0].replace("/Game", "/docs") + ".png"#/docs/Image/Icon/Item_128/Equip/Armor/P_Set_PL_M_TS_06002.png
                loc = "<br>".join(f"{unit} ({prob / 100000:.2f}%)" for unit, prob in itemLotteryUnit.get(row_name, []))
                md.write(f"| {row_name} | {row['UIName'].get('LocalizedString', 'NotFound')} | ![]({rPath}) | {loc} |\n")#<img src='{rPath}' style='height:75px; width:auto;'>