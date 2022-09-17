"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderStory = exports.showCollections = exports.capitalize = void 0;
const kleur_1 = __importDefault(require("kleur"));
const capitalize = (inp) => `${inp[0].toUpperCase()}${inp.slice(1)}`;
exports.capitalize = capitalize;
const showCollections = (inp) => inp.map((e) => e.show(e)).map((t) => `\n\t - ${t}`);
exports.showCollections = showCollections;
const renderStory = (s, point) => {
    const currentPointI = point || s.storyPoints.length - 1;
    const [currentPoint, currentLog] = s.storyPoints[currentPointI];
    console.log(kleur_1.default.red().underline(`-StoryPoint ${currentPointI} --------------------`));
    console.log(kleur_1.default.red().bold(currentLog));
    console.log(kleur_1.default.green().bold(`\n Agents:`));
    currentPoint.agents.forEach((agent) => {
        console.log(`    ${kleur_1.default.green().bold(agent.name)}`);
        agent.inventory.forEach((item) => {
            console.log(`        ${kleur_1.default.blue(item.name)}`);
        });
    });
    console.log(kleur_1.default.blue().bold(`\n Artefacts to be discovered:`));
    currentPoint.artefacts.forEach((artefact) => {
        console.log(`    ${kleur_1.default.blue().bold(artefact.name)}`);
    });
    console.log(kleur_1.default.red().underline(`----------------------------------`));
};
exports.renderStory = renderStory;
