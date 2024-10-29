# Fishing

## Level

| Level | Exp to next Level |
| :--- | ---: |
| 1 | 1299 |
| 2 | 3897 |
| 3 | 7015 |
| 4 | 10133 |
| 5 | 16368 |
| 6 | 22603 | 
| 7 | 32476 |
| 8 | 41829 |
| 9 | 54300 |
| 10 | 69888 |
| 11 | 91712 |
| 12 | 119771 |
| 13 | 154066 |
| 14 | 200831 |
| 15 | 260067 |
| 16 | 338009 |
| 17 | 441153 |
| 18 | 578591 |
| 19 | 759677 |
| 20 | 1000000 |

## FishingLevelGapInfo

```json
"FishingCommonInfo": {
    "FishingRangeInfo": {
        "FishingDistanceRangeStart": 700.0,
        "FishingDistanceRangeEnd": 1500.0,
        "FishingAreaRadius": 500.0
    },
    "FishingLevelGapInfo": [
        {
        "LevelGapMin": -999,
        "LevelGapMax": -13,
        "PowerWeight": 1.0,
        "HpWeight": 0.5,
        "StaminaWeight": 1.0,
        "Difficulty": "ETLFishingDifficultType::Hard"
        },
        {
        "LevelGapMin": -12,
        "LevelGapMax": -5,
        "PowerWeight": 1.2,
        "HpWeight": 0.5,
        "StaminaWeight": 2.0,
        "Difficulty": "ETLFishingDifficultType::Hard"
        },
        {
        "LevelGapMin": -4,
        "LevelGapMax": -2,
        "PowerWeight": 1.3,
        "HpWeight": 0.5,
        "StaminaWeight": 2.0,
        "Difficulty": "ETLFishingDifficultType::Hard"
        },
        {
        "LevelGapMin": -1,
        "LevelGapMax": 4,
        "PowerWeight": 1.5,
        "HpWeight": 1.0,
        "StaminaWeight": 2.0,
        "Difficulty": "ETLFishingDifficultType::Normal"
        },
        {
        "LevelGapMin": 5,
        "LevelGapMax": 10,
        "PowerWeight": 1.5,
        "HpWeight": 1.5,
        "StaminaWeight": 2.0,
        "Difficulty": "ETLFishingDifficultType::Normal"
        },
        {
        "LevelGapMin": 11,
        "LevelGapMax": 20,
        "PowerWeight": 1.5,
        "HpWeight": 1.5,
        "StaminaWeight": 2.5,
        "Difficulty": "ETLFishingDifficultType::Easy"
        },
        {
        "LevelGapMin": 21,
        "LevelGapMax": 999,
        "PowerWeight": 1.6,
        "HpWeight": 2.0,
        "StaminaWeight": 3.0,
        "Difficulty": "ETLFishingDifficultType::Easy"
        }
    ]
}
```

Source: 'TLFishingLevel.uasset'