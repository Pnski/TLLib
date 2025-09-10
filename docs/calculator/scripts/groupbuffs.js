import { fetchGzip } from './loader.js'

// -------------------------------
// Global Lists
// -------------------------------

const weaponPairs = []
const TLTableGlobalSettingsUXLookup = {}

const weaponRules = {
    Longbow: { min: 2, max: 3 },
    Crossbows: { min: 1, max: 1 },
    Daggers: { min: 1, max: 2 },
    Gauntlet: { min: 0, max: 0 },
    Hand: { min: 0, max: 0 },
    Orb: { min: 0, max: 0 },
    Spear: { min: 1, max: 2 },
    Staff: { min: 1, max: 2 },
    Sword: { min: 1, max: 1 },
    Greatsword: { min: 1, max: 2 },
    Wand: { min: 1, max: 2 },
};
//Cavalier (Crossbows / Spear)
//min wert not reached, green for min
//steelheart sns = max reached = rot
//speer+dolche dolche min reached = gelb ABER
//speer min not reached = shadowdancer = green

const buffProviders = {
    heal: {
        Longbow: ["Flash Wave", "Healing Touch", "Nature's Blessing"]
    },
    mana: {
        Longbow: ["Nature's Blessing"]
    },
    cdr: {
        Longbow: ["Deadly Marker"],
        Staff: ["High Focus"]
    },
    status: {
        Longbow: ["Purifying Touch"]
    },
    critDmg: {
        Crossbows: ["Weak Point Shot"]
    },
    enduranceShred: {
        Daggers: ["Thundercloud"],
        Sword: ["Shild Throw"]
    },
    heavyBoost: {
        Spear: ["Sentinel's Bastion"]
    },
    skillDmgBoost: {
        Sword: ["Righteuous Fury"],
        Wand: ["Enchanting Time", "Time for Punishment"]
    },
    atkSpeed: {
        Greatsword: ["DaVinci's Courage"]
    },
    baseDmg: {
        Greatsword: ["Devoted Sanctuary", "DaVinci's Courage"],
        Wand: ["Janice Rage", "Valorous Barrier"]
    },
    defShred: {
        Greatsword: ["Willbreaker"]
    }
};

// -------------------------------
// Helper Functions
// -------------------------------
function cleanKey(key) {
    return key.replace("EWeaponCategory::", "").replace(/^k/, "");
}

function getProviders(buffType) {
    return buffProviders[buffType] || {};
}

function createTLTableGlobalSettingsUXLookup(TLTableGlobalSettingsUX) {
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
        TLTableGlobalSettingsUXLookup[key].icon = 'Image/Weapon/' + key + '.png'
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
    // when fully loaded do the unique weaponPairs
    createWeaponPairs()
}


// ------------------------------------------------------------
// Create unique pairs with names + icons
// ------------------------------------------------------------

function createWeaponPairs() {
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
    renderButtons()
}

// ------------------------------------------------
// UI: render buttons with combo name + icons
// ------------------------------------------------
function renderButtons() {
    const container = document.getElementById('buttons');
    container.innerHTML = '';

    const sortedPairs = [...weaponPairs].sort((a, b) => {
        const primary = a.w1.name.localeCompare(b.w1.name);
        if (primary !== 0) return primary;
        return a.w2.name.localeCompare(b.w2.name);
    });

    sortedPairs.forEach((pair) => {
        const btn = document.createElement('button');
        btn.classList.add('weapon-btn');
        btn.dataset.weapons = `${pair.w1.name},${pair.w2.name}`;

        const text = document.createElement('span');
        text.textContent = `(${pair.w1.name}/${pair.w2.name}) ${pair.combo}`;
        btn.appendChild(text);

        const icon1 = document.createElement('img');
        icon1.src = pair.w1.icon;
        icon1.style.height = '24px';
        btn.appendChild(icon1);

        const icon2 = document.createElement('img');
        icon2.src = pair.w2.icon;
        icon2.style.height = '24px';
        btn.appendChild(icon2);

        btn.onclick = () => {
            addToPool(pair.w1.name, pair.w2.name, pair.combo);
        };

        container.appendChild(btn);
    });

    renderParties();
    updateButtonColors();
}

// Count weapons per party
function getWeaponCounts() {
    return parties.map(party => {
        const counts = {};
        Object.keys(weaponRules).forEach(key => counts[key] = 0);

        for (const player of party) {
            counts[player.w1]++;
            counts[player.w2]++;
        }
        return counts;
    });
}

// Decide button color across ALL parties
function getButtonColor(w1, w2, allCounts) {
    let anyGreen = false;
    let anyYellow = false;
    let allRed = true;

    for (const counts of allCounts) {
        const rule1 = weaponRules[w1];
        const rule2 = weaponRules[w2];
        const c1 = counts[w1] || 0;
        const c2 = counts[w2] || 0;

        const isMax = (rule1 && c1 >= rule1.max) || (rule2 && c2 >= rule2.max);
        const isBelowMin = (rule1 && c1 < rule1.min) || (rule2 && c2 < rule2.min);

        if (isMax) {
            // this party is red, but maybe not all parties
        } else if (isBelowMin) {
            anyGreen = true;
            allRed = false;
        } else {
            anyYellow = true;
            allRed = false;
        }

        if (!isMax) {
            allRed = false;
        }
    }

    if (anyGreen) return 'green';
    if (anyYellow) return 'yellow';
    if (allRed) return 'red';

    return 'yellow'; // fallback
}

