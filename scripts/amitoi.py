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

regionData = loadFile(regionPath)
groupData = loadFile(groupPath)
unitData = loadFile(unitPath)

def avgQuantity(entries):
    return sum(entry['quantity'] * (entry['prob'] / 10000) for entry in entries) / sum(entry['prob'] / 10000 for entry in entries)

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
                            'item': ItemLotteryUnitEntry[0]["item"],
                            'avg': avgQuantity(ItemLotteryUnitEntry)
                        })
                        #print("✅", gEntry["id"], unitData[gEntry["id"]])
                    else:
                        print("Error in UnitData.")
                md.write(f"| {rewards['ExpeditionTime']/3600} h | "+ " | ".join(f'{r["item"]} | {r["avg"]:.1f}' for r in regionRewards) + " |\n")

            md.write("\n\n")

        md.write("All Propabilitys are averages\n\n")
        md.write("sources = "+", ".join([regionPath,groupPath,unitPath]))

    replacements = {
    "dungeon_point_stone_05_A": "<img src='./Image/Icon/Item_128/Usable/abyss_point_charge_001_1_A.png'>",
    "material_mana_fabric_02": "<img src='./Image/Icon/Item_128/Misc/I_ManaFabric_002.png'>",
    "material_mana_wood_02": "<img src='./Image/Icon/Item_128/Misc/I_ManaWood_002.png'>",
    "Material_Food_Sub_Rotein_002": "<img src='./Image/Icon/Item_128/Usable/I_food_sub_045.png'>",
    "material_mana_leather_02":"<img src='./Image/Icon/Item_128/Misc/I_ManaLeather_002.png'>",
    "material_mana_steel_02": "<img src='./Image/Icon/Item_128/Misc/I_ManaSteel_002.png'>",
    "Material_Food_Sub_Solute_002":"<img src='./Image/Icon/Item_128/Usable/I_food_sub_031.png'>",
    "material_gold_02":"<img src='./Image/Icon/Item_128/Misc/I_Gold_002.png'>",
    "Material_Food_Sub_Fruice_003":"<img src='./Image/Icon/Item_128/Usable/I_food_sub_018.png'>",
    "material_food_main_032":"<img src='./Image/Icon/Item_128/Usable/I_material_food_main_032.png'>",
    "Material_Food_Sub_Herba_003":"<img src='./Image/Icon/Item_128/Usable/I_food_sub_025.png'>",
    "material_food_main_033":"<img src='./Image/Icon/Item_128/Usable/I_material_food_main_033.png'>",
    "material_food_main_012":"<img src='./Image/Icon/Item_128/Usable/I_material_food_main_012.png'>",
    }

    with open(output, "r", encoding="utf-8") as f:
        content = f.read()

    for old, new in replacements.items():
        content = content.replace(old, new)

    with open(output, "w", encoding="utf-8") as f:
        f.write(content)

writeMarkdown(
    output="docs/doll/expeditionRewards.md"
)