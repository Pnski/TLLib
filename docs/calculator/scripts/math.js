/* 
Skill Damage Boost Diminishing Returns Formula:
SDB / (SDB + 1000) * 100
Skill Damage Boost Formula for Healing (Diminishing Returns):
SDB / (SDB + 3000) * 100
*/

function skillDamageBoost(SDB) {
    return 1 + SDB / (SDB + 1000)
}

/* 
Buff Duration Formula:
Duration of your skill's buff ( 1 + Buff duration)
 */

function buffDuration(buffD) {
    return 0
}

/* 
Cooldown Speed to Cooldown Reduction Formula:
1 - (1 / (1 + Cooldown Speed %))
51.1 -> 0.661 (-0.338)
-> CD = (return)*CD_Skill
*/

function cdrMod(CDR) {
    return (1 / (1 + (CDR/100)))
}

/* 
Heavy Attack Chance Formula:
Heavy Attack Chance = ((Heavy Attack) / (Heavy Attack + 1,000)) × 100%
-> same for critical
*/

export function AttackModChance(AttackRate) {
    return ((AttackRate) / (AttackRate + 1000))
}

/* 
    Cooldown in ms * current cooldown / 1000 -> CD in S
*/

export function getCooldown(CooldownTime, CDR) {
    return CooldownTime * cdrMod(CDR) / 1000
}

/* 
(maxChargeTime + skill_delay in s + hit_delay in s) * current weapon atk-speed in s = skill lock
*/

export function getAnimLock(skillDelay, hitDelay, wSpeed, maxChargeTime = 0) {
    return (maxChargeTime + skillDelay + hitDelay) * wSpeed
}

function calcSkillDmgBase(SkillBaseDamage, SkillBonusDamage, WeaponDmg) {
    return ((SkillBaseDamage / 100 * WeaponDmg) + SkillBonusDamage)
}

/**
 * 
 * @param {*} SkillBaseDamage 
 * @param {*} SkillBonusDamage 
 * @param {*} WeaponDmg 
 * @param {*} SDB 
 * @param {*} BonusDamage 
 * @param {*} SDB_Species 
 * @param {*} CritHit 
 * @returns 
 */
export function calcSkillDmg(SkillBaseDamage, SkillBonusDamage, WeaponDmg, SDB, BonusDamage, SDB_Species, CritDmg = 0) {
    return calcSkillDmgBase(SkillBaseDamage, SkillBonusDamage, WeaponDmg) * skillDamageBoost(SDB) * skillDamageBoost(SDB_Species) * (1+(CritDmg / 100)) + BonusDamage
}

export function calcAvgSkillDmg(SkillBaseDamage, SkillBonusDamage, WeaponDmg, SDB, BonusDamage, SDB_Species,  CritDmg = 0, critHit, heavyHit) {
    const maxCritDmg = calcSkillDmg(SkillBaseDamage, SkillBonusDamage, WeaponDmg.Max, SDB, BonusDamage, SDB_Species, CritDmg)
    const avgDmgNonCrit = calcSkillDmg(SkillBaseDamage, SkillBonusDamage, ((WeaponDmg.Min + WeaponDmg.Max) / 2), SDB, BonusDamage, SDB_Species, 0)
    const avgDmgNonHeavy = (avgDmgNonCrit * (1 - AttackModChance(critHit)) + maxCritDmg * AttackModChance(critHit))
    const avgDmg = (avgDmgNonHeavy * (1 - AttackModChance(heavyHit))) + (avgDmgNonHeavy * 2 * AttackModChance(heavyHit))
    return avgDmg
}

export function calcDotDmg(SkillBaseDamage, SkillBonusDamage, WeaponDmg, SDB, SDB_Species, CritDmg = 0) {
    return calcSkillDmgBase(SkillBaseDamage, SkillBonusDamage, (WeaponDmg.Min + WeaponDmg.Max)/2) * skillDamageBoost(SDB) * skillDamageBoost(SDB_Species) * (1+(CritDmg / 100))
}

export function calcAvgDotDmg(SkillBaseDamage, SkillBonusDamage, WeaponDmg, SDB, SDB_Species, CritDmg = 0, critHit, heavyHit, curse) {
    const maxCritDmg = calcDotDmg(SkillBaseDamage, SkillBonusDamage, WeaponDmg, SDB, SDB_Species, CritDmg) * (1+(curse/100))
    const avgDmgNonCrit = calcDotDmg(SkillBaseDamage, SkillBonusDamage, WeaponDmg, SDB, SDB_Species, 0) * (1+(curse/100))
    const avgDmgNonHeavy = (avgDmgNonCrit * (1 - AttackModChance(critHit)) + maxCritDmg * AttackModChance(critHit))
    const avgDmg = (avgDmgNonHeavy * (1 - AttackModChance(heavyHit))) + (avgDmgNonHeavy * 2 * AttackModChance(heavyHit))
    return avgDmg
}


