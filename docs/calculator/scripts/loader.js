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
    /* 
        Prefilter skillLevel > 15
    */
    const skillsParameter = json[0].Rows;

    for (const [skillName, skillData] of Object.entries(skillsParameter)) {
        if ("FormulaParameter" in skillData) {
            // Filter to only entries with skill_level <= 15
            const filteredEntries = skillData.FormulaParameter.filter(
                fp => (fp.skill_level ?? 0) <= 15
            );

            if (filteredEntries.length > 0) {
                // Keep only the entry with the highest skill_level
                const bestEntry = filteredEntries.reduce((max, fp) =>
                    (fp.skill_level ?? 0) > (max.skill_level ?? 0) ? fp : max
                );
                skillData.FormulaParameter = [bestEntry];
            } else {
                // No valid entries, clear the list
                skillData.FormulaParameter = [];
                console.log(`No valid skill_levels <= 15 found for ${skillName}, clearing FormulaParameter`);
            }
        }
    }

    return skillsParameter;
}

/* 
loading TLSkills
contains
  "UID": 947759200,
        "skill_category": "ESkillCategory::kSkill",
        "damage_type": "ETLDamageType::kRange",
        "skill_delay": 1.5,
        "hit_delay": 0.0,
        "skill_propensity": "ETLSkillPropensity::kBeneficial",
        "skill_target_relation": "ETLSkillTargetRelation::kFriendly",
        "skill_target_living_status": "ETLSkillTargetLivingStatus::kAlive",
        "skill_target_object_type": [
          "ETLSkillTargetObjectType::kPC",
          "ETLSkillTargetObjectType::kNPC",
          "ETLSkillTargetObjectType::kFO",
          "ETLSkillTargetObjectType::kCarrier"
        ],
        "min_charge_delay": 0,
        "max_charge_delay": 0,
        "max_charge_hold_delay_ms": 0,
*/
export async function SkillsData() {
    const path = 'sources/TLSkill'
    const response = await fetch(path + '.json')
    const json = await response.json();
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
"UIName": {
    "TableId": "/Game/Game/Client/Table/TLStringSkillDesc_Weapon_Staff.TLStringSkillDesc_Weapon_Staff",
    "Key": "TEXT_NAME_SkillSet_WP_ST_S_AoeTeleport_trait_1",
    "SourceString": "작열 연막진",
    "LocalizedString": "Burning Smokescreen"
    },
"IconPath": {
    "AssetPathName": "/Game/Image/Skill/Specialization/SP_COMMON033.SP_COMMON033",
    "SubPathString": ""
    },
*/

export async function SkillLooks(weapon) {
    const basePath = 'sources/Skills/TLSkillPcLooks_Weapon_';
    const response = await fetch(basePath + weapon + ".json");
    const json = await response.json();

    // Extract only IconPath and UIName from each row
    const filteredRows = {};

    for (const [rowName, rowData] of Object.entries(json[0]["Rows"])) {
        filteredRows[rowName] = {
            IconPath: rowData.IconPath,
            UIName: rowData.UIName
        };
    }

    return filteredRows;
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