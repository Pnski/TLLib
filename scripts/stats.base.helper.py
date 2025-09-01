import json
import os

def loadFile(filepath):
    try:
        with open(filepath, encoding="utf-8") as f:
            return json.load(f)[0]['Rows']
    except FileNotFoundError:
        return {}

source = 'sources/TLBaseMainStat'
output = 'sources/TLBaseMainStat.helper'

# Load raw stats
stats = loadFile(source)

# Build a cleaned structure:
# {
#   "EPcStatsType::kSTR": {
#       "AttackPowers.NoneAttackPower": [{ "x": point, "y": value }, ...],
#       ...
#   },
#   ...
# }
cleaned = {}

for _, entry in stats.items():
    chart_type = entry.get("Type")
    point = entry.get("Point")
    stat_block = entry.get("Stat", {})

    if chart_type not in cleaned:
        cleaned[chart_type] = {}

    for statName, val in stat_block.items():
        if isinstance(val, dict):
            for nested, num in val.items():
                if num != 0:  # drop all zero
                    key = f"{statName}.{nested}"
                    cleaned[chart_type].setdefault(key, []).append({"x": point, "y": num})
        else:
            if val != 0:
                key = statName
                cleaned[chart_type].setdefault(key, []).append({"x": point, "y": val})

# Save preprocessed JSON
os.makedirs(os.path.dirname(output), exist_ok=True)
with open(output, "w", encoding="utf-8") as f:
    json.dump(cleaned, f, ensure_ascii=False)

print(f"Helper written to {output}")