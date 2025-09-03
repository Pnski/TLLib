import json
import os

outputNC = 'sources/TLEquipment.NC.helper'
outputAGS = 'sources/TLEquipment.AGS.helper'

def loadFile(filepath):
    try:
        return json.load(open(filepath, encoding="utf-8"))[0]['Rows']
    except FileNotFoundError:
        return {}


class CaseInsensitiveDict(dict):
    def __getitem__(self, key):
        return super().__getitem__(key.lower())
    def get(self, key, default=None):
        return super().get(key.lower(), default)



# =========
# Load all data
# =========

TLStats = loadFile('sources/TLStats')

TLItemLooks = loadFile('sources/TLItemLooks')

TLItemEquip = loadFile('sources/TLItemEquip')  # item_grade
TLItemMisc = loadFile('sources/TLItemMisc')    # item_grade
TLGlobalCommon = loadFile('sources/TLGlobalCommon')  # TraitInfoMap
TLItemRandomStatGroup = loadFile('sources/TLItemRandomStatGroup')  # TraitResonance

# Traits (global)
TLItemTraits = loadFile('sources/TLItemTraits')
TLItemTraitGroup = loadFile('sources/TLItemTraitGroup')
TLItemTraitsBaseValue = loadFile('sources/TLItemTraitsBaseValue')
TLItemTraitsEnchantValue = loadFile('sources/TLItemTraitsEnchantValue')

# Per-list containers
TLItemStats = {}
TLStatsItemBaseValue = {}
TLStatsItemEnchantValue = {}

TLItemMainStatInit = {}
TLItemMainStatEnchant = {}

TLItemExtraStatInit = {}
TLItemExtraStatEnchant = {}

# Output container
itemList = {"NC": {}, "AGS": {}}

# NC files
TLItemStats['NC'] = loadFile('sources/TLItemStats')
TLStatsItemBaseValue['NC'] = loadFile('sources/TLStatsItemBaseValue')
TLStatsItemEnchantValue['NC'] = loadFile('sources/TLStatsItemEnchantValue')
TLItemMainStatInit['NC'] = loadFile('sources/TLItemMainStatInit')
TLItemMainStatEnchant['NC'] = loadFile('sources/TLItemMainStatEnchant')
TLItemExtraStatInit['NC'] = loadFile('sources/TLItemExtraStatInit')
TLItemExtraStatEnchant['NC'] = loadFile('sources/TLItemExtraStatEnchant')

# AGS files
TLItemStats['AGS'] = loadFile('sources/TLItemStats_AGS')
TLStatsItemBaseValue['AGS'] = loadFile('sources/TLStatsItemBaseValue_AGS')
TLStatsItemEnchantValue['AGS'] = loadFile('sources/TLStatsItemEnchantValue_AGS')
TLItemMainStatInit['AGS'] = loadFile('sources/TLItemMainStatInit_AGS')
TLItemMainStatEnchant['AGS'] = loadFile('sources/TLItemMainStatEnchant_AGS')
TLItemExtraStatInit['AGS'] = loadFile('sources/TLItemExtraStatInit_AGS')
TLItemExtraStatEnchant['AGS'] = loadFile('sources/TLItemExtraStatEnchant_AGS')

# =========
# Lookups
# =========

TLStatsLookup = {}          # short_name -> stat key used in value tables
TLStatsValueKeys = set()    # set of stat keys for fast membership check

def makeTLStatsLookup():
    for key, value in TLStats.items():
        stat_enum = value.get("stat_enum", "")
        if stat_enum.startswith("EItemStats::"):
            short = stat_enum.split("::", 1)[1]
            TLStatsLookup[short] = key
    # speed up: use set for membership checks in value tables
    global TLStatsValueKeys
    TLStatsValueKeys = set(TLStatsLookup.values())

def build_lookup_dict(data, key_order):
    """Build a dict keyed by a tuple of the given key_order."""
    entries = data.values() if isinstance(data, dict) else data
    out = {}
    for entry in entries:
        k = tuple(entry.get(kf) for kf in key_order)
        out[k] = entry
    return out