function updateButtonColors() {
    const partyCounts = getWeaponCounts();

    document.querySelectorAll('#buttons button').forEach(btn => {
        const [w1, w2] = btn.dataset.weapons.split(',');
        const color = getButtonColor(w1, w2, partyCounts);

        if (color === 'green') {
            btn.style.background = 'lightgreen';
        } else if (color === 'yellow') {
            btn.style.background = 'khaki';
        } else if (color === 'red') {
            btn.style.background = 'salmon';
        }
    });
}


// ------------------------------------------------
// Party Management
// ------------------------------------------------
let parties = [[]]; // default Party 1
const maxPartySize = 6;

function renderParties() {
    const container = document.getElementById('partys');
    container.innerHTML = '';

    parties.forEach((party, idx) => {
        const div = document.createElement('div');
        div.className = 'party';

        const title = document.createElement('h3');
        title.textContent = `Party ${idx + 1}`;
        div.appendChild(title);

        // Members
        const members = document.createElement('ul');
        party.forEach(member => {
            const li = document.createElement('li');
            li.textContent = `${member.name} (${member.w1} / ${member.w2})`;
            members.appendChild(li);
        });
        div.appendChild(members);

        container.appendChild(div);
    });

    // Add Party Button
    const addBtn = document.createElement('button');
    addBtn.textContent = '+ Add Party';
    addBtn.onclick = () => {
        parties.push([]);
        calculateParties();
    };
    container.appendChild(addBtn);
    // Add Clear Button
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'CLEAR';
    clearBtn.onclick = () => {
        parties = [[]];
        playerPool = []
        calculateParties();
    };
    container.appendChild(clearBtn);
    // Add Clear Button
    const backBtn = document.createElement('button');
    backBtn.textContent = '🔙';
    backBtn.onclick = () => {
        playerPool.pop()
        calculateParties();
    };
    container.appendChild(backBtn);
}

// ------------------------------------------------
// Logic: add weapons to party
// ------------------------------------------------

let playerPool = []

function addToPool(w1, w2, name) {
    const maxPlayerPool = maxPartySize * parties.length
    if (playerPool.length < maxPlayerPool) {
        playerPool.push({ w1: w1, w2: w2, name: name })
    }
    calculateParties();
}

// ------------------------------------------------
// Logic: calculate best party
// ------------------------------------------------

function calculateParties() {
    // empty parties but keep same count
    parties = Array.from({ length: parties.length }, () => []);

    function findParty(player) {
        let bestParty = null;
        let bestScore = Infinity; // lower is better

        parties.forEach(party => {
            // Count weapons in this party
            const counts = {};
            Object.keys(weaponRules).forEach(key => counts[key] = 0);
            for (const member of party) {
                counts[member.w1]++;
                counts[member.w2]++;
            }

            // Check max rules
            if (
                counts[player.w1] < weaponRules[player.w1].max &&
                counts[player.w2] < weaponRules[player.w2].max &&
                party.length < maxPartySize
            ) {
                // score: party size + weapon presence bias
                let score = party.length;

                // bias: prefer parties with fewer of this player's weapons
                score += counts[player.w1] + counts[player.w2];

                if (score < bestScore) {
                    bestScore = score;
                    bestParty = party;
                }
            }
        });

        return bestParty;
    }

    for (const player of playerPool) {
        const party = findParty(player);

        if (party) {
            party.push(player);
        } else {
            // fallback: dump into the least filled party
            let smallest = parties.reduce((a, b) => (a.length <= b.length ? a : b));
            if (smallest.length < maxPartySize) {
                smallest.push(player);
            }
        }
    }

    console.log("Calculated Parties:", parties);
    renderParties();
    updateButtonColors();
}


// ------------------------------------------------
// Buff Summary (respecting priority + order of adding)
// ------------------------------------------------
function summarizeBuffs() {

}

// ------------------------------------------------
// Inject page-specific styles (only for this page)
// ------------------------------------------------
function injectStyles() {
    if (document.getElementById('weapon-style')) return; // avoid duplicates

    const style = document.createElement('style');
    style.id = 'weapon-style';
    style.textContent = `
        #buttons {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 6px;
            margin-top: 10px;
        }
        .weapon-btn {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 4px 6px;
            border: 1px solid #ccc;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            gap: 6px;
        }
        .weapon-btn span {
            flex: 1;                  /* take all remaining space */
            white-space: nowrap;      /* single line */
            overflow: hidden;         /* cut off overflow */
            text-overflow: ellipsis;  /* show … */
        }
        .weapon-btn img {
            flex-shrink: 0;           /* icons never shrink */
            height: 24px;
        }
    `;
    document.head.appendChild(style);
}

// ------------------------------------------------
// Docsify Plugin
// ------------------------------------------------

console.log("groupbuffs.js loaded")

window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
    hook.doneEach(async () => {
        const currentPage = vm.route.path;
        if (!currentPage.includes('/calculator/group')) return;

        injectStyles();

        const TLTableGlobalSettingsUX = JSON.parse(await fetchGzip('sources/TLTableGlobalSettingsUX'))[0].Rows.Default
        createTLTableGlobalSettingsUXLookup(TLTableGlobalSettingsUX);
        console.log("finishd")
    });
});
