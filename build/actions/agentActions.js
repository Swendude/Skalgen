"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findArtefact = exports.useArtefact = exports.smear = exports.politics = exports.train = exports.study = void 0;
const manipulations_1 = require("../manipulations");
const fates_1 = require("../utils/fates");
const text_1 = require("../utils/text");
exports.study = {
    name: "study",
    checker: (storyPoint, agent) => agent.resources.knowledge < 3,
    effect: (seed, now, agent) => [
        (0, manipulations_1.changeAgentResource)(agent, "knowledge", 1, now),
        `${(0, text_1.renderAgent)(agent)} delved into ancient tomes to discover knowledge`
    ]
};
exports.train = {
    name: "train",
    checker: (storyPoint, agent) => agent.resources.might < 3,
    effect: (seed, now, agent) => [
        (0, manipulations_1.changeAgentResource)(agent, "might", 1, now),
        `${(0, text_1.renderAgent)(agent)} studied the art of battle`
    ]
};
exports.politics = {
    name: "politics",
    checker: (storyPoint, agent) => agent.resources.influence < 3,
    effect: (seed, now, agent) => [
        (0, manipulations_1.changeAgentResource)(agent, "influence", 1, now),
        `${(0, text_1.renderAgent)(agent)} convinced the population of their achievements`
    ]
};
exports.smear = {
    name: "smear",
    checker: (storyPoint, agent) => storyPoint.agents.filter((_agent) => _agent.id !== agent.id).length > 0,
    effect: (seed, now, agent) => {
        const fate = (0, fates_1.createFates)(seed);
        const chosenTarget = (0, fates_1.makeChoice)(fate, now.agents);
        const [myRoll, theirRoll] = [
            fate(10) + agent.resources.influence,
            fate(10) + agent.resources.influence
        ];
        if (myRoll > theirRoll) {
            return [
                (0, manipulations_1.changeAgentResource)(chosenTarget, "influence", -1, now),
                `${(0, text_1.renderAgent)(agent)} reduced the influence of ${(0, text_1.renderAgent)(chosenTarget)}`
            ];
        }
        else {
            return [
                Object.assign({}, now),
                `${(0, text_1.renderAgent)(agent)} failed to smear ${(0, text_1.renderAgent)(chosenTarget)}`
            ];
        }
    }
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
