import { ArtefactAction } from "../skalgen";
import { createFates, makeChoice } from "../utils/fates";
import { renderAgent, renderArtefact } from "../utils/text";
import {
  changeAgentResource,
  killAgent,
  removeArtefactFromAgent,
  reviveAgent
} from "../manipulators/manipulators";
import { pipe } from "ramda";

export const killOtherAgent: ArtefactAction = {
  name: "kill_other_agent",
  postfix: "of Killing",
  checker: (s, agent) =>
    s.agents.filter((_agent) => _agent.id !== agent.id && !_agent.dead)
      .length !== 0,
  effect: (seed, now, agent, artefact) => {
    const fate = createFates(seed);
    const chosenTarget = makeChoice(
      fate,
      now.agents.filter((_agent) => _agent.id !== agent.id && !_agent.dead)
    );
    const myRoll = fate(10) + agent.resources.might;
    const theirRoll = fate(10) + agent.resources.might;

    if (theirRoll > myRoll) {
      return [
        removeArtefactFromAgent(agent, artefact)(now),
        `${renderAgent(
          agent
        )} failed to kill (${myRoll}-${theirRoll}) ${renderAgent(
          chosenTarget
        )}, destroyed ${renderArtefact(artefact)}!`
      ];
    }
    return [
      pipe(
        killAgent(chosenTarget),
        removeArtefactFromAgent(agent, artefact)
      )(now),
      `${renderAgent(agent)} killed ${renderAgent(
        chosenTarget
      )} using ${renderArtefact(artefact)}!`
    ];
  }
};

export const gainMight: ArtefactAction = {
  name: "gain_might",
  postfix: "of Might",
  checker: (s, agent) => agent.resources.might < 3,
  effect: (seed, now, agent, artefact) => {
    const fate = createFates(seed);
    if (fate(10) < 6) {
      return [
        removeArtefactFromAgent(agent, artefact)(now),
        `${renderAgent(agent)} tried to gain might by using ${renderArtefact(
          artefact
        )} but failed and destroyed the item`
      ];
    }
    return [
      pipe(
        changeAgentResource(agent, "might", 1),
        removeArtefactFromAgent(agent, artefact)
      )(now),
      `${renderAgent(agent)} gained might using ${renderArtefact(artefact)}!`
    ];
  }
};

export const reviveOtherAgent: ArtefactAction = {
  name: "revive_other_agent",
  postfix: "of Revification",
  checker: (s, agent) =>
    s.agents.filter((_agent) => _agent.id !== agent.id && _agent.dead)
      .length !== 0,
  effect: (seed, now, agent, artefact) => {
    const fate = createFates(seed);

    const chosenTarget = makeChoice(
      fate,
      now.agents.filter((_agent) => _agent.id !== agent.id && _agent.dead)
    );

    return [
      pipe(
        reviveAgent(chosenTarget),
        removeArtefactFromAgent(agent, artefact)
      )(now),
      `${renderAgent(agent)} revived ${renderAgent(chosenTarget)} using ${
        artefact.name
      }!`
    ];
  }
};
