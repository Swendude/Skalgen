"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showCollections = exports.capitalize = void 0;
const capitalize = (inp) => `${inp[0].toUpperCase()}${inp.slice(1)}`;
exports.capitalize = capitalize;
const showCollections = (inp) => inp.map((e) => e.show(e)).map((t) => `\n\t - ${t}`);
exports.showCollections = showCollections;