def build_per_list_lookup(data_by_list, key_order):
    """Return {ListID: {(k1,...): entry}} using the same key order for all."""
    return {
        list_id: build_lookup_dict(data_by_list[list_id], key_order)
        for list_id in data_by_list
    }

def plookup(lookup_by_list, list_id, key_order, **query):
    """
    Per-list lookup with fallback: try list_id → 'NC' → None.
    key_order defines the tuple ordering; query is dict-like.
    """
    key = tuple(query.get(k) for k in key_order)

    # 1) exact list_id
    lkp = lookup_by_list.get(list_id)
    if lkp is not None:
        val = lkp.get(key)
        if val is not None:
            return val

    # 2) fallback to NC
    if list_id != 'NC':
        lkp_nc = lookup_by_list.get('NC')
        if lkp_nc is not None:
            return lkp_nc.get(key)

    # 3) nothing
    return None

# Global trait lookups (same for NC/AGS; traits tables are global)
TraitBaseValueLookup = {}     # {trait_id: {(seed,): entry}}
TraitEnchantValueLookup = {}  # {trait_id: {(enchant_level,): entry}}

def build_trait_lookups():
    for trait_id, tval in TLItemTraits.items():
        base_id = tval.get('ItemTraitsBaseValueId')
        ench_id = tval.get('ItemTraitsEnchantValueId')
        if base_id and base_id in TLItemTraitsBaseValue:
            TraitBaseValueLookup[trait_id] = build_lookup_dict(
                TLItemTraitsBaseValue[base_id]['Stats'], ('seed',)
            )
        if ench_id and ench_id in TLItemTraitsEnchantValue:
            TraitEnchantValueLookup[trait_id] = build_lookup_dict(
                TLItemTraitsEnchantValue[ench_id]['Stats'], ('enchant_level',)
            )

# Resonance base lookups per ListID and group
# ResonanceEnchant not used in your code for building the dict, so we keep base only
ResonanceBaseLookup = {}  # {ListID: {group_id: {(seed,): entry}}}

def build_resonance_lookups():
    for list_id, base_table in TLStatsItemBaseValue.items():
        ResonanceBaseLookup[list_id] = {}
        for group_id, group in TLItemRandomStatGroup.items():
            base_id = group.get('BaseValueId')
            if base_id and base_id in base_table:
                ResonanceBaseLookup[list_id][group_id] = build_lookup_dict(
                    base_table[base_id]['Stats'], ('seed',)
                )

# Main stat lookups per ListID with explicit key order
MAIN_INIT_KEYS = ('seed', 'id')
MAIN_ENCH_KEYS = ('enchant_level', 'id')

MainStatInitLookup = {}     # {ListID: {(seed,id): entry}}
MainStatEnchantLookup = {}  # {ListID: {(enchant_level,id): entry}}

def build_mainstat_lookups():
    global MainStatInitLookup, MainStatEnchantLookup
    MainStatInitLookup = build_per_list_lookup(TLItemMainStatInit, MAIN_INIT_KEYS)
    MainStatEnchantLookup = build_per_list_lookup(TLItemMainStatEnchant, MAIN_ENCH_KEYS)

# Extra stat lookups
EXTRA_INIT_KEYS = ('stat_seed', 'seed_group_id')   # for init tables
EXTRA_ENCH_KEYS = ('enchant_level', "seed_group_id")         # for enchants

ExtraStatInitLookup = {}
ExtraStatEnchantLookup = {}

def build_extrastat_lookups():
    global ExtraStatInitLookup, ExtraStatEnchantLookup
    ExtraStatInitLookup = build_per_list_lookup(TLItemExtraStatInit, EXTRA_INIT_KEYS)
    ExtraStatEnchantLookup = build_per_list_lookup(TLItemExtraStatEnchant, EXTRA_ENCH_KEYS)


