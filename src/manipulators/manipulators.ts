import { Artefact, StoryPoint, Agent, ResourceK, Resources } from "../skalgen";
import { lensPath, set, view, eqProps, clamp, findIndex, reject } from "ramda";

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

type Manipulator = (...args: any[]) => (s: StoryPoint) => StoryPoint;

const killAgent: Manipulator = (agent: Agent) => (s: StoryPoint) => {
  const agentIx = findIndex(eqProps("id", agent), s.agents);

  return set(agentDeadLens(agentIx), true, s);
};

const reviveAgent: Manipulator = (agent: Agent) => (s: StoryPoint) => {
  const agentIx = findIndex(eqProps("id", agent), s.agents);

  return set(agentDeadLens(agentIx), false, s);
};

const changeAgentResource: Manipulator =
  (agent: Agent, resource: ResourceK, change: number) => (s: StoryPoint) => {
    const agentIx = findIndex(eqProps("id", agent), s.agents);

    const result = set(
      agentResourceLens(agentIx, resource),
      clamp(-3, 3, view(agentResourceLens(agentIx, resource), s) + change),
      s
    );

    return result;
  };

const removeArtefactFromAgent: Manipulator =
  (agent: Agent, artefact: Artefact) => (s: StoryPoint) => {
    const agentIx = findIndex(eqProps("id", agent), s.agents);
    return set(
      agentArtefactsLens(agentIx),
      reject(eqProps("id", artefact), view(agentArtefactsLens(agentIx), s)),
      s
    );
  };

const giveArtefactToAgent: Manipulator =
  (agent: Agent, artefact: Artefact) => (s: StoryPoint) => {
    const agentIx = findIndex(eqProps("id", agent), s.agents);
    return set(
      agentArtefactsLens(agentIx),
      [...view(agentArtefactsLens(agentIx), s), artefact],
      s
    );
  };

const removeArtefactFromDiscover: Manipulator =
  (artefact: Artefact) => (s: StoryPoint) => {
    return { ...s, artefacts: reject(eqProps("id", artefact), s.artefacts) };
  };

export {
  removeArtefactFromAgent,
  giveArtefactToAgent,
  changeAgentResource,
  reviveAgent,
  killAgent,
  includesId,
  retrieveById,
  retrieveByName,
  removeArtefactFromDiscover
};
