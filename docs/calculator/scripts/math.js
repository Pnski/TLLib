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

function AttackModChance(AttackRate) {
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

export function calcSkillDmg(SkillBaseDamage, SkillBonusDamage, WeaponDmg, SDB, BonusDamage, SDB_Species,  CritHit = 0) {
    return calcSkillDmgBase(SkillBaseDamage, SkillBonusDamage, WeaponDmg) * skillDamageBoost(SDB) * skillDamageBoost(SDB_Species) * (1+AttackModChance(CritHit)) + BonusDamage
}


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