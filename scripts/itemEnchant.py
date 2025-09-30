from _utils import sidebarjson, loadFile, writeMarkdown

import bisect

gradesList = ["kC", "kB", "kA", "kA2", "kAA", "kAA2", "kAA3", "kAAA"]

EnchantTransferId = {
    "kWeapon": "Weapon_TRN_Normal",
    "kWeapon_ArcBoss": "Weapon_ArcBoss_TRN_Normal",
    "kArmor": "Chest_TRN_Normal",
    "kAccessory": "Necklace_TRN_Normal",
}

outputDir = "docs/items/"

TLItemEnchantTransfer = loadFile("sources/TLItemEnchantTransfer")


def getEnchantLevelEntities(key):
    transferId, Grade, ARCBOSS = (lambda p: (p[0], p[1], "_" + p[2] if p[2:] else ""))(
        key.split("_")
    )

    for grade in TLItemEnchantTransfer.get(EnchantTransferId.get(transferId + ARCBOSS), {}).get(
        "ItemGradeEntities", {}
    ):
        if grade.get("ItemGrade").split("::")[-1] == Grade:
            return grade.get("EnchantLevelEntities")


def calcPercentagePerClick(level):
    xpPerClick = 0
    for result in level.get("enchantResults"):
        xpPerClick += result.get("Percentage") / 100 * result.get("Probability")

    return xpPerClick


def getBestTransferLevel(key, levels):
    bestLevel = None

    def itemTransferLevel(key):
        gradeIndex = gradesList.index(key.split("_")[1])
        if gradeIndex > 0:
            lowerGrade = key.replace("_" + key.split("_")[1], "_" + gradesList[gradeIndex - 1])
            lowerItem = getEnchantLevelEntities(lowerGrade)[-1].get("AccumulatedPoint")
            # if this success we have the item with 1 lower grade to fill the exp to the next weapon
            return lowerItem
        return None

    sharedItemXp = itemTransferLevel(key)

    levelValues = {}
    i = 0
    for level in levels.values():
        avgCalcPercentagePerClick = calcPercentagePerClick(level)
        averageClicks = int(-(-(1 / avgCalcPercentagePerClick) // 1))
        levelValues[i] = {
            # "averageClicks": averageClicks,
            "averageSollant": averageClicks * level.get("resources").get("sollant"),
            "averageStones": averageClicks * level.get("resources").get("upgradeStones"),
        }
        i += 1

    levelXpValues = [lvl["levelXpValue"] for lvl in levels.values()]
    if sharedItemXp:
        i = 0
        for level in levels.values():

            def getInvestment(lower, higher):
                investment = 0
                if lower > higher:
                    return investment
                for n in range(lower, higher):
                    investment += levelValues[n].get("averageStones")
                return investment

            currentXp = levels[i].get("levelXpValue") + sharedItemXp
            idx = bisect.bisect_right(levelXpValues, currentXp)
            savings = getInvestment(i, idx)

            if bestLevel is None or savings > bestLevel[1]:
                bestLevel = [i, savings]
            i += 1

        levelValues[bestLevel[0]].update({"saving": bestLevel[1]})
    return levelValues


def getLevelList(key, EnchantEntities, TLItemEnchantProbability):
    levelList = {}

    maxAccumulatedpoints = getEnchantLevelEntities(key)

    i = 0
    for level, overRatio in zip(
        EnchantEntities.get("EnchantEntities"),
        EnchantEntities.get("EnchantPointOverRatios"),
    ):
        EnchantProbablityId = level.get("ItemEnchantProbabilityId")
        EnchantResults = []
        for value in TLItemEnchantProbability[EnchantProbablityId].get("EnchantResult"):
            EnchantResults.append(
                {
                    "Percentage": value.get("EnchantPoint"),
                    "Probability": value.get("Probability") / 10000,
                }
            )
        levelList[i] = {
            "enchantResults": EnchantResults,
            "resources": {
                "upgradeStones": level.get("ResourceItems", [])[0].get("Quantity"),
                "sollant": level.get("Gold"),
            },
            "levelXpValue": maxAccumulatedpoints[i].get("AccumulatedPoint"),
            "LevelOverXp": overRatio.get("Ratio")
            / 10000
            * maxAccumulatedpoints[i].get("AccumulatedPoint"),
        }
        i += 1

    return levelList


def itemEnchant():
    itemEnchantLevel = {}
    TLItemEnchantProbability = loadFile("sources/TLItemEnchantProbability")
    TLItemEnchant = loadFile("sources/TLItemEnchant")

    i = 0
    for key, value in TLItemEnchant.items():
        try:
            gradesList.index(key.split("_")[1])
        except:
            continue
        levels = getLevelList(key, value, TLItemEnchantProbability)
        bestTransferLevel = getBestTransferLevel(key, levels)
        itemEnchantLevel[i] = {
            "Category": key,
            "maxLevel": value.get("EnchantMaxLevel"),
            "level": [
                f"Level {idx}: " + ", ".join(f"{k}={v}" for k, v in vals.items())
                for idx, vals in bestTransferLevel.items()
            ],
        }
        i += 1

    outputName = "itemLevel.md"
    output = outputDir + outputName

    writeMarkdown(output, "Item Level", {"cat1": "Basics", "sub1": "Items"}, itemEnchantLevel)


itemEnchant()
