import os
import sys
import json
import xmltodict

iDir = "sources/Skills/xml"
oDir = "sources/Skills/cJson"

os.makedirs(oDir, exist_ok=True)

for fileName in os.listdir(iDir):
    iPath = os.path.join(iDir, fileName)
    oPath = os.path.join(oDir, fileName.replace('.json', ''))
    try:
        with open(iPath, 'r', encoding='utf-8') as f:
            xmlContent = f.read()
            data = xmltodict.parse(xmlContent, attr_prefix='',process_namespaces=True)
            try:
                skill_list = data["hero_skill_set"]["skill_complex_list"]["skill_complex"]

                # Ensure it's a list (can sometimes be a single dict)
                if isinstance(skill_list, dict):
                    skill_list = [skill_list]

                # Filter
                filtered = [s for s in skill_list if s.get("skill_type") == "kActiveSkill"]
                filtered = [s for s in filtered if s.get("is_basic_attack") == "false"]
                filtered = [s for s in filtered if s.get("skill_slot_affinity") != "kDefenseAction"]

                # Overwrite the original list with the filtered one
                data = filtered

            except KeyError:
                print(f"⚠️ Warning: 'skill_complex' structure not found in {filename}")
        with open(oPath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False)
    except Exception as e:
        print(f"Error: {e}")