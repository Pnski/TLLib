import json
import os

from _utils import sidebarjson, loadFile

outputDir = 'docs/fish/'

TLFishingFishGroupInfo = loadFile('sources/TLFishingFishGroupInfo')
TLFishingCommonInfo = loadFile('sources/TLFishingCommonInfo')

def FishingLevel():
    fishLevel = {}
    TLFishingLevel = loadFile('sources/TLFishingLevel')
    i = 0
    for key, value in TLFishingLevel.items():
        fishLevel[i] = {
            'Name': key,
            'expNext': value.get("LevelExpThreshold") - fishLevel.get(i-1,{}).get("TotalExp",0),
            'TotalExp': value.get("LevelExpThreshold"),
            'Title': value.get("Title",{}).get("LocalizedString",""),
        }
        i += 1

    outputName = 'Level.md'
    output = outputDir + outputName 
    os.makedirs(os.path.dirname(output), exist_ok=True)
    with open(output, "w", encoding="utf-8") as md:
        md.write(f"# Fishing Level\n\n")

        md.write("| " + " | ".join(fishLevel[0].keys()) + " |\n")
        md.write("| " + " | ".join(['-' * 3 for h in fishLevel[0].keys()]) + " |\n")
        for key in fishLevel.keys():
            md.write("| " + " | ".join(str(v) for v in fishLevel[key].values()) + " |\n")
    print(f"FishingLevel table written to {output}")
    sidebarjson("Basics", "Fishing", "Level", output.removeprefix("docs/"), "docs/sidebar.json")

def FishHabitat():
    fishHabitat = {}
    TLFishingFishInfo = loadFile('sources/TLFishingFishInfo')
    i = 0
    for key, value in TLFishingFishInfo.items():
        fishHabitat[i] = {
            'Name': value.get("FishName",{}).get("LocalizedString"),
            'Level': value.get("Level"),
            'Habitat': [h["RowName"] for h in value.get("HabitatInfo", {}).get("HabitatList", [])]
        }
        i += 1

    outputName = 'Habitat.md'
    output = outputDir + outputName 
    os.makedirs(os.path.dirname(output), exist_ok=True)
    with open(output, "w", encoding="utf-8") as md:
        md.write(f"# Fish Habitat\n\n")

        md.write("| " + " | ".join(fishHabitat[0].keys()) + " |\n")
        md.write("| " + " | ".join(['-' * 3 for h in fishHabitat[0].keys()]) + " |\n")
        for key, row in fishHabitat.items():
            row_values = []
            for v in row.values():
                if isinstance(v, list):
                    row_values.append("<br>".join(f"- {x}" for x in v))
                else:
                    row_values.append(str(v))
            md.write("| " + " | ".join(row_values) + " |\n")
    print(f"Fishing Habitat table written to {output}")
    sidebarjson("Basics", "Fishing", "Habitat", output.removeprefix("docs/"), "docs/sidebar.json")

FishingLevel()

FishHabitat()