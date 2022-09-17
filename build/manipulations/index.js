"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeArtefactFromAgent = exports.changeAgentResource = void 0;
const changeAgentResource = (s, agent, resource, change) => {
    return Object.assign(Object.assign({}, s), { agents: s.agents.map((_agent) => {
            if (_agent.id === agent.id) {
                return Object.assign(Object.assign({}, _agent), { resources: Object.assign(Object.assign({}, _agent.resources), { [resource]: _agent.resources[resource] + change }) });
            }
            else {
                return _agent;
            }
        }) });
};
exports.changeAgentResource = changeAgentResource;
const removeArtefactFromAgent = (s, agent, artefact) => {
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
