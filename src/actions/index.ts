import { Action } from "../skalgen";
import { createFates, makeChoice } from "../utils/fates";

export const doNothing: Action = {
  name: "do_nothing",
  checker: (storyPoint) => true,
  effect: (now, agent, seed) => {
    return [
      {
        ...now
      },
      `${agent.name} did nothing.`
    ];
  }
};

export const findArtefact: Action = {
  name: "find_artefact",
  checker: (storyPoint) => storyPoint.artefacts.length > 0,
  effect: (now, agent, seed) => {
    const fate = createFates(seed);
    const artefact = makeChoice(fate, now.artefacts);

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
      `${agent.name} found the artefact ${artefact.name}`
    ];
  }
};