# =========
# Value helpers
# =========

def getMaxTraitLevel(grade):
    trait_info_list = (
        TLGlobalCommon.get("GlobalCommonData", {})
        .get("ItemTraitSetting", {})
        .get("TraitInfoMap", [])
    )
    for entry in trait_info_list:
        if entry.get("Key") == grade:
            value = entry.get("Value", {})
            return {
                "count": value.get("TraitMaxCount"),
                "maxLevel": value.get("ItemTraitMaxLevel")
            }
    return None

def getEquipGrade(item):
    return (
        TLItemEquip.get(item, {}).get("item_grade")
        or TLItemMisc.get(item, {}).get("item_grade")
        or None
    )

def getLooks(item):
    looks = TLItemLooks.get(item)
    if not looks:
        return {}
    icon_path = looks.get("IconPath", {}).get("AssetPathName", None)
    icon = None
    if icon_path:
        icon = icon_path.split('.')[0].replace("/Game", ".") + ".png"
    return {
        "icon": icon,
        "locaString": looks.get("UIName", {}).get("LocalizedString", None)
    }

# =========
# Builders
# =========

def clearTraits(item_trait_group_id, itemGrade):
    itemTraitCandidates = TLItemTraitGroup.get(item_trait_group_id, {}).get("TraitCandidates")
    if not itemTraitCandidates or not itemGrade:
        return None

    maxTraitLevel = getMaxTraitLevel(itemGrade)
    if not maxTraitLevel:
        return None

    traits = {}
    max_level = maxTraitLevel['maxLevel']

    for cand in itemTraitCandidates:
        trait_id = cand['TraitId']
        base_seed = cand['BaseSeed']

        baseMap = TraitBaseValueLookup.get(trait_id)
        enchMap = TraitEnchantValueLookup.get(trait_id)
        if not baseMap or not enchMap:
            continue

        baseValue = baseMap.get((base_seed,))
        if baseValue is None:
            continue

        stat_key = TLStatsLookup[trait_id]  # numeric/stat-key used in value tables
        values = []
        for level in range(1, max_level + 1):
            ench = enchMap.get((level,))
            # safety: only compute if enchant row exists; if not, stop early
            if ench is None:
                break
            values.append(baseValue[stat_key] + ench[stat_key])
        # only store if we actually produced progression
        if values:
            traits[stat_key] = values

    return traits if traits else None

def clearResonance(ListID, trait_resonance_id):
    if not trait_resonance_id or trait_resonance_id == 'None':
        return {}

    # Try AGS/NC based on ListID, with fallback to NC
    baseLookup = (
        ResonanceBaseLookup.get(ListID, {}).get(trait_resonance_id)
        or ResonanceBaseLookup.get('NC', {}).get(trait_resonance_id)
    )
    if not baseLookup:
        return {}

    res = {}
    for statGroup in TLItemRandomStatGroup[trait_resonance_id]['RandomStatCandidates']:
        base = baseLookup.get((statGroup.get("BaseSeed"),))
        if base is None:
            # seed missing in current list; skip this candidate
            continue
        short = statGroup.get("ItemStatType").split("::", 1)[1]
        stat_key = TLStatsLookup[short]
        res[stat_key] = base[stat_key]
    return res

def clearMainStats(ListID, baseId, baseSeed, enchantId, maxLevel):
    mainStats = {}

    # Base: per-list lookup with fallback to NC
    baseValue = plookup(MainStatInitLookup, ListID, MAIN_INIT_KEYS, seed=baseSeed, id=baseId)
    if baseValue:
        for k, v in baseValue.items():
            if k in TLStatsValueKeys and v is not None and v != 0:
                mainStats[k] = [v]

    # Enchant progression: per-list lookup with fallback to NC
    for level in range(1, (maxLevel or 0) + 1):
        ench = plookup(MainStatEnchantLookup, ListID, MAIN_ENCH_KEYS, enchant_level=level, id=enchantId)
        if not ench:
            # if a level is missing entirely, we just stop progression (matches old behavior of "skip")
            continue
        for k, v in ench.items():
            if k in TLStatsValueKeys and v is not None and v != 0:
                if k not in mainStats:
                    # If base missing for this key, treat base as 0 for progression alignment
                    mainStats[k] = [0]
                mainStats[k].append(mainStats[k][0] + v)

    return mainStats

