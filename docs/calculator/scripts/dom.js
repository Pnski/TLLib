import { fillTraits, SkillCalcNew } from './skills.js'; // Added parseQuestLogStats as well

// --- Global Configuration / Constants (if any) ---
// Define constants for IDs to avoid magic strings
const DOM_IDS = {
    PASTE_OVERLAY: 'pasteOverlay',
    OPEN_PASTE_WINDOW_BTN: 'openPasteWindow',
    CLOSE_PASTE_WINDOW_BTN: 'closePasteWindow',
    STAT_INPUT_TEXTAREA: 'statInput',
    PARSE_STATS_BTN: 'parseStats',
    PARSE_CLIPBOARD_BTN: 'parseClipboard',
    SKILL_TABLE_TBODY: 'table-skills-select',
};

// Define constants for paths
export const CALCULATOR_PATH = '/calculator/dd_calc';

// --- Utility Functions ---

/**
 * Gets an HTML element by its ID.
 * @param {string} id - The ID of the element.
 * @returns {HTMLElement | null} The element or null if not found.
 */
function getElement(id) {
    return document.getElementById(id);
}

/**
 * Sets the display style of an element.
 * @param {HTMLElement} element - The HTML element.
 * @param {'flex' | 'none'} displayStyle - The display style to apply.
 */
function setDisplay(element, displayStyle) {
    if (element) {
        element.style.display = displayStyle;
    }
}

/**
 * Initializes a SlimSelect instance.
 * @param {HTMLElement} selectElement - The HTML select element.
 * @param {string} placeholderText - The placeholder text for the select.
 * @param {boolean} showSearch - Whether to show the search box.
 * @param {boolean} isMultiple - Whether the select allows multiple selections.
 * @param {function} afterChangeCallback - Callback function for afterChange event.
 * @returns {SlimSelect} The initialized SlimSelect instance.
 */
function initializeSlimSelect(selectElement, placeholderText, showSearch = false, isMultiple = false, afterChangeCallback = null) {
    const initialData = [{
        text: placeholderText,
        value: '',
        disabled: true,
        selected: true
    }];

    const slimSelectOptions = {
        select: selectElement,
        data: initialData,
        settings: {
            showSearch: showSearch,
            isMultiple: isMultiple,
        },
        events: {} // Initialize events object
    };

    if (afterChangeCallback) {
        slimSelectOptions.events.afterChange = afterChangeCallback;
    }

    return new SlimSelect(slimSelectOptions);
}

// --- UI Event Handlers ---

/**
 * Handles opening the paste window overlay.
 */
function handleOpenPasteWindow() {
    const pasteOverlay = getElement(DOM_IDS.PASTE_OVERLAY);
    setDisplay(pasteOverlay, 'flex');
}

/**
 * Handles closing the paste window overlay.
 */
function handleClosePasteWindow() {
    const pasteOverlay = getElement(DOM_IDS.PASTE_OVERLAY);
    setDisplay(pasteOverlay, 'none');
}

/**
 * Handles parsing stats from the input textarea.
 */
function handleParseStats() {
    const statInput = getElement(DOM_IDS.STAT_INPUT_TEXTAREA);
    if (statInput) {
        parseQuestLogStats(statInput.value);
    }
    handleClosePasteWindow();
}

/**
 * Handles parsing stats from the clipboard.
 */
async function handleParseClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        const statInput = getElement(DOM_IDS.STAT_INPUT_TEXTAREA);
        if (statInput) {
            statInput.value = text;
        }
    } catch (err) {
        console.warn("Clipboard access denied:", err);
    }
}

/**
 * Attaches event listeners for the paste window and stat parsing.
 */
export function setupPasteWindowListeners() {
    getElement(DOM_IDS.OPEN_PASTE_WINDOW_BTN)?.addEventListener('click', handleOpenPasteWindow);
    getElement(DOM_IDS.CLOSE_PASTE_WINDOW_BTN)?.addEventListener('click', handleClosePasteWindow);
    getElement(DOM_IDS.PARSE_STATS_BTN)?.addEventListener('click', handleParseStats);
    getElement(DOM_IDS.PARSE_CLIPBOARD_BTN)?.addEventListener('click', handleParseClipboard);
}

// --- Skill Table Logic ---

/**
 * Creates a table row for a skill and its traits.
 * @param {number} index - The row index.
 * @returns {HTMLTableRowElement} The created table row.
 */
export function createSkillTableRow(index) {
    const tr = document.createElement("tr");

    const tdSkill = document.createElement("td");
    const selectSkill = document.createElement("select");
    selectSkill.id = `skill-${index}`;
    selectSkill.name = "skillSelect";
    tdSkill.appendChild(selectSkill);
    tr.appendChild(tdSkill);

    const tdTrait = document.createElement("td");
    const selectTrait = document.createElement("select");
    selectTrait.id = `trait-${index}`;
    selectTrait.setAttribute("multiple", "multiple"); // Ensure multiple attribute is set
    tdTrait.appendChild(selectTrait);
    tr.appendChild(tdTrait);

    // Initialize SlimSelect for skill and trait dropdowns
    selectSkill.slim = initializeSlimSelect(
        selectSkill,
        'Select a skill', // More user-friendly placeholder
        true, // Allow search for skills
        false, // Not multiple
        (info) => {
            fillTraits(info[0].data.weaponType, info[0].data.guid, index)
            SkillCalcNew(info[0].value, index)
        }
    );

    selectTrait.slim = initializeSlimSelect(
        selectTrait,
        'Select traits', // More user-friendly placeholder
        true, // Allow search for traits
        true, // Allow multiple traits
        (info) => console.log(`Trait ${index + 1} changed`, info)
    );

    ["dmg-percent", "dmg-flat", "max-dmg", "avg-dmg", "cooldown", "animlock"].forEach(field => {
        const td = document.createElement("td");
        td.id = `${field}-${index}`;
        td.textContent = "-";
        tr.appendChild(td);
    });

    return tr;
}

/**
 * Injects skill table rows into the DOM.
 */
export function injectSkillTable() {
    const tbody = getElement(DOM_IDS.SKILL_TABLE_TBODY);

    // Prevent regeneration if already generated
    if (!tbody || tbody.dataset.generated === "true") {
        console.warn("Skill table already generated or tbody not found.");
        return;
    }

    // Use a DocumentFragment for efficient DOM manipulation
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 12; i++) {
        fragment.appendChild(createSkillTableRow(i));
    }
    tbody.appendChild(fragment);

    // Mark as generated to prevent future calls
    tbody.dataset.generated = "true";
    console.log("✅ Skill table injected and SlimSelects initialized.");
}