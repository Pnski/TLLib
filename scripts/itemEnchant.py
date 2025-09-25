from _utils import sidebarjson, loadFile, writeMarkdown

EnchantTransferId = {
    'kWeapon' : 'Weapon_TRN_Normal',
    'kArmor' : 'Chest_TRN_Normal',
    'kAccessory' : 'Necklace_TRN_Normal'
}

outputDir = 'docs/items/'

def returnLevels(key, EnchantEntities, TLItemEnchantProbability, TLItemEnchantTransfer):#.get("EnchantEntities"), value.get("EnchantPointOverRatios")
    keySplit = key.split('_')
    itemGrades = TLItemEnchantTransfer.get(EnchantTransferId[keySplit[0]]).get("ItemGradeEntities")

    def getGrade(itemGrades):
        for grade in itemGrades:
            if grade.get("ItemGrade").split("::")[-1] == keySplit[-1]:
                return grade.get("EnchantLevelEntities")
    EnchantTransferLevel = getGrade(itemGrades)
    for level in EnchantEntities.get("EnchantEntities"):
        gold = level.get("Gold")
        EnchantProbablityId = level.get("ItemEnchantProbabilityId")
        print(TLItemEnchantProbability[EnchantProbablityId])
    return [0,0]

def itemEnchant():
    itemEnchantLevel = {}
    TLItemEnchantProbability = loadFile('sources/TLItemEnchantProbability')
    TLItemEnchant = loadFile('sources/TLItemEnchant')
    TLItemEnchantTransfer = loadFile('sources/TLItemEnchantTransfer')

    i = 0
    for key, value in TLItemEnchant.items():
        itemEnchantLevel[i] = {
            'Category': key,
            'maxLevel': value.get("EnchantMaxLevel"),
            'ResourceItem': 0,
            'itemEnchantProb': 0,
            'level': returnLevels(key, value, TLItemEnchantProbability, TLItemEnchantTransfer)
        }
        i += 1

    outputName = 'Level.md'
    output = outputDir + outputName 

    writeMarkdown( output, "Fishing Level",
    {
        'cat1': "Basics",
        'sub1': "Fishing"
    }, itemEnchantLevel)

itemEnchant()
