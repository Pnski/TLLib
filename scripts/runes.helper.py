import json
import os

output = 'sources/TLRunes.helper'

def loadFile(filepath):
    try:
        return json.load(open(filepath, encoding="utf-8"))[0]['Rows']
    except FileNotFoundError:
        return {}

# =========
# Load all data
# =========

TLItemRandomStatGroup = loadFile('sources/TLItemRandomStatGroup')  # TraitResonance #runes

TLRuneSocket = loadFile('sources/TLRuneSocket')
TLRuneSynergy = loadFile('sources/TLRuneSynergy')
TLRuneInfo = loadFile('sources/TLRuneInfo')

# =========
# Save
# =========

os.makedirs(os.path.dirname(outputNC), exist_ok=True)
with open(output, "w", encoding="utf-8") as f:
    json.dump(runesList, f, indent=2, ensure_ascii=False)
print(f"itemList table written to {output}")