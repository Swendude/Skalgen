"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
const incr = (x) => x + 1;
const pow = (0, ramda_1.curry)((y, x) => Math.pow(x, y));
const bla = (x) => "Bla".repeat(x);
console.log((0, ramda_1.pipe)(incr, pow(2), bla)(5));
