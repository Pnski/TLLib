---
toc: false
---

# Weapon Mastery

```js
const TLWeaponSpecializationFile = FileAttachment("/static/sources/TLWeaponSpecializationLevel.gz")


async function unzipJson(file) {
  const stream = await file.stream()
  const decompressed = stream.pipeThrough(new DecompressionStream("gzip"))
  return new Response(decompressed).json()
}

const [TLWeaponSpecializationLevel] = await Promise.all([
  unzipJson(TLWeaponSpecializationFile)
])
```

## Level

```js
const TLWeaponSpecializationLevelRows = Object.entries(TLWeaponSpecializationLevel[0].Rows);

const fishLevel = TLWeaponSpecializationLevelRows.map(([key, value], i) => {
    const currentTotal = value.point_threshold;
    const prevTotal = i > 0 ? TLWeaponSpecializationLevelRows[i - 1][1].point_threshold : 0;

    return {
        'Level': +key,
        'expNext': currentTotal - prevTotal,
        'TotalExp': currentTotal,
    };
});
```

```js
view(
    Inputs.table(
        fishLevel,
        {
            width: width,
            rows: 31,
            select: false, 
            sort: "Level"
        }
    )
)
```