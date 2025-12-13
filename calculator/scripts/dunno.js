import * as questlog from './questlog.js';

let itemParse = {}

function callMain() {
    console.log(itemParse.getMainStats("feet_fabric_aa_t2_set_002"))
}


console.log(".js loaded");

window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {

/*     hook.ready(() => {
        console.log("Docsify ready:", vm.route.path);
    }); */

    // Fires after each page is loaded/rendered
    hook.doneEach(async () => {

        if (!vm.route.path.includes('/calculator/ql')) return;

        console.log("doing stuff...");

        // lazy import here (so it's only loaded if needed)
        itemParse = await import('./itemParse.js');

        console.log(await questlog.getCharacter("TyphoonAndTheSilentFerocity"));
        console.log(await questlog.getSkills("TyphoonAndTheSilentFerocity"));

    });
});