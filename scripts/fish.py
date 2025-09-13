from _utils import sidebarjson, loadFile, writeMarkdown

outputDir = 'docs/fish/'

#TLFishingFishGroupInfo = loadFile('sources/TLFishingFishGroupInfo')
#TLFishingCommonInfo = loadFile('sources/TLFishingCommonInfo')

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

    writeMarkdown( output, "Fishing Level",
    {
        'cat1': "Basics",
        'sub1': "Fishing"
    }, fishLevel)

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

    writeMarkdown( output, "Fish Habitat",
    {
        'cat1': "Basics",
        'sub1': "Habitats"
    }, fishHabitat)

FishingLevel()
FishHabitat()