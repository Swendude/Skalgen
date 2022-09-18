import { Artefact, StoryPoint, Agent, ResourceK, Resources } from "../skalgen";
import {
  lensPath,
  set,
  indexOf,
  view,
  filter,
  eqProps,
  clamp,
  findIndex
} from "ramda";

// UTILS

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

// LENSES 🔎

const agentDeadLens = (ix: number) =>
  lensPath<StoryPoint, boolean>(["agents", ix, "dead"]);

const agentResourceLens = (ix: number, key: keyof Resources) =>
  lensPath<StoryPoint, number>(["agents", ix, "resources", key]);

const agentArtefactsLens = (agentIx: number) =>
  lensPath<StoryPoint, Artefact[]>(["agents", agentIx, "inventory"]);

// MANIPULATORS

const killAgent = (agent: Agent) => (s: StoryPoint) => {
  const agentIx = findIndex(eqProps("id", agent), s.agents);

  return set(agentDeadLens(agentIx), true, s);
};

const reviveAgent = (agent: Agent) => (s: StoryPoint) => {
  const agentIx = findIndex(eqProps("id", agent), s.agents);

  return set(agentDeadLens(agentIx), false, s);
};

const changeAgentResource =
  (agent: Agent, resource: ResourceK, change: number) => (s: StoryPoint) => {
    const agentIx = findIndex(eqProps("id", agent), s.agents);

    const result = set(
      agentResourceLens(agentIx, resource),
      clamp(-3, 3, view(agentResourceLens(agentIx, resource), s) + change),
      s
    );

    return result;
  };

const removeArtefactFromAgent =
  (agent: Agent, artefact: Artefact) => (s: StoryPoint) => {
    const agentIx = findIndex(eqProps("id", agent), s.agents);
    console.log(agentIx);
    console.log(view(agentArtefactsLens(agentIx), s));
    return set(
      agentArtefactsLens(agentIx),
      filter(eqProps("id", artefact), view(agentArtefactsLens(agentIx), s)),
      s
    );
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
