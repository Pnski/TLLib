How does our stats impact our skills? - A very long explanation
GUIDE
Before entering this rabbit hole, I just want to say something to my future self: I know I (old self) am dumb, this has taken hours of our time and we will never have them back, but I hope you are happy with the result.

This is the accumulated knowledge from different people and different sources, a big thank you to everyone dedicated to theorycrafting and unveiling the underlying math of this game.

This is future (present?) me. I'm happy with the results. It's been too many hours but I think this ended up as good "go to" post whenever someone needs understanding about specific stats or how the damage formula works. This is not supposed to be a guide on how to choose between set A or set B or to explain how each stat will impact a singular build, but rather a mathematical explanation on how each stat is used.

That said... Estoy cansado, jefe.

Ok so... How does our stats impact our skills?
We all know that the tooltips and translations in this game aren't really great, sometimes it really feels like an AI translated this or at least someone with no understanding of the game. Maxroll has two great pages about this (Stats and CC) and those cover a lot that will be presented here, but it lacks info on how the actual damage is calculated and some of it is misleading or wrong.

Hopefully this guide will bring some clarity over the actual math behind the main stats we all use on a daily basis, be it PVP or PVE, and how they impact damage. I will use some pseudo-code to explain some parts, but hopefully it's easy enough to understand even if you have no programming knowledge.

Going forward some values need to consider the damage type (Melee, Ranged, Magic) but for the sake of simplicity I will just leave the typing out, just know that if you are using a specific type you need to use the specific counterpart to that type, i.e.: Staff skills are always Magic, so you will be using Magic Hit Chance, Magic Critical Hit Chance, Magic Defense, etc..

Instead of going through each of the stats individually, I will cover the process a single Skill goes through from casting to landing (or not) and hopefully this will make things more comprehensible.

I have tested everything personally but since we don't have access to the game's source code it's possible that some of this is wrong. If you notice something is different than it should be please leave a comment so we can improve the community knowledge together.

TnL Calculator
A while ago I made a tool to help people compare gear sets, I've just improved it by adding a tab where you can input values and calculate your skill damage by yourself. There is a tab used for Gear Comparison and one for Skill Damage.

Here is the link: https://docs.google.com/spreadsheets/d/1-j4t9QlUWfdsGQ62i_04aEmeaXDg7VU5CyvfYzV1mBQ

Please let me know if there are any mistakes, feedbacks are welcome too!

Summary
The Cast

The Cooldown

The Hit

The Damage - Part 1: Formula

The Damage - Part 2: Base Damage, Critical Hit & Glancing

The Damage - Part 3: Multipliers

The Damage - Part 3.1: Multipliers Summary

The Damage - Part 4: Heavy Attack Chance & Heavy Attack Evasion

The Damage - Part 5: Bonus Damage & Damage Reduction

The Status Effects

The Cast
Before any further calculations the first stat a regular skill will come into contact is Attack Speed. Contrary to what the tooltip might make you think Attack Speed impacts more than just your Basic Attack Rate.

Attack Speed also have inffluence over three things:

Basic/Auto Attack Rate (I will not go over this since it has no impact on Skills, but there is a very good post about this by u/Character_Local2323)

Skill Casting Speed

Skill Animation Speed

Grobs has a great video about this and I recommend everyone to watch it, but he doesn't go too much into the formula, so here is how both Casting and Animation speeds are calculated:

(Base Weapon Attack Speed - ((Dex - 10) * 0.002s)) * (100% - (Added Attack Speed / (Added Attack Speed + 100%)))
Notice how Added Attack Speed has diminishing returns, you will never reach 0s Attack Speed no matter how much you try, unfortunately.

So, let's say we are using Daigon's Staff, it has 0.709s base Attack Speed. We also have 80 Dex and 35.4% Added Attack Speed. Here is what it looks like:

(0.709s - ((80 - 10) * 0.002s)) * (100% - (35.4% / (35.4% + 100%))) =
(0.709s - 0.14s) * (100% - 26.14%) =
0.569s * 73.86% = 0.420s
Ok, so how does that impact our skills? We know Hellfire Rain has 3.6s casting time with 1s Attack Speed, this means having 0.42s Attack Speed is just like multiplying 3.6s by 42% which equals to 1.512s. Your Hellfire Rain casting speed, with that setup, will be 1.512s. The same principle is applied to your animation speed.

The Cooldown
Ok, so, we casted it, right? Now, regardless if it hits or not, the skill will go on cooldown.

Cooldown is fairly simple and has similarities with Attack Speed. This is the formula:

(Base Skill Cooldown - Skill Cooldown Specializations) * (100% - (Cooldown Speed / (Cooldown Speed + 100%)))
As you can see it's pretty much the same thing, Cooldown Reduction also has diminishing returns. Let's take Hellfire Rain (60s) with its Cooldown specialization (-9s) and 53.8% Cooldown Speed as an example:

