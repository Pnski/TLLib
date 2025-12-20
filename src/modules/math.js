/**
 * Throne and Liberty Damage & Healing Math Engine
 */

// --- Core Curves ---
// Standard 1000 base for Damage, Crit, Heavy, and SDB
export const getChance = (rate) => (!rate || rate < 0) ? 0 : rate / (rate + 1000);

// Specific 3000 base for Healing Crit/Heavy chances ("1/3 effectiveness")
export const getHealChance = (rate) => (!rate || rate < 0) ? 0 : rate / (rate + 3000);

// Multiplier for SDB/SSDB (Always 1000 base as per user)
export const getDrMultiplier = (v) => 1 + getChance(v);

// Mitigation (1 / (1 + Def/2700))
export const getDefenseMitigation = (def) => 1 / (1 + (def || 0) / 2700);

// Base calculation: (Weapon * Skill% / 100) + Flat
export const calcSkillBase = (per, flat, weapon) => (weapon * (per / 100)) + (flat || 0);

/**
 * The Universal Engine
 * @param {string} mode - 'dmg', 'dot', 'heal', 'hot'
 */
function calculate(base, p, isCrit, isHeavy, mode) {
    let val = base;

    // 1. Critical Multiplier
    if (isCrit) val *= (1 + (p.critDamage / 100));

    // 2. Multipliers
    const curseMult = (1 + (p.curse || 0) / 100);
    const sdbMult = getDrMultiplier(p.sdb) * getDrMultiplier(p.ssdb);

    if (mode === 'heal' || mode === 'hot') {
        val *= curseMult;
        val *= sdbMult;
    } else {
        // Damage (Direct or Dot)
        val *= (1 + (p.monsterDmg || 0) / 100);
        val *= (1 + (p.dmgBuff1 || 0) / 100);
        val *= (1 + (p.dmgBuff2 || 0) / 100);
        val *= sdbMult;
        
        // Dot gets curse/heal% bonus too
        if (mode === 'dot') val *= curseMult;

        val *= getDefenseMitigation(p.defense);
    }

    // 3. Heavy Attack
    if (isHeavy) val *= 2;

    // 4. Bonus Damage (Flat)
    return val;
}

// --- Exported UI Helpers ---

// Direct Damage
export const calcMinDmg = (p) => calculate(calcSkillBase(p.skillPer, p.skillFlat, p.minDmg), p, false, false, 'dmg')+ (p.bonusDmg || 0);
export const calcMaxCrit = (p) => calculate(calcSkillBase(p.skillPer, p.skillFlat, p.maxDmg), p, true, false, 'dmg')+ (p.bonusDmg || 0);
export function calcAvgSkillDmg(p) {
    const avgWep = (p.minDmg + p.maxDmg) / 2;
    const norm = calculate(calcSkillBase(p.skillPer, p.skillFlat, avgWep), p, false, false, 'dmg');
    const crit = calculate(calcSkillBase(p.skillPer, p.skillFlat, p.maxDmg), p, true, false, 'dmg');
    const cChance = getChance(p.critHit);
    const hChance = getChance(p.heavyHit);
    const avgNonHeavy = (norm * (1 - cChance)) + (crit * cChance);
    const hitOnly = avgNonHeavy;
    return avgNonHeavy + (hitOnly * hChance) + (p.bonusDmg || 0);
}

// DoT (Damage over Time)
export const calcMinDot = (p) => calculate(calcSkillBase(p.skillPer, p.skillFlat, (p.minDmg + p.maxDmg) / 2), p, false, false, 'dot');
export const calcMaxCritDot = (p) => calculate(calcSkillBase(p.skillPer, p.skillFlat, (p.minDmg + p.maxDmg) / 2), p, true, false, 'dot');
export function calcAvgDotDmg(p) {
    const avgWep = (p.minDmg + p.maxDmg) / 2;
    const norm = calculate(calcSkillBase(p.skillPer, p.skillFlat, avgWep), p, false, false, 'dot');
    const crit = calculate(calcSkillBase(p.skillPer, p.skillFlat, avgWep), p, true, false, 'dot');
    const cChance = getChance(p.critHit);
    const hChance = getChance(p.heavyHit);
    const avgNonHeavy = (norm * (1 - cChance)) + (crit * cChance);
    const hitOnly = avgNonHeavy - ( 0);
    return avgNonHeavy + (hitOnly * hChance);
}

// Direct Healing
export const calcMinHeal = (p) => calculate(calcSkillBase(p.skillPer, p.skillFlat, p.minDmg), p, false, false, 'heal');
export const calcMaxCritHeal = (p) => calculate(calcSkillBase(p.skillPer, p.skillFlat, p.maxDmg), p, true, false, 'heal');
export function calcAvgHeal(p) {
    const avgWep = (p.minDmg + p.maxDmg) / 2;
    const norm = calculate(calcSkillBase(p.skillPer, p.skillFlat, avgWep), p, false, false, 'heal');
    const crit = calculate(calcSkillBase(p.skillPer, p.skillFlat, p.maxDmg), p, true, false, 'heal');
    const cChance = getHealChance(p.critHit);
    const hChance = getHealChance(p.heavyHit);
    const avgNonHeavy = (norm * (1 - cChance)) + (crit * cChance);
    const hitOnly = avgNonHeavy - (0);
    return avgNonHeavy + (hitOnly * hChance);
}

// HoT (Heal over Time)
export const calcMinHot = (p) => calculate(calcSkillBase(p.skillPer, p.skillFlat, (p.minDmg + p.maxDmg) / 2), p, false, false, 'hot');
export const calcMaxCritHot = (p) => calculate(calcSkillBase(p.skillPer, p.skillFlat, (p.minDmg + p.maxDmg) / 2), p, true, false, 'hot');
export function calcAvgHot(p) {
    const avgWep = (p.minDmg + p.maxDmg) / 2;
    const norm = calculate(calcSkillBase(p.skillPer, p.skillFlat, avgWep), p, false, false, 'hot');
    const crit = calculate(calcSkillBase(p.skillPer, p.skillFlat, avgWep), p, true, false, 'hot');
    const cChance = getHealChance(p.critHit);
    const hChance = getHealChance(p.heavyHit);
    const avgNonHeavy = (norm * (1 - cChance)) + (crit * cChance);
    const hitOnly = avgNonHeavy - (0);
    return avgNonHeavy + (hitOnly * hChance);
}