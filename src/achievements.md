---
toc: false
---

# Achievements

```js
const achievements = [
    FileAttachment("/static/sources/TLAchievementLooks_Combat.gz"),
    FileAttachment("/static/sources/TLAchievementLooks_Economy.gz"),
    FileAttachment("/static/sources/TLAchievementLooks_Live.gz"),
    FileAttachment("/static/sources/TLAchievementLooks_Narrative.gz"),
    FileAttachment("/static/sources/TLAchievementLooks_World1.gz"),
    FileAttachment("/static/sources/TLAchievementLooks_World2.gz"),
    FileAttachment("/static/sources/TLAchievementLooks_World3.gz")
    ]
const achievementCat = FileAttachment("/static/sources/TLAchievementCategory.gz")

async function unzipJson(fileAttachment) {
  const stream = await fileAttachment.stream()

  const decompressed = stream.pipeThrough(
    new DecompressionStream("gzip")
  )

  return (new Response(decompressed).json())
}

const achievementData = await Promise.all(
  achievements.map(unzipJson)
)
const achievementCategories = await unzipJson(achievementCat)
const categoryByRow = achievementCategories[0].Rows

```

```js
const achievementsList = []

for (const file of achievementData) {
  const rows = file[0].Rows

  for (const value of Object.values(rows)) {
    try {
      const categoryRow =
        categoryByRow[value.Category?.RowName]

      if (!categoryRow) continue

      achievementsList.push({
        Title: value.TitleText?.LocalizedString,
        Description: value.Description?.LocalizedString,
        Category: categoryRow.ParentCategory?.RowName,
        Subcategory: categoryRow.DisplayText?.LocalizedString
      })
    } catch (e) {
      // same as Python's except
      console.warn(
        "Skipping:",
        value.TitleText?.LocalizedString
      )
    }
  }
}
```

```js
const query = view(Inputs.search(achievementsList, {
  placeholder: "Search achievements…"
}))
```

```js
view(
  Inputs.table(query, {
    rows: 30,
    maxHeight: 700,
    select: false
  })
)
```