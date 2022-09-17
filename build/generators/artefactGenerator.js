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
const _names = [
    ["Dagger", "🗡"],
    ["Candle", "🕯"],
    ["Cauldron", "🍯"],
    ["Mantle", "🧥"],
    ["Banjo", "🪕"],
    ["Pickaxe", "⛏"],
    ["Wand", "🪄"],
    ["Mirror", "🪞"],
    ["Shoes", "👞"],
    ["Quill", "🪶"],
    ["Tablet", "🪨"],
    ["Sword", "🗡"],
    ["Amulet", "🧿"],
    ["Ring", "💍"],
    ["Egg", "🥚"],
    ["Scroll", "📜"],
    ["Tome", "📖"]
];
const actionOptions = [artefactActions_1.killOtherAgent, artefactActions_1.reviveOtherAgent, artefactActions_1.gainMight];
const artefactGenerator = (seed) => {
    let fate = (0, fates_1.createFates)(seed);
    const chosenAction = (0, fates_1.makeChoice)(fate, actionOptions);
    const pfixs = (0, fates_1.makeChoice)(fate, _prefixs);
    const [name, icon] = (0, fates_1.makeChoice)(fate, _names);
    const sfix = chosenAction.postfix;
    return {
        id: fate(),
        name: `${pfixs} ${name} ${sfix} ${icon}`,
        usage: {
            knowledge_requirement: fate(3),
            action: chosenAction
        }
    };
};
exports.default = artefactGenerator;
