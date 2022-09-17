"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findArtefact = exports.useArtefact = exports.study = exports.doNothing = void 0;
const fates_1 = require("../utils/fates");
const text_1 = require("../utils/text");
exports.doNothing = {
    name: "do_nothing",
    checker: (storyPoint) => true,
    effect: (seed, now, agent) => {
        return [
            Object.assign({}, now),
            `${(0, text_1.renderAgent)(agent)} did nothing.`
        ];
    }
};
exports.study = {
    name: "study",
    checker: (storyPoint, agent) => agent.resources.knowledge < 3,
    effect: (seed, now, agent) => [
        Object.assign(Object.assign({}, now), { agents: now.agents.map((_agent) => {
                if (_agent.id === agent.id) {
                    return Object.assign(Object.assign({}, _agent), { resources: Object.assign(Object.assign({}, _agent.resources), { knowledge: (_agent.resources.knowledge + 1) }) });
                }
                else {
                    return _agent;
                }
            }) }),
        `${(0, text_1.renderAgent)(agent)} delved into ancient tomes to discover knowledge`
    ]
};
exports.useArtefact = {
    name: "use_artefact",
    checker: (storyPoint, agent) => agent.inventory.length > 0,
    effect: (seed, now, agent) => {
        const fate = (0, fates_1.createFates)(seed);
        const chosenArtefact = (0, fates_1.makeChoice)(fate, agent.inventory);
        if (chosenArtefact.usage.action.checker(now, agent, chosenArtefact)) {
            return chosenArtefact.usage.action.effect(fate(), now, agent, chosenArtefact);
        }
        else {
            return [
                Object.assign({}, now),
                `${(0, text_1.renderAgent)(agent)} wanted to use ${(0, text_1.renderArtefact)(chosenArtefact)} but it didn't work`
            ];
        }
    }
};
exports.findArtefact = {
    name: "find_artefact",
    checker: (storyPoint) => storyPoint.artefacts.length > 0,
    effect: (seed, now, agent) => {
        const fate = (0, fates_1.createFates)(seed);
        const artefact = (0, fates_1.makeChoice)(fate, now.artefacts);
        if (agent.resources.knowledge <= artefact.usage.knowledge_requirement) {
            if (fate(10) > 6) {
                return [
                    Object.assign({}, now),
                    `${(0, text_1.renderAgent)(agent)} went looking for ${(0, text_1.renderArtefact)(artefact)} but lacked the knowledge to find it`
                ];
            }
        }
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
            `${(0, text_1.renderAgent)(agent)} found the artefact ${(0, text_1.renderArtefact)(artefact)}`
        ];
    }
};
