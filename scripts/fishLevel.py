import json

#file

file = 'sources/TLFishingLevel.json'

# get file
try:
    wSpecLevel = json.load(open(file, encoding="utf-8"))[0]['Rows']
except FileNotFoundError:
    wSpecLevel = {}  # TODO or [], depending on the data


markdown = "# Fishing\n\n## Habitat\n\n"
headers = ['Level','LocalizedString', 'LevelExpThreshold']
markdown += "| " + " | ".join(headers) + " |\n"
markdown += "| " + " | ".join(['-' * len(h) for h in headers]) + " |\n"

for row in wSpecLevel.items():
    title = row[1]['Title'].get('LocalizedString', '[missing]')
    markdown += "| " + str(row[1]['Level']) + " | " + title + " | " + str(row[1]['LevelExpThreshold']) + " |\n"

markdown += "\n\n" + file

with open("docs/calc/fishLevel.md", "w") as f:
    f.write(markdown)

print("success")