import {
  Artefact,
  StoryPoint,
  Agent,
  ResourceVal,
  ResourceT
} from "../skalgen";
import { lens, prop, assoc, lensProp, lensPath } from "ramda";

const includesId = <T extends { id: number }>(
  itemId: number,
  items: T[]
): Boolean => {
  return items.filter((_item) => _item.id === itemId).length > 0;
};

const retrieveById = <T extends { id: number }>(
  itemId: number,
  items: T[]
): T | undefined => {
  return items.find((_item) => _item.id === itemId);
};

const retrieveByName = <T extends { name: string }>(
  itemName: string,
  items: T[]
): T | undefined => {
  return items.find((_item) => _item.name === itemName);
};

const killAgent = (agent: Agent, s: StoryPoint) => ({
  ...s,
  agents: s.agents.map((_agent) => {
    if (agent.id === _agent.id) {
      return { ...agent, dead: true };
    } else return _agent;
  })
});

const reviveAgent = (agent: Agent, s: StoryPoint) => ({
  ...s,
  agents: s.agents.map((_agent) => {
    if (agent.id === _agent.id) {
      return { ...agent, dead: false };
    } else return _agent;
  })
});

const changeAgentResource = (
  agent: Agent,
  resource: ResourceT,
  change: number,
  s: StoryPoint
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

const removeArtefactFromAgent = (
  agent: Agent,
  artefact: Artefact,
  s: StoryPoint
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

export {
  removeArtefactFromAgent,
  changeAgentResource,
  reviveAgent,
  killAgent,
  includesId,
  retrieveById,
  retrieveByName
};
