"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showAgent = exports.showStory = void 0;
const text_1 = require("./utils/text");
const showStory = (story) => {
    const agents = story.agents.map((agent) => (0, exports.showAgent)(agent));
    let result = `Agents:\t${agents.join(", ")}`;
    return result;
};
exports.showStory = showStory;
const showAgent = (agent) => {
    return `${(0, text_1.capitalize)(agent.name)} the ${(0, text_1.capitalize)(agent.bioform)}`;
};
exports.showAgent = showAgent;
