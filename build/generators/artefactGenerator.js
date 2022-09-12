"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const text_1 = require("../utils/text");
const fates_1 = require("../utils/fates");
const _prefixs = ["ancient", "magical", "cursed", "blessed"];
const _suffixs = ["dagger", "tablet", "sword", "amulet", "ring"];
const artefactGenerator = (seed, amount) => {
    let fate = (0, fates_1.createFates)(seed);
    const pfixs = (0, fates_1.makeChoices)(fate, _prefixs, amount);
    const sfixs = (0, fates_1.makeChoices)(fate, _suffixs, amount);
    return Array.from({ length: amount }, (v, i) => ({
        name: `the ${pfixs[i]} ${sfixs[i]}`,
        show: (artefact) => `${(0, text_1.capitalize)(artefact.name)}`,
        usage: {}
    }));
};
exports.default = artefactGenerator;
