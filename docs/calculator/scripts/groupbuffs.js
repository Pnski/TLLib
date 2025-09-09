import { fetchGzip } from './loader.js'

const weaponBuffs = {}



const TLTableGlobalSettingsUXLookup = {}

function cleanKey(key) {
    return key.replace("EWeaponCategory::", "").replace(/^k/, "");
}

weaponBuffs['Bow'] = {
    heal: ['Flash Wave', 'Healing Touch', "Nature's Blessing"],
    mana: ["Nature's Blessing"],
    cdr: [' Deadly Marker'],
    status: ['Purifying Touch']
}

weaponBuffs['Crossbow'] = {
    critDmg: ['Weak Point Shot']
}

weaponBuffs['Dagger'] = {
    enduranceShred: ['Thundercloud']
}

weaponBuffs['Spear'] = {
    heavyBoost: ["Sentinel's Bastion"]
}

weaponBuffs['Staff'] = {
    cdr: ['High Focus']
}

weaponBuffs['Sword'] = {
    skillDmgBoost: ['Righteuous Fury'],
    enduranceShred: ['Shild Throw']
}

weaponBuffs['Sword2h'] = {
    atkSpeed: ["DaVinci's Courage"],
    baseDmg: ['Devoted Sanctuary', "DaVinci's Courage"],
    defShred: ['Willbreaker']
}

weaponBuffs['Wand'] = {
    skillDmgBoost: ['Enchanting Time', 'Time for Punishment'],
    baseDmg: ['Janice Rage', 'Valorous Barrier'],
}

// ------------------------------------------------------------
// Create unique pairs with names + icons
// ------------------------------------------------------------

const weaponPairs = [];



// ------------------------------------------------
// UI: render buttons with combo name + icons
// ------------------------------------------------
function renderButtons() {
    const container = document.getElementById('buttons');
    container.innerHTML = '';

    weaponPairs.forEach((pair, i) => {
        const btn = document.createElement('button');
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.gap = '4px';

        // Combo text
        const text = document.createElement('span');
        text.textContent = `${pair.combo} (${pair.w1.name} / ${pair.w2.name})`;
        btn.appendChild(text);

        // Icons
        const icon1 = document.createElement('img');
        icon1.src = pair.w1.icon;
        icon1.style.height = '24px';
        btn.appendChild(icon1);

        const icon2 = document.createElement('img');
        icon2.src = pair.w2.icon;
        icon2.style.height = '24px';
        btn.appendChild(icon2);

        // Click handler
        btn.onclick = () => console.log(i);

        container.appendChild(btn);
    });
}


console.log("groupbuffs.js loaded")

window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
    hook.doneEach(async () => {
        console.warn("currentPage")
        const currentPage = vm.route.path;
        
        if (!currentPage.includes('/calculator/group')) return;
        const TLTableGlobalSettingsUX = JSON.parse(await fetchGzip('sources/TLTableGlobalSettingsUX'))[0].Rows.Default
        // -------------------------------
        // Weapon Names
        // -------------------------------
        TLTableGlobalSettingsUX.WeaponNameText.forEach(row => {
            const key = cleanKey(row.Key);
            TLTableGlobalSettingsUXLookup[key] = TLTableGlobalSettingsUXLookup[key] || {};
            TLTableGlobalSettingsUXLookup[key].name = row.Value.LocalizedString;
        });

        // -------------------------------
        // Weapon Icons
        // -------------------------------
        TLTableGlobalSettingsUX.WeaponIconHud.forEach(row => {
            const key = cleanKey(row.Key);
            TLTableGlobalSettingsUXLookup[key] = TLTableGlobalSettingsUXLookup[key] || {};
            TLTableGlobalSettingsUXLookup[key].icon = row.Value.IconImage.AssetPathName;
        });

        // -------------------------------
        // Weapon Combinations
        // -------------------------------
        TLTableGlobalSettingsUX.WeaponCombination.forEach(row => {
            const key = cleanKey(row.Key);
            TLTableGlobalSettingsUXLookup[key] = TLTableGlobalSettingsUXLookup[key] || {};
            TLTableGlobalSettingsUXLookup[key].combinations = {};

            (row.Value.InnerWeaponCombinationText || []).forEach(combo => {
                const otherKey = cleanKey(combo.Key);
                TLTableGlobalSettingsUXLookup[key].combinations[otherKey] = combo.Value.LocalizedString;
            });
        });

        const weaponKeys = Object.keys(TLTableGlobalSettingsUXLookup);
        for (let i = 0; i < weaponKeys.length; i++) {
            for (let j = i + 1; j < weaponKeys.length; j++) {
                const w1 = weaponKeys[i];
                const w2 = weaponKeys[j];

                const comboName =
                    TLTableGlobalSettingsUXLookup[w1].combinations?.[w2] ||
                    TLTableGlobalSettingsUXLookup[w2].combinations?.[w1] ||
                    0;

                if (comboName == 0) {
                    continue
                }

                weaponPairs.push({
                    combo: comboName,
                    w1: {
                        key: w1,
                        name: TLTableGlobalSettingsUXLookup[w1].name,
                        icon: TLTableGlobalSettingsUXLookup[w1].icon
                    },
                    w2: {
                        key: w2,
                        name: TLTableGlobalSettingsUXLookup[w2].name,
                        icon: TLTableGlobalSettingsUXLookup[w2].icon
                    }
                });
            }
        }

        console.warn("do stuff")
        renderButtons();

    });
});
