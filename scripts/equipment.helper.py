import json
import os

outputNC = 'sources/TLEquipment.NC.helper'
outputAGS = 'sources/TLEquipment.AGS.helper'

def loadFile(filepath):
    try:
        return json.load(open(filepath, encoding="utf-8"))[0]['Rows']
    except FileNotFoundError:
        return {}


####
####
####    GLOBAL
####
####

TLStats = loadFile('sources/TLStats')

TLItemLooks = loadFile('sources/TLItemLooks')

TLItemEquip = loadFile('sources/TLItemEquip') #item_grade
TLItemMisc = loadFile('sources/TLItemMisc') #item_grade
TLGlobalCommon = loadFile('sources/TLGlobalCommon') #TraitInfoMap
TLItemRandomStatGroup = loadFile('sources/TLItemRandomStatGroup')#TraitResonance

### Traits

TLItemTraits = loadFile('sources/TLItemTraits')
TLItemTraitGroup = loadFile('sources/TLItemTraitGroup')
TLItemTraitsBaseValue = loadFile('sources/TLItemTraitsBaseValue')
TLItemTraitsEnchantValue = loadFile('sources/TLItemTraitsEnchantValue')

####
####
####    HELPER
####
####

TLItemStats = {}

# e.g. DEFENSE
TLStatsItemBaseValue = {}
TLStatsItemEnchantValue = {}

TLItemMainStatInit = {}
TLItemMainStatEnchant = {}

TLItemExtraStatInit = {}
TLItemExtraStatEnchant = {}

####
####    HELPER GLOBAL SELF
####

TLStatsLookup = {}

itemList = {}
itemList['NC'] = {}
itemList['AGS'] = {}

####
####
####    NC
####
####

TLItemStats['NC'] = loadFile('sources/TLItemStats')

TLStatsItemBaseValue['NC'] = loadFile('sources/TLStatsItemBaseValue')
TLStatsItemEnchantValue['NC'] = loadFile('sources/TLStatsItemEnchantValue')

TLItemMainStatInit['NC'] = loadFile('sources/TLItemMainStatInit')
TLItemMainStatEnchant['NC'] = loadFile('sources/TLItemMainStatEnchant')

TLItemExtraStatInit['NC'] = loadFile('sources/TLItemExtraStatInit')
TLItemExtraStatEnchant['NC'] = loadFile('sources/TLItemExtraStatEnchant')

####
####
####    AGS
####
####

TLItemStats['AGS'] = loadFile('sources/TLItemStats_AGS')

TLStatsItemBaseValue['AGS'] = loadFile('sources/TLStatsItemBaseValue_AGS')
TLStatsItemEnchantValue['AGS'] = loadFile('sources/TLStatsItemEnchantValue_AGS')

TLItemMainStatInit['AGS'] = loadFile('sources/TLItemMainStatInit_AGS')
TLItemMainStatEnchant['AGS'] = loadFile('sources/TLItemMainStatEnchant_AGS')

TLItemExtraStatInit['AGS'] = loadFile('sources/TLItemExtraStatInit_AGS')
TLItemExtraStatEnchant['AGS'] = loadFile('sources/TLItemExtraStatEnchant_AGS')

####    FUNCTION
####
####    LOOKUPS
####
####

def makeTLStatsLookup():
    for key, value in TLStats.items():
        stat_enum = value.get("stat_enum", "")
        if stat_enum.startswith("EItemStats::"):
            short_name = stat_enum.split("::", 1)[1]# Strip "EItemStats::" and use just the kName part
            TLStatsLookup[short_name] = key

def getList(List, compareValues, ListID=None):
    def match(entry, pairs):
        return all(entry.get(field) == value for field, value in pairs)

    pairs = list(zip(compareValues[::2], compareValues[1::2]))

    # Case 1: dict with ListID
    if isinstance(List, dict) and ListID in List and isinstance(List[ListID], dict):
        for entry in List[ListID].values():
            if match(entry, pairs):
                return entry

    # Case 2: fallback to NC if structured dict
    if isinstance(List, dict) and ListID and ListID != "NC" and "NC" in List and isinstance(List["NC"], dict):
        for entry in List["NC"].values():
            if match(entry, pairs):
                return entry

    # Case 3: dict of dicts without ListID
    if isinstance(List, dict):
        for entry in List.values():
            if isinstance(entry, dict) and match(entry, pairs):
                return entry

    # Case 4: list of dicts
    if isinstance(List, list):
        for entry in List:
            if match(entry, pairs):
                return entry

    return None



