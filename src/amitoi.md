---
toc: false
---

# Amitoi

```js
const regionFile = FileAttachment("/static/sources/TLMagicDollExpeditionRegion.gz")
const groupFile = FileAttachment("/static/sources/TLItemLotteryPrivateGroup.gz")
const unitFile = FileAttachment("/static/sources/TLItemLotteryUnit.gz")
const imgFile = FileAttachment("/static/sources/TLItemLooks.gz")

async function unzipJson(file) {
  const stream = await file.stream()
  const decompressed = stream.pipeThrough(new DecompressionStream("gzip"))
  return new Response(decompressed).json()
}

const [regionData, groupData, unitData, imgData] = await Promise.all([
  unzipJson(regionFile),
  unzipJson(groupFile),
  unzipJson(unitFile),
  (await unzipJson(imgFile))[0].Rows
])

function avgQuantity(entries) {
  const totalProb = entries.reduce((sum, e) => sum + e.prob / 10000, 0)
  const totalQty = entries.reduce((sum, e) => sum + e.quantity * (e.prob / 10000), 0)
  return totalQty / totalProb
}

function getImg(item) {
  const path = imgData[item]?.IconPath?.AssetPathName
  if (!path) return ""
  const rPath = path.split('.')[0].replace("/Game", "https://raw.githubusercontent.com/Pnski/TLLib/main/src/static") + ".png"
  return htl.html`<img src="${rPath}">`
}
```

```js
const expeditionRewards = []

for (const region of Object.values(regionData[0].Rows)) {
  const regionName = region.RegionName?.LocalizedString

  for (const rewards of region.ExpeditionRewards) {
    const row = { Region: regionName, ExpeditionTime: rewards.ExpedtionTime / 3600 } // in hours
    const regionRewards = []

    const groupId = rewards.MagicDollCountRewards?.slice(-1)[0]?.DefaultPrivateLotteryGroupId
    const entries = groupData[0].Rows[groupId]?.ItemLotteryPrivateGroupEntry || []

    for (const gEntry of entries) {
      if (unitData[0].Rows[gEntry.id]) {
        const unitEntries = unitData[0].Rows[gEntry.id].ItemLotteryUnitEntry
        regionRewards.push({
          item: getImg(unitEntries[0].item),
          avg: avgQuantity(unitEntries)
        })
      } else {
        console.warn("Error in UnitData", gEntry.id)
      }
    }

    // Flatten into row object for table display
    row.Rewards = regionRewards.map(r => ({ img: r.item, avg: r.avg }))
    expeditionRewards.push(row)
  }
}
```

```js
view(
  Inputs.table(
    expeditionRewards.map(r => {
      const row = { Region: r.Region, ExpeditionTime: r.ExpeditionTime }
      r.Rewards.forEach((x,i) => {
        row[`Reward ${i+1}`] = x.img
        row[`% ${i+1}`] = x.avg.toFixed(1)
      })
      return row
    }),
    { 
        width: 1200,
        rows: 50,
        select: false, 
        format: { "Reward 1": d => d,
            "Reward 2": d => d,
            "Reward 3": d => d,
            "Reward 4": d => d
         }
    }
  )
)
```