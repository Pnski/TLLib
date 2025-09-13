import json
import os
from collections import defaultdict

from _utils import sidebarjson, loadFile

def getImg(item):
    rPath = itemLooks[item]["IconPath"]["AssetPathName"].split('.')[0].replace("/Game", ".") + ".png"
    return f"<img src='{rPath}' style='height:75px; width:auto;'>"

itemLooks = loadFile('sources/TLItemLooks.json')
itemLotteryUnit = defaultdict(list)#loadFile('sources/TLItemLotteryUnit.json')

itemStats=loadFile('sources/TLItemStats_AGS.json')

outMD = 'docs/weapon/items.md'

os.makedirs(os.path.dirname(outMD), exist_ok=True)

for unit_name, unit_data in loadFile('sources/TLItemLotteryUnit.json').items():
    entries = unit_data.get("ItemLotteryUnitEntry", [])
    for entry in entries:
        item_name = entry.get("item")
        prob = entry.get("prob", 0)
        if item_name:
            itemLotteryUnit[item_name].append((unit_name, prob))


with open(outMD, "w", encoding="utf-8") as md:
        md.write(f"# Items\n\n")


        head = ['ItemName','ItemLocale','ItemPicture','ItemLocations']
        md.write("| " + " | ".join(head) + " |\n")
        md.write("| " + " | ".join(['-' * 3 for h in head]) + " |\n")
