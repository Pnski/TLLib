from _utils import sidebarjson, loadFile

from collections import defaultdict
from typing import List, Dict, Any

output = 'sources/TLRunes.helper'

# =========
# Load all data
# =========

TLItemRandomStatGroup = loadFile('sources/TLItemRandomStatGroup')  # TraitResonance #runes
TLTableGlobalSettingsUX = loadFile('sources/TLTableGlobalSettingsUX') #default-runesocketlooks-KEY=ETLRuneSocketType::Defense-RuneSocketName.LocalizedString

TLRuneSocket = loadFile('sources/TLRuneSocket')
TLRuneSynergy = loadFile('sources/TLRuneSynergy')
TLRuneInfo = loadFile('sources/TLRuneInfo')

TLStatsLookup = {}          # short_name -> stat key used in value tables

for key, value in loadFile('sources/TLStats').items():
    stat_enum = value.get("stat_enum")
    if stat_enum:
        TLStatsLookup[stat_enum] = key

def getRandomStat(RandomStatGroup):
    list = {
        'BaseValueId': TLItemRandomStatGroup.get(RandomStatGroup.get("RowName"),{}).get("BaseValueId"),
        'EnchantValueId': TLItemRandomStatGroup.get(RandomStatGroup.get("RowName"),{}).get("EnchantValueId"),
        'Candidates': TLItemRandomStatGroup.get(RandomStatGroup.get("RowName"),{}).get("RandomStatCandidates")
    }
    return list

def getRuneBase():
    return 0

def getRuneSynergy(rune):
    return 0

def getRuneCategory():
    runeCategory = defaultdict(list)
    for runes in TLRuneInfo.values():
        category = runes.get("RuneTargetCategory", None)
        runeCategory[category].append(runes)
    return runeCategory

runesList = defaultdict(lambda: defaultdict(list))

for category, values in getRuneCategory().items():
    for item in values:
        rune_type = item.get("RuneType")
        pos = item.get("PositiveRandomStatGroup")
        neg = item.get("NegativeRandomStatGroup")
        stats = getRandomStat(pos)

        if stats:
            for candidate in stats["Candidates"]:
                baseSeed = candidate.get("BaseSeed")
                itemStatType = candidate.get("ItemStatType")
                print(baseSeed, itemStatType)

            #getBase

            #getEnchant

        runes = item.get("RandomStatCandidates")
        runesList[category][rune_type].append([pos, neg])

print(runesList)

# =========
# Save
# =========
