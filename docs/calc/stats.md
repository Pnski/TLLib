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

Debuff Duration of 34.2% = 28.21%
Debuff Duration of 30% = 25.28%
Debuff Duration of 24% = 20.83%
Debuff Duration of 18% = 16.1%
Debuff Duration of 12% = 11.06%
Debuff Duration of 6% = 5.7%
Debuff Duration of 3% = 2.98%

## Cooldown Speed

Cooldown Speed to Cooldown Reduction Formula:
$$
Cooldownreduction = \frac {Cooldown_{Speed}}{100 + Cooldown_{Speed}}
$$

Cooldown Speed Diminishing Returns Data Points:

Cooldown Speed of 93% = Cooldown Reduction of 48.187%
Cooldown Speed of 83% = Cooldown Reduction of 45.355%
Cooldown Speed of 49.66% = Cooldown Reduction of 33.182%
Cooldown Speed of 41.66% = Cooldown Reduction of 29.408%
Cooldown Speed of 33% = Cooldown Reduction of 24.812%
Cooldown Speed of 25.5% = Cooldown Reduction of 20.31%
Cooldown Speed of 19% = Cooldown Reduction of 15.966%

## Heavy Attack Chance

Heavy Attack Chance Formula:

$$
HeavyAttackChance = \frac{HeavyAttack}{HeavyAttack + 1000}*100
$$