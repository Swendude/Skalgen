"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviveOtherAgent = exports.gainMight = exports.killOtherAgent = void 0;
const fates_1 = require("../utils/fates");
const text_1 = require("../utils/text");
const manipulations_1 = require("../manipulations");
exports.killOtherAgent = {
    name: "kill_other_agent",
    postfix: "of Killing",
    checker: (s, agent) => s.agents.filter((_agent) => _agent.id !== agent.id && !_agent.dead)
        .length !== 0,
    effect: (seed, now, agent, artefact) => {
        const fate = (0, fates_1.createFates)(seed);
        const chosenTarget = (0, fates_1.makeChoice)(fate, now.agents.filter((_agent) => _agent.id !== agent.id && !_agent.dead));
        return [
            Object.assign(Object.assign({}, now), { agents: now.agents.map((_agent) => _agent.id === chosenTarget.id ? Object.assign(Object.assign({}, _agent), { dead: true }) : _agent) }),
            `${(0, text_1.renderAgent)(agent)} killed ${(0, text_1.renderAgent)(chosenTarget)} using ${(0, text_1.renderArtefact)(artefact)}!`
        ];
    }
};
exports.gainMight = {
    name: "gain_might",
    postfix: "of Might",
    checker: (s, agent) => agent.resources.might < 3,
    effect: (seed, now, agent, artefact) => {
        const fate = (0, fates_1.createFates)(seed);
        if (fate(10) < 6) {
            return [
                (0, manipulations_1.removeArtefactFromAgent)(now, agent, artefact),
                `${(0, text_1.renderAgent)(agent)} tried to gain might by using ${(0, text_1.renderArtefact)(artefact)} but failed and destroyed the item`
            ];
        }
        return [
            (0, manipulations_1.removeArtefactFromAgent)((0, manipulations_1.changeAgentResource)(now, agent, "might", 1), agent, artefact),
            `${(0, text_1.renderAgent)(agent)} gained might using ${(0, text_1.renderArtefact)(artefact)}!`
        ];
    }
};
exports.reviveOtherAgent = {
    name: "revive_other_agent",
    postfix: "of Revification",
    checker: (s, agent) => s.agents.filter((_agent) => _agent.id !== agent.id && _agent.dead)
        .length !== 0,
    effect: (seed, now, agent, artefact) => {
        const fate = (0, fates_1.createFates)(seed);
        const chosenTarget = (0, fates_1.makeChoice)(fate, now.agents.filter((_agent) => _agent.id !== agent.id && _agent.dead));
        return [
            Object.assign(Object.assign({}, now), { agents: now.agents.map((_agent) => _agent.id === chosenTarget.id ? Object.assign(Object.assign({}, _agent), { dead: false }) : _agent) }),
            `${(0, text_1.renderAgent)(agent)} revived ${(0, text_1.renderAgent)(chosenTarget)} using ${artefact.name}!`
        ];
    }
};