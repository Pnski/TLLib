import json
import os

from _utils import sidebarjson, loadFile

output = 'sources/TLRunes.helper'

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