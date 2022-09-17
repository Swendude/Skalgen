import { changeAgentResource } from "../manipulations";
import { AgentAction, ResourceVal } from "../skalgen";
import { createFates, makeChoice } from "../utils/fates";
import { renderAgent, renderArtefact } from "../utils/text";

export const study: AgentAction = {
  name: "study",
  checker: (storyPoint, agent) => agent.resources.knowledge < 3,
  effect: (seed, now, agent) => [
    changeAgentResource(now, agent, "knowledge", 1),
    `${renderAgent(agent)} delved into ancient tomes to discover knowledge`
  ]
};

export const train: AgentAction = {
  name: "train",
  checker: (storyPoint, agent) => agent.resources.might < 3,
  effect: (seed, now, agent) => [
    changeAgentResource(now, agent, "might", 1),
    `${renderAgent(agent)} studied the art of battle`
  ]
};

export const politics: AgentAction = {
  name: "politics",
  checker: (storyPoint, agent) => agent.resources.influence < 3,
  effect: (seed, now, agent) => [
    changeAgentResource(now, agent, "influence", 1),
    `${renderAgent(agent)} convinced the population of their achievements`
  ]
};

export const smear: AgentAction = {
  name: "smear",
  checker: (storyPoint, agent) =>
    storyPoint.agents.filter((_agent) => _agent.id !== agent.id).length > 0,
  effect: (seed, now, agent) => {
    const fate = createFates(seed);
    const chosenTarget = makeChoice(fate, now.agents);
    const [myRoll, theirRoll] = [
      fate(10) + agent.resources.influence,
      fate(10) + agent.resources.influence
    ];
    if (myRoll > theirRoll) {
      return [
        changeAgentResource(now, chosenTarget, "influence", -1),
        `${renderAgent(agent)} reduced the influence of ${renderAgent(
          chosenTarget
        )}`
      ];
    } else {
      return [
        { ...now },
        `${renderAgent(agent)} failed to smear ${renderAgent(chosenTarget)}`
      ];
    }
  }
};

export const useArtefact: AgentAction = {
  name: "use_artefact",
  checker: (storyPoint, agent) => agent.inventory.length > 0,
  effect: (seed, now, agent) => {
    const fate = createFates(seed);
    const chosenArtefact = makeChoice(fate, agent.inventory);

    if (chosenArtefact.usage.action.checker(now, agent, chosenArtefact)) {
      return chosenArtefact.usage.action.effect(
        fate(),
        now,
        agent,
        chosenArtefact
      );
    } else {
      return [
        { ...now },
        `${renderAgent(agent)} wanted to use ${renderArtefact(
          chosenArtefact
        )} but it didn't work`
      ];
    }
  }
};

export const findArtefact: AgentAction = {
  name: "find_artefact",
  checker: (storyPoint) => storyPoint.artefacts.length > 0,
  effect: (seed, now, agent) => {
    const fate = createFates(seed);
    const artefact = makeChoice(fate, now.artefacts);
    if (agent.resources.knowledge <= artefact.usage.knowledge_requirement) {
      if (fate(10) > 6) {
        return [
          { ...now },
          `${renderAgent(agent)} went looking for ${renderArtefact(
            artefact
          )} but lacked the knowledge to find it`
        ];
      }
    }
    return [
      {
        ...now,
        artefacts: [...now.artefacts.filter((a) => a !== artefact)],
        agents: [
          ...now.agents.map((_agent) => {
            if (_agent.name === agent.name) {
              return {
                ...agent,
                inventory: [{ ...artefact }, ...agent.inventory]
              };
            } else {
              return _agent;
            }
          })
        ]
      },
      `${renderAgent(agent)} found the artefact ${renderArtefact(artefact)}`
    ];
  }
};
