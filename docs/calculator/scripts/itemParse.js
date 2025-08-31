import { ItemStats } from "./loader.js";

const lists = await ItemStats()

function getMaxLevel(item) {
    return lists.TLItemStats[item].enchant_level_max
}

function getMainStats(item) {
    const baseID = lists.TLItemStats[item].main_stat_base_id
    const baseSeed = lists.TLItemStats[item].main_stat_base_seed
    const enchantID = lists.TLItemStats[item].main_stat_enchant_id
}

console.log(lists)
console.log(getMaxLevel("feet_fabric_aa_t2_set_002"))