/* 
          {healing touch
            "skill_level": 15,
            "formula_type": "EFormulaType::kAmountFromAttackPowerWithinMinMax",
            "min": 5000,
            "max": 5000,
            "add": 270000,
            "mul": 34000000,
            "mul2": 0,
            "mul3": 0,
            "dynamic_stat_id1": "HealEffect",
            "dynamic_stat_id2": "ContinuousHealEffect",
            "dynamic_stat_id3": "None",
            "dynamic_stat_id4": "None",
            "tooltip1": 34.0,
            "tooltip2": 27.0
          },
      "WA_Corruption_CD": {touch of despair
        "FormulaParameter": [
          {
            "skill_level": 1,
            "formula_type": "EFormulaType::kAmountFromAttackPowerWithinMinMax",
            "min": 5000,
            "max": 5000,
            "add": 90000,
            "mul": 25000000,
            "mul2": 0,
            "mul3": 0,
            "dynamic_stat_id1": "CurseDamage",
            "dynamic_stat_id2": "None",
            "dynamic_stat_id3": "None",
            "dynamic_stat_id4": "None",
            "tooltip1": 25.0,
            "tooltip2": 9.0
          },
          {swift heal
            "skill_level": 15,
            "formula_type": "EFormulaType::kAmountFromAttackPower",
            "min": 0,
            "max": 0,
            "add": 232,
            "mul": 61000,
            "mul2": 0,
            "mul3": 0,
            "dynamic_stat_id1": "HealEffect",
            "dynamic_stat_id2": "None",
            "dynamic_stat_id3": "None",
            "dynamic_stat_id4": "None",
            "tooltip1": 610.0,
            "tooltip2": 232.0
          },
*/

/**
 * calculate attackspeed
 * (weapon base attack speed - dex attackmod)/(1+(attackspeed mod%/100))
 */


/* 

TestSection

*/
/*

const skillbasedmg = 1122 * 2.2
const skillbonusdmg = 1135* 2.2
const minweapon = 192
const maxweapon = 425
const crithit = 834
const heavyhit = 455.2
const mysdb = 305
const mysdbsp = 76.8
const bonusd = 40
const critdmg = 46.80 / 100

*/

  /* 
{
    kAmountFromMinMax                        = 0, //close to every attack
    kAmountFromHpMax                         = 1, //e.g. TimeBomb, some mob/boss attacks
    kAmountFromCostMax                       = 2, //System_ReviveCostRestore
    kAmountFromAttackRange                   = 3, //Common_AttackRange_3000percent
    kAmountFromDistance                      = 4, //bow? WM_BO_Normal_ATK_DistanceCritical_CriticalChanceUp
    kAmountFromNormalAttackDelay             = 5, //SC_Cooldown_Move no clue
    kAmountFromAttackPower                   = 6, //SW_TauntBuff_Attack_DD
    kAmountFromAttackPowerWithinMinMax       = 7, //curse WA_CurseArea_CD
    kAmountFromAttackPowerWithinMinMaxAndTargetHpMax = 8, //no results
    kAmountFromAttackPowerAndCost            = 9,
    kAmountFromAttackPowerAndTargetHpMax     = 10, //WorldBoss_SkeletonGiantWarrior_DeadPresent_Aura_DD
    kAmountFromDamageReduction               = 11, //SH_BuffAttack_DD
    kAmountFromCostRegen                     = 12, //ST_Passive_03_AdditionalAttack_Rate
    kAmountFromTargetHpMax                   = 13, //Item_Scroll_Hpmax_10p
    kAmountFromTargetHpMaxOrMinValue         = 14,
    kAmountFromTargetHpMaxOrMaxValue         = 15,
    kAmountFromAuraEffectBoost               = 16, //BO_AuraEffectDouble_DoubleAttackUp_By_AuraBoost
    kAmountFromFalling                       = 17, //System_FallingDamage
    kAmountFromAttackPowerForPrimeAttack     = 18, //BO_PrimeAttack_DD
    kAmountFromAttackPowerForPrimeAttackWithinMinMax = 19,
    kAmountFromTargetHpBPWithinLimits        = 20, //BO_PowerShot_CriticalChance_by_TargetHP_Rate / DA_CriticalStrike_CriticalChance_by_TargetHP
    kAmountFromHp                            = 21, //CCG_L03_01_Trap_Damage
    kAmountFromTargetHp                      = 22, //Common_TargetHp_10percent
    kAmountFromUsableCost                    = 23, //WM_CommonSkill_AddManaAttack_AddCost
    kAmountFromConsumptionCost               = 24,
    kAmountFromPassiveHpConsumption          = 25,
    kAmountFromTailWindSpeed                 = 26, //BO_WindBonusProjectile_AdditionalProjectileChance
    kAmountFromWindSpeed                     = 27, //WP_Item_kA_WA_A12_AttackSpeed / WP_Item_kA_SW2_A13_SkillCooldown
    kAmountFromShieldBlockChance             = 28, //SW_DebuffAttack_DoubleAttackUp
    kAmountFromOffHandAttackChance           = 29, //DA_Both_Attack_Rate
    kAmountFromCostChange                    = 30, //"WA_Sleep_Cost"
    EFormulaType_MAX                         = 31,
}; */