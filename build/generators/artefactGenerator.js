"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fates_1 = require("../utils/fates");
const artefactActions_1 = require("../actions/artefactActions");
const _prefixs = [
    "Ancient",
    "Magical",
    "Cursed",
    "Blessed",
    "Weird",
    "Demonic",
    "Alchemic",
    "Mysterious"
];
const _suffixs = [
    "Dagger 🗡",
    "Candle 🕯",
    "Cauldron 🍯",
    "Mantle 🧥",
    "Banjo 🪕",
    "Pickaxe ⛏",
    "Wand 🪄",
    "Mirror 🪞",
    "Shoes 👞",
    "Quill 🪶",
    "Tablet 🪨",
    "Sword 🗡",
    "Amulet 🧿",
    "Ring 💍",
    "Egg 🥚",
    "Scroll 📜",
    "Tome 📖"
];
const actionOptions = [artefactActions_1.killOtherAgent, artefactActions_1.reviveOtherAgent, artefactActions_1.gainMight];
const artefactGenerator = (seed) => {
    let fate = (0, fates_1.createFates)(seed);
    const pfixs = (0, fates_1.makeChoice)(fate, _prefixs);
    const sfixs = (0, fates_1.makeChoice)(fate, _suffixs);
    return {
        id: fate(),
        name: `${pfixs} ${sfixs}`,
        usage: {
            knowledge_requirement: fate(3),
            action: (0, fates_1.makeChoice)(fate, actionOptions)
        }
    };
};
exports.default = artefactGenerator;
