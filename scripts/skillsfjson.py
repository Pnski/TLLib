import os
import json

directory = 'E:\\Github\\TLLib\\docs\\Images\\Active'
jsonFile = 'D:\\TLSKill.json'

def process_filenames():
    # Read filenames and process them
    filenames = [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f))]
    processed_filenames = [f[8:].rsplit('.', 1)[0] for f in filenames]

    # Load JSON data
    with open(jsonFile, 'r') as file:
        json_data = json.load(file)

    if isinstance(json_data, list) and 'Rows' in json_data[0]:
        json_data = json_data[0]['Rows']

    matches = []
    for filename in filenames:
        for key, value in json_data.items():
            if key.startswith('WP') and filename[8:].rsplit('.', 1)[0] in key:
                matches.append(f"| <img src=\"../images/Active/{filename}\"> | {key} | {value.get('damage_type', 'N/A')} |")
    #<img src="./Item_128/Usable/abyss_point_charge_001_1_A.png">


    output_file='dmgType.md'
    
    with open(output_file, 'w') as file:
        file.write("| Ico | Name | DamageType |\n")
        file.write("| --- | --- | --- |\n")
        file.write('\n'.join(matches) + '\n')

process_filenames()