####    FUNCTION
####
####    grabValues
####
####

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

####    FUNCTION
####
####    Traits
####
####

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

        baseValue = getList(baseValueLookup, ["seed", base_seed])

        for level in range(1, maxTraitLevel['maxLevel']+1):
            enchantValue = getList(enchantValueLookup, ["enchant_level", level])
            traitLevelValue = baseValue[TLStatsLookup[trait_id]] + enchantValue[TLStatsLookup[trait_id]]
            values.append(traitLevelValue)
        traits[TLStatsLookup[trait_id]] = values

    return traits

def clearResonance(ListID, trait_resonance_id):
    traitResonance = {}
    if trait_resonance_id == None or trait_resonance_id == 'None':
        return traitResonance

    resonanceBase = TLStatsItemBaseValue[ListID][TLItemRandomStatGroup[trait_resonance_id]['BaseValueId']]['Stats']
    resonanceEnchant = TLStatsItemEnchantValue[ListID][TLItemRandomStatGroup[trait_resonance_id]['EnchantValueId']]['Stats']

    for statGroup in TLItemRandomStatGroup[trait_resonance_id]['RandomStatCandidates']:
        baseValue = getList(resonanceBase, ["seed", statGroup.get("BaseSeed")])
        traitResonance[TLStatsLookup[statGroup.get("ItemStatType").split("::", 1)[1]]] = baseValue[TLStatsLookup[statGroup.get("ItemStatType").split("::", 1)[1]]]

    return traitResonance


####    FUNCTION
####
####    MainStats
####
####

def clearMainStats(ListID, baseId, baseSeed, enchantId, maxLevel):
    mainStats = {}

    baseValue = getList(TLItemMainStatInit, ["seed", baseSeed, "id", baseId],ListID)
    for key, value in baseValue.items():
        if value != 0 and key in TLStatsLookup.values():
            mainStats[key] = [value]
    for level in range(1,maxLevel+1):
        EnchantValue = getList(TLItemMainStatEnchant, ["enchant_level", level, "id", enchantId],ListID)
        for key, value in EnchantValue.items():
            if value != 0 and key in TLStatsLookup.values():
                if key not in mainStats:
                    mainStats[key] = [0]
                mainStats[key].append(mainStats[key][0] + value)

    return mainStats

####    FUNCTION
####
####    ExtraStats
####
####

def clearExtraStats(item):
    return 0

####    FUNCTION
####
####    Main()
####
####

def getItemStats(ListID, key, value):
    itemStats = {}
    itemStats['grade'] = getEquipGrade(key)
    if itemStats['grade'] == None:
        return itemStats #not common, or other grade in both lists, might refractor later, currently just drop them
    itemStats['traits'] = clearTraits(value.get("trait_group_id"), itemStats['grade'])
    
    looks = getLooks(key)
    itemStats['icon'] = looks.get("icon")
    itemStats['name'] = looks.get("locaString")

    itemStats['resonance'] = clearResonance(ListID, value.get("trait_resonance_id"))

    itemStats['main'] = clearMainStats(ListID, value.get("main_stat_base_id"), value.get("main_stat_base_seed"), value.get("main_stat_enchant_id"), value.get("enchant_level_max"))

    return itemStats

def makeList(ListID):
    for key, value in TLItemStats[ListID].items():
        itemList[ListID][key] = getItemStats(ListID, key, value)

# first make NC list, copy into AGS list, loop over AGS list and override

makeTLStatsLookup()

makeList('NC')
itemList['AGS'] = itemList['NC'].copy()
makeList('AGS')

####    FUNCTION
####
####    Save To Files
####
####

os.makedirs(os.path.dirname(outputNC), exist_ok=True)
with open(outputNC, "w", encoding="utf-8") as f:
    json.dump(itemList['NC'], f, indent=2, ensure_ascii=False)

print(f"itemList table written to {outputNC}")

os.makedirs(os.path.dirname(outputAGS), exist_ok=True)
with open(outputAGS, "w", encoding="utf-8") as f:
    json.dump(itemList['AGS'], f, indent=2, ensure_ascii=False)

print(f"itemList table written to {outputAGS}")