// See https://observablehq.com/framework/config for documentation.
export default {
  // The app’s title; used in the sidebar and webpage titles.
  title: "TLLibrary",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages: [
    {
      name: "Articles",
      pages: [
        {name: "Loot Distribution", path: "/articles/lootdist"},
        {name: "Stats", path: "/articles/stats"}
      ]
    },{
      name: "Tables",
      pages: [
        {name: "Achievements", path: "/achievements"},
        {name: "Amitoi", path: "/amitoi"},
        {name: "Fishing", path: "/fishing"},
        {name: "Weapon Mastery Level", path: "/weapons/weaponMastery"},
      ]
    },{
      name: "Weapons",
      pages: [
        {name: "Bow", path: "/weapons/bow"},
        {name: "Crossbow", path: "/weapons/crossbow"},
        {name: "Dagger", path: "/weapons/dagger"},
        {name: "Orb", path: "/weapons/orb"},
        {name: "Spear", path: "/weapons/spear"},
        {name: "Staff", path: "/weapons/staff"},
        {name: "SnS", path: "/weapons/sword"},
        {name: "Greatsword", path: "/weapons/sword2h"},
        {name: "Wand", path: "/weapons/wand"},
      ]
    },{
      name: "Calculator",
      pages: [
        {name: "DPS Fileviewer", path: "/calc/viewfile"},
        {name: "Group Buff Calculator", path: "/calc/groupBuffs"},
        {name: "Skill Dmg Calculator", path: "/calc/dmgCalc"},
      ]
    },
  ],

  // Content to add to the head of the page, e.g. for a favicon:
  head: '<link rel="icon" href="https://assets.playnccdn.com/common/tl.ico" type="image/png" sizes="32x32">',

  // The path to the source root.
  root: "src",
  interpreters: {
    ".py": ["./.venv/Scripts/python"],
  },

  // Some additional configuration options and their defaults:
  theme: ["air","deep-space"],
  // header: "TnL Dps Stats", // what to show in the header (HTML)
  footer: `<a href="https://ko-fi.com/Q5Q4YAI3F" target="_blank"><img height="36" style="border:0px;height:36px;" src="https://storage.ko-fi.com/cdn/kofi2.png?v=3" border="0" alt="Buy Me a Coffee at ko-fi.com" /></a><a href="https://creativecommons.org/licenses/by-sa/4.0/deed.en">cc-by-sa-4.0</a>`,
  // sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  // search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  // preserveExtension: false, // drop .html from URLs
  // preserveIndex: false, // drop /index from URLs
};
