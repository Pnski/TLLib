import * as questlog from './questlog.js'
import * as itemParse from './itemParse.js'

console.log(".js loaded")

window.$docsify = window.$docsify || {};
window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook, vm) {
    hook.doneEach(async () => {
        const currentPage = vm.route.path;
        if (!currentPage.includes('/calculator/ql')) {
            return;
        }
        console.log("doing stuff")
        console.log(await questlog.getCharacter("TyphoonAndTheSilentFerocity"))
        console.log(await questlog.getSkills("TyphoonAndTheSilentFerocity"))
    });
});