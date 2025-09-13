from _utils import sidebarjson, loadFile, writeMarkdown

outputDir = 'docs/weapon/'

def weaponSpecialization():
    weaponLevel = {}
    TLWeaponSpecializationLevel = loadFile('sources/TLWeaponSpecializationLevel')
    i = 0
    for key, value in TLWeaponSpecializationLevel.items():
        weaponLevel[i] = {
            'Name': value.get("Name"),
            'Level': value.get("level"),
            'expNext': value.get("point_threshold") - weaponLevel.get(i-1,{}).get("TotalExp",0),
            'TotalExp': value.get("point_threshold"),
        }
        i += 1

    outputName = 'mLevel.md'
    output = outputDir + outputName

    writeMarkdown( output, "Weapon Mastery Level",
    {
        'cat1': "Basics",
        'sub1': "Weapon"
    }, weaponLevel)

weaponSpecialization()