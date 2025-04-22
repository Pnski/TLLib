import json
import os

def loadFile(filepath):
    try:
        return json.load(open(filepath, encoding="utf-8"))[0]['Rows']
    except FileNotFoundError:
        return {}

regionPath = "sources/TLMagicDollExpeditionRegion.json"
groupPath = "sources/TLItemLotteryPrivateGroup.json"
unitPath = "sources/TLItemLotteryUnit.json"
imgPath = "sources/TLItemLooks.json"

regionData = loadFile(regionPath)
groupData = loadFile(groupPath)
unitData = loadFile(unitPath)
imgData = loadFile(imgPath)

def avgQuantity(entries):
    return sum(entry['quantity'] * (entry['prob'] / 10000) for entry in entries) / sum(entry['prob'] / 10000 for entry in entries)

def getImg(item):
    rPath = imgData[item]["IconPath"]["AssetPathName"].split('.')[0].replace("/Game", ".") + ".png"
    return f"<img='{rPath}'>"

def writeMarkdown(output):
    with open(output, "w", encoding="utf-8") as md:
        md.write("Amitoi Expedition\n\n")
        for region in regionData.values():
            md.write("## "+ region["RegionName"]["LocalizedString"]+"\n\n")
            head = ["ExpeditionTime"] + [x for i in range(1, 5) for x in (f"Reward {i}", f"% {i}")]
            md.write("| " + " | ".join(head) + " |\n")
            md.write("| " + " | ".join(['-' * 3 for h in head]) + " |\n")
            for rewards in region["ExpeditionRewards"]:
                regionRewards = []
                for gEntry in groupData[rewards["MagicDollCountRewards"][-1]["DefaultPrivateLotteryGroupId"]]["ItemLotteryPrivateGroupEntry"]:#pGroupEntrys:
                    if gEntry["id"] in unitData:
                        ItemLotteryUnitEntry = unitData[gEntry["id"]]["ItemLotteryUnitEntry"]
                        regionRewards.append({
                            'item': getImg(ItemLotteryUnitEntry[0]["item"]),
                            'avg': avgQuantity(ItemLotteryUnitEntry)
                        })
                        #print("✅", gEntry["id"], unitData[gEntry["id"]])
                    else:
                        print("Error in UnitData.")
                md.write(f"| {rewards['ExpedtionTime']/3600} h | "+ " | ".join(f'{r["item"]} | {r["avg"]:.1f}' for r in regionRewards) + " |\n")

            md.write("\n\n")

        md.write("All Propabilitys are averages\n\n")
        md.write("sources = "+", ".join([regionPath,groupPath,unitPath]))

writeMarkdown(
    output="docs/doll/expeditionRewards.md"
)