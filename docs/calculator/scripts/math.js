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

function calcDmgMin(SkillBaseDamage, SkillBonusBaseDamage, WeaponMin) {
    return ( (WeaponMin + (SkillBonusBaseDamage  / SkillBaseDamage )) * SkillBaseDamage)
}

function calcDmgMax(SkillBaseDamage, SkillBonusBaseDamage, WeaponMax) {
    return ( (WeaponMax + (SkillBonusBaseDamage / SkillBaseDamage)) * SkillBaseDamage )
}

function calcDmgMaxCrit(SkillBaseDamage, SkillBonusBaseDamage, WeaponMax, CriticalDamage) {
    return calcDmgMax(SkillBaseDamage, SkillBonusBaseDamage, WeaponMax)*(1+CriticalDamage)
}

function calcDmgAvg(SkillBaseDamage, SkillBonusBaseDamage, WeaponMin, WeaponMax, CriticalDamage, CriticalHit) {
    return (calcDmgMin(SkillBaseDamage, SkillBonusBaseDamage, WeaponMin) + calcDmgMax(SkillBaseDamage, SkillBonusBaseDamage, WeaponMax))/2*(1-AttackModChance(CriticalHit))+calcDmgMaxCrit(SkillBaseDamage, SkillBonusBaseDamage, WeaponMax, CriticalDamage)*AttackModChance(CriticalHit)
}

export function Damage_AVG(SkillBaseDamage, SkillBonusBaseDamage, WeaponMin, WeaponMax, CriticalDamage, CriticalHit, SDB, SDB_Species, HeavyHit, BonusDamage) {
    return calcDmgAvg(SkillBaseDamage, SkillBonusBaseDamage, WeaponMin, WeaponMax, CriticalDamage,CriticalHit)*skillDamageBoost(SDB)*skillDamageBoost(SDB_Species)*AttackModChance(HeavyHit)+BonusDamage
}

export function Damage_Max(SkillBaseDamage, SkillBonusBaseDamage, WeaponMin, WeaponMax, CriticalDamage, CriticalHit, SDB, SDB_Species, HeavyHit, BonusDamage) {
    return calcDmgMaxCrit(SkillBaseDamage, SkillBonusBaseDamage, WeaponMax, CriticalDamage) * skillDamageBoost(SDB) * skillDamageBoost(SDB_Species) + BonusDamage
}

/* 

TestSection

*/


const skillbasedmg = 160 / 100
const skillbonusdmg = 25
const minweapon = 97
const maxweapon = 360
const crithit = 2013
const heavyhit = 816
const mysdb = 529
const mysdbsp = 0
const bonusd = 65
const critdmg = 46.80 / 100
console.log(AttackModChance(crithit))

console.log(calcDmgMin(skillbasedmg, skillbonusdmg, minweapon))
console.log(calcDmgMax(skillbasedmg, skillbonusdmg, maxweapon))
console.log(calcDmgMaxCrit(skillbasedmg, skillbonusdmg, maxweapon, critdmg))
console.log(calcDmgAvg(skillbasedmg, skillbonusdmg,minweapon, maxweapon, critdmg, crithit))
console.log(Damage_AVG(skillbasedmg, skillbonusdmg,minweapon, maxweapon, critdmg, crithit, mysdb, mysdbsp, heavyhit, bonusd))
console.log(Damage_Max(skillbasedmg, skillbonusdmg,minweapon, maxweapon, critdmg, crithit, mysdb, mysdbsp, heavyhit, bonusd))