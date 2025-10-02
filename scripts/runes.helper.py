from _utils import saveJson, loadFile, TLStatsLookup

from collections import defaultdict
from typing import List, Dict, Any

output = "sources/TLRunes.helper"

# =========
# Load all data
# =========

TLItemRandomStatGroup = loadFile(
    "sources/TLItemRandomStatGroup"
)  # TraitResonance #runes
TLTableGlobalSettingsUX = loadFile(
    "sources/TLTableGlobalSettingsUX"
)  # default-runesocketlooks-KEY=ETLRuneSocketType::Defense-RuneSocketName.LocalizedString

TLRuneSocket = loadFile("sources/TLRuneSocket")
TLRuneSynergy = loadFile("sources/TLRuneSynergy")
TLRuneInfo = loadFile("sources/TLRuneInfo")

TLStatsLookup = TLStatsLookup()

TLStatsItemBaseValue = loadFile("sources/TLStatsItemBaseValue")
TLStatsItemEnchantValue = loadFile("sources/TLStatsItemEnchantValue")


def getRandomStat(RandomStatGroup):
    data = TLItemRandomStatGroup.get(RandomStatGroup.get("RowName"), None)
    if data is None:
        return None
    list = {
        "BaseValueId": data.get("BaseValueId"),
        "EnchantValueId": data.get("EnchantValueId"),
        "Candidates": data.get("RandomStatCandidates"),
    }
    return list


def getRuneBase():
    return 0


def getRuneSynergy(rune):
    return 0


def getRuneLevels(baseSeed, itemStatType, BaseValueId, EnchantValueId) -> list:

    statsBaseValues = TLStatsItemBaseValue.get(BaseValueId, {}).get("Stats")
    statsEnchantValues = TLStatsItemEnchantValue.get(EnchantValueId, {}).get("Stats", {})

    statsBaseValue = next(
        (d for d in statsBaseValues if d.get("seed") == baseSeed), None
    )

    currentStatBaseValue = statsBaseValue.get(TLStatsLookup[itemStatType])
    runeLevels = []
    for levels in statsEnchantValues:
        runeLevels.append(
            levels.get(TLStatsLookup[itemStatType]) + currentStatBaseValue
        )
    if runeLevels == []:
        runeLevels = [currentStatBaseValue]

    return runeLevels


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
        stats = getRandomStat(pos)
        runes = []
        if stats:
            for candidate in stats["Candidates"]:
                baseSeed = candidate.get("BaseSeed")
                itemStatType = candidate.get("ItemStatType")

                runes.append(
                    {
                        "levels": getRuneLevels(
                            baseSeed,
                            itemStatType,
                            stats["BaseValueId"],
                            (stats["EnchantValueId"] if "Chaos" not in rune_type else None),
                        ),
                        "name": itemStatType,
                        "value": True
                    }
                )
        runess = item.get("RandomStatCandidates")
        runesList[category][rune_type].append(runes)

# =========
# Save
# =========

saveJson("sources/TLRunes.helper", runesList)