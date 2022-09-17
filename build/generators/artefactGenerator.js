"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fates_1 = require("../utils/fates");
const _prefixs = [
    "ancient",
    "magical",
    "cursed",
    "blessed",
    "weird",
    "demonic"
];
const _suffixs = [
    "dagger 🗡",
    "tablet 🪨",
    "sword 🗡",
    "amulet 🧿",
    "ring 💍",
    "egg 🥚",
    "scroll 📜",
    "tome 📖"
];
const artefactGenerator = (seed) => {
    let fate = (0, fates_1.createFates)(seed);
    const pfixs = (0, fates_1.makeChoice)(fate, _prefixs);
    const sfixs = (0, fates_1.makeChoice)(fate, _suffixs);
    return { name: `the ${pfixs} ${sfixs}` };
};
exports.default = artefactGenerator;
