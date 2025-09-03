import json
import os

output = 'sources/TLEquipment.helper'

def loadFile(filepath):
    try:
        return json.load(open(filepath, encoding="utf-8"))[0]['Rows']
    except FileNotFoundError:
        return {}

TLStats = loadFile('sources/TLStats')

TLItemStats = loadFile('sources/TLItemStats')

TLItemLooks = loadFile('sources/TLItemLooks')

TLItemEquip = loadFile('sources/TLItemEquip') #item_grade
TLItemMisc = loadFile('sources/TLItemMisc') #item_grade
TLGlobalCommon = loadFile('sources/TLGlobalCommon') #TraitInfoMap
TLItemRandomStatGroup = loadFile('sources/TLItemRandomStatGroup')#TraitResonance

TLItemExtraStatInit = loadFile('sources/TLItemExtraStatInit')
TLItemExtraStatEnchant = loadFile('sources/TLItemExtraStatEnchant')

TLItemMainStatInit = loadFile('sources/TLItemMainStatInit')
TLItemMainStatEnchant = loadFile('sources/TLItemMainStatEnchant')

TLItemTraits = loadFile('sources/TLItemTraits')
TLItemTraitGroup = loadFile('sources/TLItemTraitGroup')
TLItemTraitsBaseValue = loadFile('sources/TLItemTraitsBaseValue')
TLItemTraitsEnchantValue = loadFile('sources/TLItemTraitsEnchantValue')

TLStatsItemBaseValue = loadFile('sources/TLStatsItemBaseValue')
TLStatsItemEnchantValue = loadFile('sources/TLStatsItemEnchantValue')

# Build the lookup table
TLStatsLookup = {}
for key, value in TLStats.items():
    stat_enum = value.get("stat_enum", "")
    if stat_enum.startswith("EItemStats::"):
        # Strip "EItemStats::" and use just the kName part
        short_name = stat_enum.split("::", 1)[1]
        TLStatsLookup[short_name] = key

def getMaxTraitLevel(grade):
    trait_info_list = (
        TLGlobalCommon.get("GlobalCommonData", {})
        .get("ItemTraitSetting", {})
        .get("TraitInfoMap", [])
    )

    for entry in trait_info_list:
        value = entry.get("Value", {})
        if entry.get("Key") == grade:
            return {
                "count": value.get("TraitMaxCount"),
                "maxLevel": value.get("ItemTraitMaxLevel")
            }
    return None

def getEquipGrade(item):
    grade = (
        TLItemEquip.get(item, {}).get("item_grade") 
        or TLItemMisc.get(item, {}).get("item_grade") 
        or None
    )
    return grade

def getLooks(item):
    looks = TLItemLooks.get(item, None)
    if (looks == None):
        return {}
    else:
        return {
            "icon": looks.get("IconPath", {}).get("AssetPathName",None).split('.')[0].replace("/Game", ".") + ".png",
            "locaString": looks.get("UIName", {}).get("LocalizedString",None)
        }

def clearTraits(item, itemGrade):
    traits = {}
    itemTraitCandidates = TLItemTraitGroup.get(item, {}).get("TraitCandidates", None)
    if itemTraitCandidates is None or itemGrade is None:
        return None

    maxTraitLevel = getMaxTraitLevel(itemGrade)

    for trait in itemTraitCandidates:
        values = []
        trait_id = trait['TraitId']
        base_seed = trait['BaseSeed']

        baseValueLookup = TLItemTraitsBaseValue[TLItemTraits[trait_id]['ItemTraitsBaseValueId']]['Stats']
        enchantValueLookup = TLItemTraitsEnchantValue[TLItemTraits[trait_id]['ItemTraitsEnchantValueId']]['Stats']

        baseValue = next((entry for entry in baseValueLookup if entry.get("seed") == base_seed), None)
        for level in range(1, maxTraitLevel['maxLevel']+1):
            enchantValue = next((entry for entry in enchantValueLookup if entry.get("enchant_level") == level), None)
            traitLevelValue = baseValue[TLStatsLookup[trait_id]] + enchantValue[TLStatsLookup[trait_id]]
            values.append(traitLevelValue)
        traits[TLStatsLookup[trait_id]] = values

    return traits

def clearResonance(trait_resonance_id):
    traitResonance = {}
    if trait_resonance_id == None or trait_resonance_id == 'None':
        return traitResonance

    resonanceBase = TLStatsItemBaseValue[TLItemRandomStatGroup[trait_resonance_id]['BaseValueId']]['Stats']
    resonanceEnchant = TLStatsItemEnchantValue[TLItemRandomStatGroup[trait_resonance_id]['EnchantValueId']]['Stats']

    for statGroup in TLItemRandomStatGroup[trait_resonance_id]['RandomStatCandidates']:
        baseValue = next((entry for entry in resonanceBase if entry.get("seed") == statGroup.get("BaseSeed")), None)
        traitResonance[TLStatsLookup[statGroup.get("ItemStatType").split("::", 1)[1]]] = baseValue[TLStatsLookup[statGroup.get("ItemStatType").split("::", 1)[1]]]

    return traitResonance


def clearMainStats(baseId, baseSeed, enchantId, maxLevel):
    mainStats = {}

    baseValue = next((entry for entry in TLItemMainStatInit.values() if (entry.get("seed") == baseSeed and entry.get("id") == baseId)), None)
    for key, value in baseValue.items():
        if value != 0 and key in TLStatsLookup.values():
            mainStats[key] = [value]
    for level in range(1,maxLevel+1):
        EnchantValue = next((entry for entry in TLItemMainStatEnchant.values() if (entry.get("enchant_level") == level and entry.get("id") == enchantId)), None)
        for key, value in EnchantValue.items():
            if value != 0 and key in TLStatsLookup.values():
                if key not in mainStats:
                    mainStats[key] = [0]
                mainStats[key].append(mainStats[key][0] + value)

    
    

    return mainStats

def clearExtraStats(item):
    return 0

itemList = {}
for key, value in TLItemStats.items():
    itemStats = {}
    itemStats['grade'] = getEquipGrade(key)
    if itemStats['grade'] == None:
        continue #not common, or other grade in both lists, might refractor later, currently just drop them
    itemStats['traits'] = clearTraits(value.get("trait_group_id"), itemStats['grade'])
    
    looks = getLooks(key)
    itemStats['icon'] = looks.get("icon")
    itemStats['name'] = looks.get("locaString")

    itemStats['resonance'] = clearResonance(value.get("trait_resonance_id"))

    itemStats['main'] = clearMainStats(value.get("main_stat_base_id"), value.get("main_stat_base_seed"), value.get("main_stat_enchant_id"), value.get("enchant_level_max"))


    itemList[key] = itemStats
    

# Save lookup table as JSON

os.makedirs(os.path.dirname(output), exist_ok=True)
with open(output, "w", encoding="utf-8") as f:
    json.dump(itemList, f, indent=2, ensure_ascii=False)

print(f"itemList table written to {output}")