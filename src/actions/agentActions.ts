import { pipe } from "ramda";
import {
  changeAgentResource,
  giveArtefactToAgent,
  removeArtefactFromDiscover
} from "../manipulators/manipulators";
import { AgentAction } from "../skalgen";
import { createFates, makeChoice } from "../utils/fates";
import { renderAgent, renderArtefact } from "../utils/text";
import { notMe } from "../utils/utils";

export const study: AgentAction = {
  name: "study",
  checker: (storyPoint, agent) => agent.resources.knowledge < 3,
  effect: (seed, now, agent) => [
    changeAgentResource(agent, "knowledge", 1)(now),
    `${renderAgent(agent)} delved into ancient tomes to discover knowledge`
  ]
};

export const spy: AgentAction = {
  name: "spy",
  checker: (storyPoint, agent) => notMe(agent, storyPoint.agents).length > 0,
  effect: (seed, now, agent) => {
    const fate = createFates(seed);
    const chosenTarget = makeChoice(fate, now.agents);
    const [myRoll, theirRoll] = [
      fate(10) + agent.resources.might,
      fate(10) + agent.resources.might
    ];
    if (myRoll > theirRoll) {
      return [
        changeAgentResource(chosenTarget, "knowledge", -1)(now),
        `${renderAgent(
          agent
        )} used his spies to infiltrate and reduce the knowledge of ${renderAgent(
          chosenTarget
        )}`
      ];
    } else {
      return [
        changeAgentResource(agent, "knowledge", -1)(now),
        `${renderAgent(agent)} failed to spy on ${renderAgent(
          chosenTarget
        )} and lost knowledge`
      ];
    }
  }
};

export const train: AgentAction = {
  name: "train",
  checker: (storyPoint, agent) => agent.resources.might < 3,
  effect: (seed, now, agent) => [
    changeAgentResource(agent, "might", 1)(now),
    `${renderAgent(agent)} studied the art of battle`
  ]
};

export const assault: AgentAction = {
  name: "assault",
  checker: (storyPoint, agent) => notMe(agent, storyPoint.agents).length > 0,
  effect: (seed, now, agent) => {
    const fate = createFates(seed);
    const chosenTarget = makeChoice(fate, now.agents);
    const [myRoll, theirRoll] = [
      fate(10) + agent.resources.might,
      fate(10) + agent.resources.might
    ];
    if (myRoll > theirRoll) {
      return [
        changeAgentResource(chosenTarget, "might", -1)(now),
        `${renderAgent(
          agent
        )} used his armies to assault and reduce the might of ${renderAgent(
          chosenTarget
        )}`
      ];
    } else {
      return [
        changeAgentResource(agent, "might", -1)(now),
        `${renderAgent(agent)} failed to assault ${renderAgent(
          chosenTarget
        )} and lost might`
      ];
    }
  }
};

export const politics: AgentAction = {
  name: "politics",
  checker: (storyPoint, agent) => agent.resources.influence < 3,
  effect: (seed, now, agent) => [
    changeAgentResource(agent, "influence", 1)(now),
    `${renderAgent(agent)} convinced the population of their achievements`
  ]
};

export const smear: AgentAction = {
  name: "smear",
  checker: (storyPoint, agent) => notMe(agent, storyPoint.agents).length > 0,
  effect: (seed, now, agent) => {
    const fate = createFates(seed);
    const chosenTarget = makeChoice(fate, now.agents);
    const [myRoll, theirRoll] = [
      fate(10) + agent.resources.influence,
      fate(10) + agent.resources.influence
    ];
    if (myRoll > theirRoll) {
      return [
        changeAgentResource(chosenTarget, "influence", -1)(now),
        `${renderAgent(agent)} reduced the influence of ${renderAgent(
          chosenTarget
        )}`
      ];
    } else {
      return [
        changeAgentResource(agent, "influence", -1)(now),
        `${renderAgent(agent)} failed to smear ${renderAgent(
          chosenTarget
        )} and lost influence`
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
      pipe(
        giveArtefactToAgent(agent, artefact),
        removeArtefactFromDiscover(artefact)
      )(now),
      `${renderAgent(agent)} found the artefact ${renderArtefact(artefact)}`
    ];
  }
};
