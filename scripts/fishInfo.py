import json

#file

file = 'sources/TLFishingFishInfo.json'

# get file
try:
    wSpecLevel = json.load(open(file, encoding="utf-8"))[0]['Rows']
except FileNotFoundError:
    wSpecLevel = {}  # TODO or [], depending on the data


markdown = "# Fishing\n\n## Level\n\n"
headers = ['FishName','Level', 'HabitatList']
markdown += "| " + " | ".join(headers) + " |\n"
markdown += "| " + " | ".join(['-' * len(h) for h in headers]) + " |\n"

for row in wSpecLevel.items():
    title = row[1]['FishName'].get('LocalizedString', '[missing]')
    lvl = str(row[1]['Level'])
    habitats = [h['Key'] for h in row[1].get('HabitatInfo', {}).get('HabitatList', [])]
    habitat_str = ", ".join(habitats)
    markdown += f"| {title} | {lvl} | {habitat_str} |\n"

markdown += "\n\n" + file

with open("docs/calc/fishInfo.md", "w") as f:
    f.write(markdown)

print("success")