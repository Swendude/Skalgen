"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findArtefact = exports.doNothing = void 0;
const fates_1 = require("../utils/fates");
exports.doNothing = {
    name: "do_nothing",
    checker: (storyPoint) => true,
    effect: (now, agent, seed) => {
        return [
            Object.assign({}, now),
            `${agent.name} did nothing.`
        ];
    }
};
exports.findArtefact = {
    name: "find_artefact",
    checker: (storyPoint) => storyPoint.artefacts.length > 0,
    effect: (now, agent, seed) => {
        const fate = (0, fates_1.createFates)(seed);
        const artefact = (0, fates_1.makeChoice)(fate, now.artefacts);
        return [
            Object.assign(Object.assign({}, now), { artefacts: [...now.artefacts.filter((a) => a !== artefact)], agents: [
                    ...now.agents.map((_agent) => {
                        if (_agent.name === agent.name) {
                            return Object.assign(Object.assign({}, agent), { inventory: [Object.assign({}, artefact), ...agent.inventory] });
                        }
                        else {
                            return _agent;
                        }
                    })
                ] }),
            `${agent.name} found the artefact ${artefact.name}`
        ];
    }
};
