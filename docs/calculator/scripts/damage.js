/* 
Skill Damage Boost Diminishing Returns Formula:
SDB / (SDB + 1000) * 100
Skill Damage Boost Formula for Healing (Diminishing Returns):
SDB / (SDB + 3000) * 100
*/

function skillDamageBoost(SDB) {
    return SDB / (SDB + 1000) * 100
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
    return ((AttackRate) / (AttackRate + 1000)) * 100
}

export function getCooldown(CooldownTime, CDR) {
    return CooldownTime * cdrMod(CDR)
}


export function Damage_AVG(BaseDamage, BonusDamage, MinDamage, MaxDamage) {
    return 0
}

export function Damage_Max(BaseDamage, BonusDamage, MaxDamage) {
    return 0
}