import { XMLParser } from 'https://cdn.jsdelivr.net/npm/fast-xml-parser@5.2.5/+esm';

/* 
loading skillOptionalDataForPc
contains
  "skill_level": 15,
  "formula_type": "EFormulaType::kAmountFromAttackPower",
  "min": 0,
  "max": 0,
  "add": 19,
  "mul": 6020,
  "mul2": 0,
  "mul3": 0,
  "dynamic_stat_id1": "DA_Mastery_Hero_Attack_DynamicStat",
  "dynamic_stat_id2": "DA_Mastery_Rare_Tactics_DynamicStat_Debuff",
  "dynamic_stat_id3": "None",
  "dynamic_stat_id4": "None",
  "tooltip1": 60.2,
  "tooltip2": 19.0
*/
export async function FormulaParameter() {
    const path = 'sources/TLFormulaParameterNew'
    const response = await fetch(path + '.json')
    const json = await response.json();
    return json[0]["Rows"]
}

/* 
loading skillOptionalDataForPc
contains
  "skill_category": "ESkillCategory::kSkill",
  "skill_delay": 1.5,
  "hit_delay": 0.0,
  "min_charge_delay": 0,
  "max_charge_delay": 0,
  "max_charge_hold_delay_ms": 0,
  "damage_type": "ETLDamageType::kRange",
  "skill_target_object_type": [
    "ETLSkillTargetObjectType::kPC",
    "ETLSkillTargetObjectType::kNPC",
    "ETLSkillTargetObjectType::kFO",
    "ETLSkillTargetObjectType::kCarrier"
  ],
*/
export async function SkillsData() {
    const path = 'sources/TLSkill'
    const response = await fetch(path + '.json')
    const json = await response.json();

    /* 
    Prefilter skillLevel > 15
    */

    return json[0]["Rows"]
}

/* 
loading skillOptionalDataForPc
contains
  "cost_consumption": "Common_Constant_0",
  "hp_consumption": "Common_Constant_0",
  "cooldown_time": "Common_Constant_5000",
  "cooldown_group": "ECooldownGroup::kHeroTemporary_094",
  "skill_for_boss": "None",
  "skill_for_move_key": "None",
  "skill_for_friendly_target": "None",
  "stamina_consumption": "Common_Constant_0"
*/
export async function SkillOptionalData() {
    const path = 'sources/TLSkillOptionalDataForPc'
    const response = await fetch(path + '.json')
    const json = await response.json();
    return json[0]["Rows"]
}

/* 

*/

export async function SkillLooks(weapon) {
    const basePath = 'sources/Skills/TLSkillPcLooks_Weapon_';
    const response = await fetch(basePath + weapon + ".json");
    const json = await response.json();
    return json[0]["Rows"];
}

/* 
loadSkillList
after exporting with fmodel files are as .json, in it is xml data, with wapon_ we get the most usefull list to sort for actives, passives AA and block
*/

export async function SkillList(weapon) {
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: ""
    };

    const basePath = './sources/Skills/xml/Weapon_';
    const response = await fetch(basePath + weapon + '.json');
    const text = await response.text();
    const parser = new XMLParser(options);
    const result = parser.parse(text);

    let filtered = [];

    try {
        const skillList = result["hero_skill_set"]["skill_complex_list"]["skill_complex"];

        // Ensure skillList is an array
        const list = Array.isArray(skillList) ? skillList : [skillList];

        // Combined filters
        filtered = list.filter(s =>
            s?.skill_type === "kActiveSkill" &&
            s?.is_basic_attack === "false" &&
            s?.skill_slot_affinity !== "kDefenseAction"
        );

    } catch (error) {
        console.error("Error in loadSkillList:", error);
    }

    return filtered;
}