import {
  Artefact,
  StoryPoint,
  Agent,
  ResourceVal,
  ResourceT
} from "../skalgen";

export const changeAgentResource = (
  s: StoryPoint,
  agent: Agent,
  resource: ResourceT,
  change: number
) => {
  return {
    ...s,
    agents: s.agents.map((_agent) => {
      if (_agent.id === agent.id) {
        return {
          ..._agent,
          resources: {
            ..._agent.resources,
            [resource]: _agent.resources[resource] + change
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
