import { AgentAction, ResourceVal } from "../skalgen";
import { createFates, makeChoice } from "../utils/fates";
import { renderAgent, renderArtefact } from "../utils/text";

export const doNothing: AgentAction = {
  name: "do_nothing",
  checker: (storyPoint) => true,
  effect: (seed, now, agent) => {
    return [
      {
        ...now
      },
      `${renderAgent(agent)} did nothing.`
    ];
  }
};

export const study: AgentAction = {
  name: "study",
  checker: (storyPoint, agent) => agent.resources.knowledge < 3,
  effect: (seed, now, agent) => [
    {
      ...now,
      agents: now.agents.map((_agent) => {
        if (_agent.id === agent.id) {
          return {
            ..._agent,
            resources: {
              ..._agent.resources,
              knowledge: (_agent.resources.knowledge + 1) as ResourceVal
            }
          };
        } else {
          return _agent;
        }
      })
    },
    `${renderAgent(agent)} delved into ancient tomes to discover knowledge`
  ]
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
