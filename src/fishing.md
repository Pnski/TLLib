---
toc: false
---

# Fishing

```js
const TLFishingFishGroupFile = FileAttachment("/static/sources/TLFishingFishGroupInfo.gz")
const TLFishingCommonFile = FileAttachment("/static/sources/TLFishingCommonInfo.gz")
const TLFishingLevelFile = FileAttachment("/static/sources/TLFishingLevel.gz")
const TLFishingFishFile = FileAttachment("/static/sources/TLFishingFishInfo.gz")

async function unzipJson(file) {
  const stream = await file.stream()
  const decompressed = stream.pipeThrough(new DecompressionStream("gzip"))
  return new Response(decompressed).json()
}

const [TLFishingFishGroupInfo, TLFishingCommonInfo, TLFishingLevel, TLFishingFishInfo] = await Promise.all([
  unzipJson(TLFishingFishGroupFile),
  unzipJson(TLFishingCommonFile),
  unzipJson(TLFishingLevelFile),
  unzipJson(TLFishingFishFile),
])
```

## Level

```js
const TLFishingLevelRows = Object.entries(TLFishingLevel[0].Rows);

const fishLevel = TLFishingLevelRows.map(([key, value], i) => {
    const currentTotal = value.LevelExpThreshold;
    const prevTotal = i > 0 ? TLFishingLevelRows[i - 1][1].LevelExpThreshold : 0;

    return {
        'Name': key,
        'expNext': currentTotal - prevTotal,
        'TotalExp': currentTotal,
        'Title': value.Title?.LocalizedString,
    };
});
```

```js
view(
    Inputs.table(
        fishLevel,
        {width: width,
        rows: 31,
        select: false, 
        sort: "TotalExp" }
    )
)
```

## Habitat
```js
const TLFishingFishInfoRows = Object.entries(TLFishingFishInfo[0].Rows);

const FishInfo = TLFishingFishInfoRows.map(([key, value], i) => {
    // Extract habitat names into a comma-separated string
    const habitatString = value.HabitatInfo?.HabitatList
        .map(h => h.RowName)
        .join("\n");

    return {
        'Name': value.FishName?.LocalizedString,
        'Level': value.Level,
        'Habitat': habitatString
    };
});

const query = view(Inputs.search(FishInfo, {
  placeholder: "Search habitats..."
}))
```

```js
view(
    Inputs.table(
        query,
        {width: width,
        rows: 31,
        select: false,
        sort: "Level",
        format: {
            "Habitat": d => htl.html`<div style="white-space: pre-line; line-height: 1.4; padding: 4px 0;">${d}</div>`
        }}
    )
)
```