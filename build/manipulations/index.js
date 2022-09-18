"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveByName = exports.retrieveById = exports.includesId = exports.killAgent = exports.reviveAgent = exports.changeAgentResource = exports.removeArtefactFromAgent = void 0;
const ramda_1 = require("ramda");
// UTILS
const includesId = (itemId, items) => {
    return items.filter((_item) => _item.id === itemId).length > 0;
};
exports.includesId = includesId;
const retrieveById = (itemId, items) => {
    return items.find((_item) => _item.id === itemId);
};
exports.retrieveById = retrieveById;
const retrieveByName = (itemName, items) => {
    return items.find((_item) => _item.name === itemName);
};
exports.retrieveByName = retrieveByName;
// LENSES 🔎
const agentDeadLens = (ix) => (0, ramda_1.lensPath)(["agents", ix, "dead"]);
const agentResourceLens = (ix, key) => (0, ramda_1.lensPath)(["agents", ix, "resources", key]);
const agentArtefactsLens = (agentIx) => (0, ramda_1.lensPath)(["agents", agentIx, "inventory"]);
// MANIPULATORS
const killAgent = (agent) => (s) => {
    const agentIx = (0, ramda_1.findIndex)((0, ramda_1.eqProps)("id", agent), s.agents);
    return (0, ramda_1.set)(agentDeadLens(agentIx), true, s);
};
exports.killAgent = killAgent;
const reviveAgent = (agent) => (s) => {
    const agentIx = (0, ramda_1.findIndex)((0, ramda_1.eqProps)("id", agent), s.agents);
    return (0, ramda_1.set)(agentDeadLens(agentIx), false, s);
};
exports.reviveAgent = reviveAgent;
const changeAgentResource = (agent, resource, change) => (s) => {
    const agentIx = (0, ramda_1.findIndex)((0, ramda_1.eqProps)("id", agent), s.agents);
    const result = (0, ramda_1.set)(agentResourceLens(agentIx, resource), (0, ramda_1.clamp)(-3, 3, (0, ramda_1.view)(agentResourceLens(agentIx, resource), s) + change), s);
    return result;
};
exports.changeAgentResource = changeAgentResource;
const removeArtefactFromAgent = (agent, artefact) => (s) => {
    const agentIx = (0, ramda_1.findIndex)((0, ramda_1.eqProps)("id", agent), s.agents);
    console.log(agentIx);
    console.log((0, ramda_1.view)(agentArtefactsLens(agentIx), s));
    return (0, ramda_1.set)(agentArtefactsLens(agentIx), (0, ramda_1.filter)((0, ramda_1.eqProps)("id", artefact), (0, ramda_1.view)(agentArtefactsLens(agentIx), s)), s);
};
exports.removeArtefactFromAgent = removeArtefactFromAgent;
