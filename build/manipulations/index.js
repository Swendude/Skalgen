"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveByName = exports.retrieveById = exports.includesId = exports.killAgent = exports.reviveAgent = exports.changeAgentResource = exports.removeArtefactFromAgent = void 0;
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
const killAgent = (agent, s) => (Object.assign(Object.assign({}, s), { agents: s.agents.map((_agent) => {
        if (agent.id === _agent.id) {
            return Object.assign(Object.assign({}, agent), { dead: true });
        }
        else
            return _agent;
    }) }));
exports.killAgent = killAgent;
const reviveAgent = (agent, s) => (Object.assign(Object.assign({}, s), { agents: s.agents.map((_agent) => {
        if (agent.id === _agent.id) {
            return Object.assign(Object.assign({}, agent), { dead: false });
        }
        else
            return _agent;
    }) }));
exports.reviveAgent = reviveAgent;
const changeAgentResource = (agent, resource, change, s) => {
    return Object.assign(Object.assign({}, s), { agents: s.agents.map((_agent) => {
            const newResourceVal = _agent.resources[resource] + change;
            if (_agent.id === agent.id) {
                return Object.assign(Object.assign({}, _agent), { resources: Object.assign(Object.assign({}, _agent.resources), { [resource]: newResourceVal < 0 ? 0 : newResourceVal > 3 ? 3 : newResourceVal }) });
            }
            else {
                return _agent;
            }
        }) });
};
exports.changeAgentResource = changeAgentResource;
const removeArtefactFromAgent = (agent, artefact, s) => {
    return Object.assign(Object.assign({}, s), { agents: s.agents.map((_agent) => {
            if (_agent.id === agent.id) {
                return Object.assign(Object.assign({}, _agent), { inventory: _agent.inventory.filter((_artefact) => _artefact.id !== artefact.id) });
            }
            else {
                return _agent;
            }
        }) });
};
exports.removeArtefactFromAgent = removeArtefactFromAgent;
