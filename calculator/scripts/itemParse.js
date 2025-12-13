import { ItemStats, fetchGzip } from "./loader.js";

const lists = await ItemStats()

const lookup =  JSON.parse(await fetchGzip('sources/TLStats.helper'));

console.log(lookup["kMagicDollHealModifier"])  

function mergeStats(objA, objB) {
    const result = {};

    // Collect all keys from both objects
    const allKeys = new Set([...Object.keys(objA), ...Object.keys(objB)]);

    for (const key of allKeys) {
        const aVal = objA[key] ?? 0;
        const bVal = objB[key] ?? 0;

        if (typeof aVal === "number" && typeof bVal === "number") {
            result[key] = aVal + bVal;
        } else {
            result[key] = aVal !== 0 && aVal !== undefined ? aVal : bVal;
        }
    }
    return result;
}

function getMaxLevel(item) {
    return lists.TLItemStats[item].enchant_level_max
}

export function getMainStats(item) {
    const baseID = lists.TLItemStats[item].main_stat_base_id
    const baseSeed = lists.TLItemStats[item].main_stat_base_seed
    const enchantID = lists.TLItemStats[item].main_stat_enchant_id
    
    const mainStat = lists.TLItemMainStatInit[`${baseID}:${baseSeed}`]
    const mainMax = lists.TLItemMainStatEnchant[`${enchantID}:${getMaxLevel(item)}`]
    return  mergeStats(mainStat, mainMax)
}

//console.log(lists)
//console.log(getMaxLevel("feet_fabric_aa_t2_set_002"))
//console.log(getMainStats("feet_fabric_aa_t2_set_002"))