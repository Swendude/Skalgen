"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeChoice = exports.makeChoices = exports.createFates = void 0;
const rand_seed_1 = __importDefault(require("rand-seed"));
const createFates = (seed) => {
    const fate = new rand_seed_1.default(seed.toString());
    return (max) => {
        return (Math.floor(fate.next() * (max !== undefined ? max : Number.MAX_VALUE)) + 1);
    };
};
exports.createFates = createFates;
const makeChoices = (fate, options, amount) => {
    let seen = [];
    return Array.from({ length: amount }, () => {
        let choice = fate(options.length) - 1;
        while (seen.includes(choice)) {
            choice = fate(options.length) - 1;
        }
        seen.push(choice);
        if (seen.length === options.length) {
            seen = [];
        }
        return options[choice];
    });
};
exports.makeChoices = makeChoices;
const makeChoice = (fate, options) => {
    let choice = fate(options.length) - 1;
    return options[choice];
};
exports.makeChoice = makeChoice;
// let n = 1000000;
// const results = {} as { [key: number]: number };
// while (n > 0) {
//   const choice = fates(18);
//   //   console.log(choice);
//   if (results[choice] !== undefined) {
//     results[choice] += 1;
//   } else {
//     results[choice] = 0;
//   }
//   n--;
// }
// console.log(results);
// for (const [key, value] of Object.entries(results)) {
//   console.log(`${key}: ${".".repeat(value / 1000)}`);
// }
