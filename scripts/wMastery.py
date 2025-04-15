import json

# get file
try:
    wSpecLevel = json.load(open('sources/TLWeaponSpecializationLevel.json'))[0]['Rows']
except FileNotFoundError:
    wSpecLevel = {}  # TODO or [], depending on the data


markdown = "# Mastery\n\n## Level\n\n"
headers = ['Level', 'Threshold']
markdown += "| " + " | ".join(headers) + " |\n"
markdown += "| " + " | ".join(['-' * len(h) for h in headers]) + " |\n"

for row in wSpecLevel.items():
    markdown += "| " + str(row[1]['Name']) + " | " + str(row[1]['point_threshold']) + " |\n"
markdown += "\n\nsources/TLWeaponSpecializationLevel.json"

with open("docs/calc/wmastery.md", "w") as f:
    f.write(markdown)

print("success")