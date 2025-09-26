from _utils import sidebarjson, loadFile, writeMarkdown

gradesList = ['kC', 'kB', 'kA', 'kAA', 'kA2', 'kAA2', 'kAA3', 'kAAA', 'kS']

EnchantTransferId = {
    'kWeapon' : 'Weapon_TRN_Normal',
    'kArmor' : 'Chest_TRN_Normal',
    'kAccessory' : 'Necklace_TRN_Normal'
}

outputDir = 'docs/items/'

def returnLevels(key, EnchantEntities, TLItemEnchantProbability, TLItemEnchantTransfer):#.get("EnchantEntities"), value.get("EnchantPointOverRatios")
    keySplit = key.split('_')
    
    def getGrade(lowerGrade):
        for grade in TLItemEnchantTransfer.get(EnchantTransferId.get(keySplit[0]),{}).get("ItemGradeEntities",{}):
            if grade.get("ItemGrade").split("::")[-1] == lowerGrade:
                return grade.get("EnchantLevelEntities")
    try:
        lowerItem = getGrade(gradesList[gradesList.index(keySplit[1])-1])[-1].get("AccumulatedPoint")
        #if this success we have the item with 1 lower grade to fill the exp to the next weapon
        print(lowerItem)
    except:
        print("not in list")

    levelValues = []

    for eLevel in EnchantEntities.get("EnchantEntities"):
        EnchantProbablityId = eLevel.get("ItemEnchantProbabilityId")
        avgEnchantPointPercentage = 0
        for value in TLItemEnchantProbability[EnchantProbablityId].get("EnchantResult"):
            avgEnchantPointPercentage += value.get("EnchantPoint")*value.get("Probability")/10000
        avgClicks = int(100/avgEnchantPointPercentage) + (100 % avgEnchantPointPercentage > 0)
        avgSollant = eLevel.get("Gold") * avgClicks
        avgUpgradeMaterial = eLevel.get("ResourceItems",[])[0].get("Quantity") * avgClicks
        
        levelValues.append([avgSollant, avgUpgradeMaterial])
    return levelValues

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
            'level': returnLevels(key, value, TLItemEnchantProbability, TLItemEnchantTransfer)
        }
        i += 1

    outputName = 'itemLevel.md'
    output = outputDir + outputName 

    writeMarkdown( output, "Item Level",
    {
        'cat1': "Basics",
        'sub1': "Items"
    }, itemEnchantLevel)

itemEnchant()
