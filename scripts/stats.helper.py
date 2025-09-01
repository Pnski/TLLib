import json
import os

def loadFile(filepath):
    try:
        return json.load(open(filepath, encoding="utf-8"))[0]['Rows']
    except FileNotFoundError:
        return {}

source = 'sources/TLStats'
output = 'sources/TLStats.helper'

# Load your stats JSON
stats = loadFile(source)

# Build the lookup table
lookup = {}
for key, value in stats.items():
    stat_enum = value.get("stat_enum", "")
    if stat_enum.startswith("EItemStats::"):
        # Strip "EItemStats::" and use just the kName part
        short_name = stat_enum.split("::", 1)[1]
        lookup[short_name] = key

# Save lookup table as JSON
os.makedirs(os.path.dirname(output), exist_ok=True)
with open(output, "w", encoding="utf-8") as f:
    json.dump(lookup, f, indent=2, ensure_ascii=False)

print(f"Lookup table written to {output}")