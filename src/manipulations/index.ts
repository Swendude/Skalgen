import {
  Artefact,
  StoryPoint,
  Agent,
  ResourceVal,
  ResourceT
} from "../skalgen";

export const killAgent = (s: StoryPoint, agent: Agent) => ({
  ...s,
  agents: s.agents.map((_agent) => {
    if (agent.id === _agent.id) {
      return { ...agent, dead: true };
    } else return _agent;
  })
});

export const reviveAgent = (s: StoryPoint, agent: Agent) => ({
  ...s,
  agents: s.agents.map((_agent) => {
    if (agent.id === _agent.id) {
      return { ...agent, dead: false };
    } else return _agent;
  })
});

export const changeAgentResource = (
  s: StoryPoint,
  agent: Agent,
  resource: ResourceT,
  change: number
) => {
  return {
    ...s,
    agents: s.agents.map((_agent) => {
      const newResourceVal = _agent.resources[resource] + change;
      if (_agent.id === agent.id) {
        return {
          ..._agent,
          resources: {
            ..._agent.resources,
            [resource]:
              newResourceVal < 0 ? 0 : newResourceVal > 3 ? 3 : newResourceVal
          }
        };
      } else {
        return _agent;
      }
    })
  } as StoryPoint;
};

export const removeArtefactFromAgent = (
  s: StoryPoint,
  agent: Agent,
  artefact: Artefact
) => {
  return {
    ...s,
    agents: s.agents.map((_agent) => {
      if (_agent.id === agent.id) {
        return {
          ..._agent,
          inventory: _agent.inventory.filter(
            (_artefact) => _artefact.id !== artefact.id
          )
        };
      } else {
        return _agent;
      }
    })
  };
};
