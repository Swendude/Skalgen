"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fates_1 = require("../utils/fates");
const firstnames_json_1 = __importDefault(require("./seeds/firstnames.json"));
const surnames_json_1 = __importDefault(require("./seeds/surnames.json"));
const jobnames_json_1 = __importDefault(require("./seeds/jobnames.json"));
const agentGenerator = (seed) => {
    let fate = (0, fates_1.createFates)(seed);
    return {
        id: fate(),
        name: `${(0, fates_1.makeChoice)(fate, firstnames_json_1.default)} ${(0, fates_1.makeChoice)(fate, surnames_json_1.default)} the ${(0, fates_1.makeChoice)(fate, jobnames_json_1.default)}`,
        inventory: [],
        dead: false,
        resources: {
            knowledge: 0,
            influence: 0,
            might: 0
        }
    };
};
exports.default = agentGenerator;
