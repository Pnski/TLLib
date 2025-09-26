from _utils import sidebarjson, loadFile, writeMarkdown

achievementFiles = [
    
    "TLAchievementLooks_Combat",
    "TLAchievementLooks_Economy",
    "TLAchievementLooks_Live",
    "TLAchievementLooks_Narrative",
    "TLAchievementLooks_World1",
    "TLAchievementLooks_World2",
    "TLAchievementLooks_World3",
]

outputDir = "docs/achievement/"


def achievementList():
    achievements = {}
    TLAchievementCategory = loadFile("sources/TLAchievementCategory")
    i = 0
    for file in achievementFiles:
        achievementLooks = loadFile("sources/"+file)
        for value in achievementLooks.values():
            try:
                achievements[i] = {
                    "Title": value.get("TitleText").get("LocalizedString"),
                    "Description": value.get("Description").get("LocalizedString"),
                    "Category": TLAchievementCategory[value.get("Category").get("RowName")].get("ParentCategory").get("RowName"),
                    "Subcategory": TLAchievementCategory[value.get("Category").get("RowName")].get("DisplayText").get("LocalizedString"),
                }
                i += 1
            except:
                print("Skipping: "+value.get("TitleText").get("LocalizedString"))

    # 1. Get the list of dictionary values
    achievement_list = list(achievements.values())

    # 2. Sort the list using a lambda function as the key
    # The tuple (x['Category'], x['Subcategory'], x['Title']) tells sorted()
    # to first sort by 'Category', then by 'Subcategory', and finally by 'Title'.
    sorted_achievements = sorted(achievement_list, key=lambda x: (x['Category'], x['Subcategory'], x['Title']))

    # 3. Rebuild the dictionary with new integer keys
    # This is the step needed to preserve the [integer] structure
    sorted_achievements_dict = {}
    for i, achievement_data in enumerate(sorted_achievements):
        sorted_achievements_dict[i] = achievement_data

    outputName = "achievementList.md"
    output = outputDir + outputName

    writeMarkdown(
        output,
        "Achievement List",
        {"cat1": "Basics", "sub1": "Achievements"},
        sorted_achievements_dict,
    )


achievementList()
