import json

# get file
try:
    existing_file = json.load(open('example.json'))
except FileNotFoundError:
    existing_file = {}  # TODO or [], depending on the data

# TODO: do something with existing_file
existing_file["foo"] = "bar"  # or existing_file.append("foo"), depending on the data
# write file
with open('example.json', 'w') as outfile:
  outfile.write(json.dumps(existing_file))