(60s - 9s) * (100% - (53.8% / (53.8% + 100%))) =
51s * (100% - 34.98%) =
51s * 65.02% = 33.16s
After casting, it goes on cooldown. Easy peasy.

The Hit
For a skill to deal damage it needs to hit first, the game calculates this based on your Hit Chance and the target's Evasion. Evasion can negate the skill completely, including it's damage and all possible Status Effects that would be applied.

This is how Hit Chance is calculated:

100% - ((Evasion - Hit Chance)/(Evasion - Hit Chance + 1000))
So, let's say we have 1400 Hit Chance and our target has 2200 Evasion:

100% - ((2200 - 1400) / (2200 - 1400 + 1000)) =
100% - (800 / 1800)) =
100% - 44.44% = 55.56%
Ok, so our attack has 55.56% chance to hit. Let's use another example, let's say we have 1400 Hit Chance and they have 1200 Evasion:

100% - ((1200 - 1400) / (1200 - 1400 + 1000)) =
100% - (-200 / 800)) =
100% - -25% = 125%
Because of this having a higher Hit Chance than your target's Evasion means you always land your skills.

If you mess around with the formula and add custom numbers you will notice that Evasion has diminishing returns the higher the difference to their Hit Chance is.

Ok, that's it, we went through Evasion and Hit Chance and our attack just landed. And if it didn't... You can stop reading here, nothing else from here onwards matters.

The Damage - Part 1: The Formula
Now that our attack hit, let's get our damage value! We will use Chain Lightning through out this part to get our values from, here is the tooltip:

Strikes targets with a lightning skill that deals 430% of Base Damage (Skill Potency) + 177 damage (Skill Damage). When used on targets affected by the user's Burning or Ignite effects increase damage by 4% per stack. Damage increases by 40% against monsters.

First we need to understand the complete damage formula, then we will break it bit by bit. Here is the formula:

((((Skill Potency * Base Damage) + Skill Damage) * [Multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction
Looks simple right? Let's break it down:

Skill Potency: it's the % Base Damage multiplier of a skill, in our example it's 430%.

Base Damage: a random number between your weapon's Min and Max Damage, unless your attack Critical Hits or Glances.

Skill Damage: it's the flat addition to the damage of a skill, in our example it's 177.

Multipliers: everything that multiplies the damage, be it for better or for worse. We will see it in more detail later on.

Heavy Attack: if you land a Heavy Attack this value is 2, if not this value is 1.

Bonus Damage: your Bonus Damage.

Damage Reduction: your target's Damage Reduction.

Skill Potency and Skill Damage are cnames I've given to those bits, it's not official. These are pretty straightforward, they are just a multiplier and an addition nothing biggie. Our formula looks like this for now:

((((430% * Base Damage) + 177) * [Multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction 
The Damage - Part 2: Base Damage, Critical Hit & Glancing
As mentioned above the Base Damage bit of this formula depends on Min and Max Damage as well as knowing if the hit is a Critical Hit, a Glance or neither. Let's say we have Min Damage 267 ~ 770 Max Damage weapon here are the possibilities:

If the hit is a Critical Hit then the Base Damage in our formula will be 770, our Max Damage.

If the hit is a Glance then the Base Damage in our formula will be 267, our Min Damage.

If the hit is neither then the Base Damage in our formula will be a random number between 267 and 770.

Ok so this is how the game calculates if you will land a Critical Hit, a Glance or neither:

if Critical Hit Chance is greater than Endurance:
    Critical Hit Odds = (Critical Hit Chance - Endurance) / (Critical Hit Chance - Endurance + 1000)
else:
    Glance Odds = (Endurance - Critical Hit Chance) / (Endurance - Critical Hit Chance + 1000)
As you can see the formulas are the same, just inverted. Let's assume we have 2400 Critical Hit Chance and your target has 1700 Endurance, here is how it looks like:

(2400 - 1700) / (2400 - 1700 + 1000) = 
700 / 1700 = 41.18%
So, in this case we have 41.18% chance to land a Critical Hit and use Max Damage in our damage formula! If the values were reversed there would be a 41.18% chance for us to use Min Damage instead. For the sake of simplicity we will use the Critical Hit value for the rest of this post. Here is how our formula looks like now:

((((430% * 770) + 177) * [Multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction =
((3488 * [Multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction
PS: Damage Over Time works differently than regular skills but I won't go over it here, I can discuss in the comments later if anyone feels interested.

The Damage - Part 3: Multipliers
Ok, now is time to multiply our damage! Most of our damage actually comes from multipliers and they come in a plethora of different ways. Basically a multiplier is anything that will cut or improve our damage by a given percentage, I will cover the most common ones: Defenses, Block & Block Chance, Critical Damage & Critical Damage Resistance, Skill Damage Boost & Skill Damage Resistance, Species Damage Boost, PVE Damage Multipliers and PVP Damage Multipliers. I will also cover how type grouping happens.

They are grouped together by type and each type is added to the formula individually as a new multiplier. Our current formula would look something like this:

((3488 * Defense% * Block% * Critical Damage% * Skill Damage Boost% * Species Damage Boost% * PVE% (or PVP%) * [any other multipliers relevant to the skill]) * Heavy Attack) + Bonus Damage - Damage Reduction
Let's dive right into the most common ones. For this section I will simplify the formula like this, but it's still the same formula:

((3488 * Multiplier% * [other multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction
Defense

It's a percentage reduction based on the defense of your target, the formula is pretty simple and for this example we will be using 2000 Defense:

Defense / (Defense + 2500)
2000 / (2000 + 2500) =
2000 / 4000 = 44.44%
This basically reduces the damage you take by 44%, it's added to the formula like this:

((3488 * (100% - 44%) * [other multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction
We need to subtract it from the full damage (100%) since it's a reduction. This value will never be more than 100% so we don't need to worry about having a negative multiplier.

Block, Shield Block Chance & Shield Block Penetration Chance

Shield Block Chance is the chance a SnS users has to reduce the damage taken by 40%. Whenever the SnS user hits this odd your damage is reduced by 40%. The odds calculation is:

(Shield Block Chance - Shield Block Penetration Chance)
So if we are hitting someone with 45% Shield Block Chance and we have 29% Shield Block Penetration Chance, there will be 16% chance that our attack will be reduced by 40%. If we have more Penetration Chance than they have Block Chance this will never happen.

Let's say they blocked, then the multiplier would be added like this:

((3488 * (100% - 40%) * [other multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction
I will not add this to the final formula but this is how it works.

Critical Damage & Critical Damage Resistance

This one is pretty simple too! It's a simple subtraction between your Critical Damage and the target's Critical Damage Resistance, let's say you have 35% Critical Damage and they have 14% Critical Damage Resistance:

Critical Damage - Critical Damage Resistance
35% - 14% = 21%
He is what it looks like:

((3488 * (100% + 21%) * [other multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction
If the target has higher Critical Damage Resistance this value would be negative and set to zero instead.

Skill Damage Boost & Skill Damage Resistance

This one is a bit more tricky but nothing we haven't seen before. Skill Damage Boost and Skill Damage Resistance have a similar interaction to Critical Hit and Endurance:

if Skill Damage Boost is greater than Skill Damage Resistance:
    Positive Multiplier = (Skill Damage Boost - Skill Damage Resistance) / (Skill Damage Boost - Skill Damage Resistance + 1000)
else:
    Negative Multiplier = (Skill Damage Resistance - Skill Damage Boost) / (Skill Damage Resistance - Skill Damage Boost + 1000)
First let's say you have 700 Skill Damage Boost and your target has 400 Skill Damage Resistance:

Positive Multiplier = (700 - 400) / (700 - 400 + 1000) = 
300 / 1300 = 23.08%
So our formula would look like:

((3488 * (100% + 23.08%) * [other multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction
But if Skill Damage Resistance was higher this value would be negative, let's say we have 200 Skill Damage Boost and they have 400 Skill Damage Resistance:

Negative Multiplier = (400 - 200) / (400 - 200 + 1000) =
200 / 1200 = 16.67%
And it would look like this in our formula, subtracted from the full damage:

((3488 * (100% - 16.67%) * [other multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction
For the rest of this guide we will be using the first example in this section, where Skill Damage Boost is higher.

Species Damage Boost

Another simple one. It's a different multiplier than Skill Damage Boost and thus it's not impacted by Skill Damage Boost diminishing returns but rather it has its own. It's worth mentioning that his is only applied in PVE and has no effect in PVP. Here is the formula and we will use 30 Species Damage Boost as an example:

Species Damage Boost / (Species Damage Boost + 1000)
30 / (30 + 1000) =
30 / 1030 = 2.91%
And added to the formula:

((3488 * (100% + 2.91%) * [other multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction
PVE Damage Multipliers

Some skills have multipliers specific to PVE. If we are using Chain Lightning just like above we need to look for this multiplier in the tooltip, it's this bit:

Damage increases by 40% against monsters.

This means when hitting any monster, any PVE interaction, this skill will have 40% multiplier added to the formula, just like this:

((3488 * (100% + 40%) * [other multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction
PVP Damage Multipliers

The game applies damage 10% damage reduction to every PVP interaction, you can check this in your Character Page inside More Stats and in the Face Off tab. So we need to add it to our formula like this:

((3488 * (100% - 10%) * [other multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction
For this post we will continue with the PVE example.

Type Grouping

This is a very important one that is often misleading and requires a lot of testing to get right. Some stats are not individual but rather are grouped by type and all different sources are summed up. I will give two examples but bare in mind there are a bunch of stats that get grouped.

One example is Daigon's Staff passive that improves Fire Staff Skills by 10% and the Staff mastery node that improves Magic Damage Boost by 3%. These are not individual values, they don't multiply each other but rather are summed together and used as the same multiplier in our damage formula:

((3488 * (100% + 10% + 3%) * [other multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction
The same happens with Damage Over Time increases and Burning Damage increases. All different sources are added together and used as the same multiplier, they don't multiply each other. Let's say we have: Daigon's Staff Burning Damage +5%, Burning Damage Mastery Node +10%, Damage Over Time Mastery Node +5%, Flame Condensation +72%. The formula would look like this:

 ((3488 * (100% + 5% + 10% + 5% + 72%) * [other multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction =
((3488 * (192%) * [other multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction
Which is a different value we would get if they multiplied each other: 209%.

Type grouping requires a lot of testing and since I main Invocator I don't really know much of other weapons, I encourage you to test it yourself and find how the bonuses you need information on interact with each other.

Other Multipliers

Specific skills, passives and weapons may have specific modifiers to them. Again with the Chain Lightning example:

When used on targets affected by the user's Burning or Ignite effects increase damage by 4% per stack.

This means if the target has 10 Burn stacks and 10 Ignite stacks you will get 4% multiplier for each, which is converted as 80% multiplier. And woule be added to the formula just like the other ones:

((3488 * (100% + 80%) * [other multipliers]) * Heavy Attack) + Bonus Damage - Damage Reduction
The Damage - Part 3.1: Multipliers Summary
So, after adding all those multipliers to our formula this is what it looks like:

((3488 * Defense% * Critical Damage% * Skill Damage Boost% * Species Damage Boost% * PVE% (or PVP%) * [any other multipliers relevant to the skill]) * Heavy Attack) + Bonus Damage - Damage Reduction =

((3488 * (100% - 44%) * (100% + 21%) * (100% + 23.08%) * (100% + 2.91%) * (100% + 40%) * (100% + 80%)) * Heavy Attack) + Bonus Damage - Damage Reduction =

((3488 * 66% * 121% * 123.08% * 102.91% * 140% * 180%) * Heavy Attack) + Bonus Damage - Damage Reduction =

((3488 * 254.9%) * Heavy Attack) + Bonus Damage - Damage Reduction
So, after all these multipliers, this is how the formula looks like:

(8890.912 * Heavy Attack) + Bonus Damage - Damage Reduction
The Damage - Part 4: Heavy Attack Chance & Heavy Attack Evasion
This interaction is very similar to Hit Chance and Evasion but reversed. If your target has more Heavy Attack Evasion than you have Heavy Attack Chance it will be impossible for you to land any heavy attack whatsoever. Let's say we have 800 Heavy Attack Chance and our target has 400 Heavy Attack Evasion:

(Heavy Attack Chance - Heavy Attack Evasion)/(Heavy Attack Chance - Heavy Attack Evasion + 1000) =
(800 - 400) / (800 - 400 + 1000) =
400 / 1400 = 28.57%
Ok! We have 28.57% chance to land a Heavy Attack! If we land it our damage gets multiplied by 2, if we don't it stays the same. Let's say we landed it:

(8890.912 * Heavy Attack) + Bonus Damage - Damage Reduction =
(8890.912 * 2) + Bonus Damage - Damage Reduction = 17781.824 + Bonus Damage - Damage Reduction
That's it! Hurray! We got our damage!

The Damage - Part 5: Bonus Damage & Damage Reduction
After the last juggernaut wall of text, this part is probably the shortest. Bonus Damage and Damage Reduction cancel each other as addition and subtraction by the end of the formula. Simple as that. Let's say you have 40 Bonus Damage and they have 120 Damage Reduction:

17781.824 + Bonus Damage - Damage Reduction =
17781.824 + 40 - 120 = 17861.824
That's it, really. While most weapons don't benefit much from Bonus Damage some weapons like Dagger and Crossbow can benefit more, this is more impactful based on how many instances of damage you deal. If you are dealing one big hit every 2 seconds like a GS then you are only adding Bonus Damage once. But if you are spinning to win as Xbow you add Bonus Damage to each instance of damage you deal.

PS: Bonus Damage is not applied on Damage Over Time abilities

The Status Effects
Maxroll's page about CC Chance and CC Resistances covers everything you need to know here, I'm not going in depth since their info is complete and flawless. Go check them out and support your favorite creators!

The End!
Hurray! Back to grinding!

Source: https://www.reddit.com/r/throneandliberty/comments/1k2cgcp/how_does_our_stats_impact_our_skills_a_very_long/