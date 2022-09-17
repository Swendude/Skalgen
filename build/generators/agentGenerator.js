"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fates_1 = require("../utils/fates");
const _face = ["😈", "🧝‍♀️", "🧝‍♂️", "🧙‍♂️", "👨‍🎨", "🧑‍🌾", "🧑‍🍳", "👩‍🎨", "🧑‍⚖️"];
const _names = ["roger", "bill", "joe", "gina", "leslie", "amalia"];
const _titles = [
    "swordmaster",
    "the bladesmith",
    "the cobbler",
    "the wise",
    "the blind",
    "the mad",
    "the wicked",
    "the ruler"
];
const agentGenerator = (seed) => {
    let fate = (0, fates_1.createFates)(seed);
    return {
        name: `${(0, fates_1.makeChoice)(fate, _face)} ${(0, fates_1.makeChoice)(fate, _names)} ${(0, fates_1.makeChoice)(fate, _titles)}`,
        inventory: []
    };
};
exports.default = agentGenerator;
