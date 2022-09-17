"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeArtefactFromAgent = exports.changeAgentResource = exports.reviveAgent = exports.killAgent = void 0;
const killAgent = (s, agent) => (Object.assign(Object.assign({}, s), { agents: s.agents.map((_agent) => {
        if (agent.id === _agent.id) {
            return Object.assign(Object.assign({}, agent), { dead: true });
        }
        else
            return _agent;
    }) }));
exports.killAgent = killAgent;
const reviveAgent = (s, agent) => (Object.assign(Object.assign({}, s), { agents: s.agents.map((_agent) => {
        if (agent.id === _agent.id) {
            return Object.assign(Object.assign({}, agent), { dead: false });
        }
        else
            return _agent;
    }) }));
exports.reviveAgent = reviveAgent;
const changeAgentResource = (s, agent, resource, change) => {
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