def clearExtraStats(ListID, item_value, maxLevel):
    extraStats = {}

    baseId = item_value.get("extra_stat_base_id")
    enchantId = item_value.get("extra_stat_enchant_id")

    for i in range(1, 9):
        stat_id = item_value.get(f"extra_fixed_stat_id_{i}")
        seed = item_value.get(f"extra_fixed_stat_seed_{i}")

        if not stat_id or stat_id == "None":
            continue

        # get base values
        baseVal = plookup(
            ExtraStatInitLookup, ListID, EXTRA_INIT_KEYS,
            stat_seed=seed, seed_group_id=baseId
        )
        if not baseVal:
            continue

        baseVal_ci = CaseInsensitiveDict({k.lower(): v for k, v in baseVal.items()})
        stat_key = TLStatsLookup.get(stat_id)
        if not stat_key:
            continue

        value = baseVal_ci.get(stat_key)
        if value is None:
            continue

        # initialize stat list
        extraStats[stat_key] = [value]

        # add enchant values per level
        for level in range(1, (maxLevel or 0) + 1):
            enchVal = plookup(
                ExtraStatEnchantLookup, ListID, EXTRA_ENCH_KEYS,
                enchant_level=level, seed_group_id=enchantId
            )
            if not enchVal:
                continue

            enchVal_ci = CaseInsensitiveDict({k.lower(): v for k, v in enchVal.items()})
            ench_amount = enchVal_ci.get(stat_key)
            if ench_amount is None:
                ench_amount = 0

            # append cumulative value
            extraStats[stat_key].append(extraStats[stat_key][0] + ench_amount)

    return extraStats



def getItemStats(ListID, key, value):
    itemStats = {}
    itemStats['grade'] = getEquipGrade(key)
    if itemStats['grade'] is None:
        return itemStats  # skip items without valid grade

    itemStats['traits'] = clearTraits(value.get("trait_group_id"), itemStats['grade'])

    looks = getLooks(key)
    itemStats['icon'] = looks.get("icon")
    itemStats['name'] = looks.get("locaString")

    itemStats['resonance'] = clearResonance(ListID, value.get("trait_resonance_id"))

    itemStats['main'] = clearMainStats(
        ListID,
        value.get("main_stat_base_id"),
        value.get("main_stat_base_seed"),
        value.get("main_stat_enchant_id"),
        value.get("enchant_level_max"),
    )

    itemStats['extra'] = clearExtraStats(
        ListID,
        value,
        value.get("enchant_level_max")
    )

    return itemStats

def makeList(ListID):
    for key, value in TLItemStats[ListID].items():
        itemList[ListID][key] = getItemStats(ListID, key, value)

# =========
# Build lookups & run
# =========

makeTLStatsLookup()
build_trait_lookups()
build_resonance_lookups()
build_mainstat_lookups()
build_extrastat_lookups()

# Build NC first
makeList('NC')

# Start AGS as NC fallback, then override AGS entries
itemList['AGS'] = itemList['NC'].copy()
makeList('AGS')

# =========
# Save
# =========

os.makedirs(os.path.dirname(outputNC), exist_ok=True)
with open(outputNC, "w", encoding="utf-8") as f:
    json.dump(itemList['NC'], f, indent=2, ensure_ascii=False)
print(f"itemList table written to {outputNC}")

os.makedirs(os.path.dirname(outputAGS), exist_ok=True)
with open(outputAGS, "w", encoding="utf-8") as f:
    json.dump(itemList['AGS'], f, indent=2, ensure_ascii=False)
print(f"itemList table written to {outputAGS}")