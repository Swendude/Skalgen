import { ArtefactAction } from "../skalgen";
import { createFates, makeChoice } from "../utils/fates";
import { renderAgent, renderArtefact } from "../utils/text";
import { changeAgentResource, removeArtefactFromAgent } from "../manipulations";
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

    return [
      {
        ...now,
        agents: now.agents.map((_agent) =>
          _agent.id === chosenTarget.id ? { ..._agent, dead: true } : _agent
        )
      },
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
        removeArtefactFromAgent(now, agent, artefact),
        `${renderAgent(agent)} tried to gain might by using ${renderArtefact(
          artefact
        )} but failed and destroyed the item`
      ];
    }
    return [
      removeArtefactFromAgent(
        changeAgentResource(now, agent, "might", 1),
        agent,
        artefact
      ),
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
      {
        ...now,
        agents: now.agents.map((_agent) =>
          _agent.id === chosenTarget.id ? { ..._agent, dead: false } : _agent
        )
      },
      `${renderAgent(agent)} revived ${renderAgent(chosenTarget)} using ${
        artefact.name
      }!`
    ];
  }
};
