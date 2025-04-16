# Stats

## Hit and Evasion

Evasion Chance Formula for PvP:

$$
Eva_{Chance} = \frac{Your_{Evasion} − Enemy_{Hit}}{Your_{Evasion} − Enemy_{Hit} + 1000}*100
$$

Evasion Chance Formula for PvE (Diminishing Returns):

$$
Eva_{Chance} = \frac{Your_{Evasion}}{Your_{Evasion} + 1000}*100
$$

## Critical Hit and Endurance

Critical Chance Formula for PvP:
$$
Crit_{Chance} = \frac{Your_{Crit}-Enemy_{Endurance}}{Your_{Crit}-Enemy_{Endurance}+1000}*100
$$

Critical Chance Formula for PvE (Diminishing Returns):
$$
Crit_{Chance} = \frac{Your_{Crit}}{Your_{Crit}+1000}*100
$$

## Skill Damage Boost and Skill Damage Resistance

Skill Damage Resistance Formula for PvP:

$$
Skill_{DamageResistance} = \frac{Skill_{DamageResistance}}{Skill_{DamageResistance}+1000}*100
$$

Skill Damage Boost Formula for PvE:

$$
Skill_{DamageBoost} = \frac{Skill_{DamageBoost}}{Skill_{DamageBoost}+1000}*100
$$


## Bonus Damage and Damage Reduction

$$
Damage_{Total} = Damage_{Base} + Damage_{Bonus}
$$

$$
DamageRed_{Total} = EnemyDamage_{Total} - Damage_{Reduction}
$$

## Buff Duration and Debuff Duration
Debuff Duration Diminishing Returns Data Points:
Debuff Reduction | Debuff Duration
--- | ---
|34.2% | 28.21%
|30% | 25.28%
|24% | 20.83%
|18% | 16.1%
|12% | 11.06%
|6% | 5.7%
|3% | 2.98%

## Cooldown Speed

Cooldown Speed to Cooldown Reduction Formula:
$$
Cooldownreduction = \frac {Cooldown_{Speed}}{100 + Cooldown_{Speed}}
$$

Cooldown Speed Diminishing Returns Data Points:

Cooldown Speed | Cooldown Reduction
--- | ---
93% | 48.187%
83% | 45.355%
49.66% | 33.182%
41.66% | 29.408%
33% | 24.812%
25.5% | 20.31%
19% | 15.966%

## Heavy Attack Chance

Heavy Attack Chance Formula:

$$
HeavyAttackChance = \frac{HeavyAttack}{HeavyAttack + 1000}*100
$$

Source: [Maxroll](https://maxroll.gg/throne-and-liberty/resources/in-depth-stats-guide)