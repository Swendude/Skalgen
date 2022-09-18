import agentGenerator from "../generators/agentGenerator";
import { Story, Agent, StoryPoint, Artefact } from "../skalgen";
import artefactGenerator from "../generators/artefactGenerator";
import { pipe } from "ramda";
import { createFates } from "../utils/fates";
import {
  findArtefact,
  useArtefact,
  study,
  politics,
  train,
  smear
} from "../actions/agentActions";
import {
  changeAgentResource,
  giveArtefactToAgent,
  killAgent,
  removeArtefactFromAgent,
  removeArtefactFromDiscover,
  reviveAgent
} from ".";
const testSeed = 42;

const generateAgent = (id: number): Agent => ({
  id: id,
  name: `Agent ${id}`,
  inventory: [],
  dead: false,
  resources: {
    might: 0,
    knowledge: 0,
    influence: 0
  }
});

const generateArtefact = (id: number): Artefact => ({
  id: id,
  name: `Artefact ${id}`,
  usage: {
    knowledge_requirement: 0,
    action: {
      name: "do_nothing",
      checker: () => true,
      postfix: "of Nothingness",
      effect: (seed, now, agent, artefact) => [
        now,
        `${agent.id} used Artefact ${id}`
      ]
    }
  }
});

const generateStoryPoint = (): StoryPoint => ({
  agents: [1, 2, 3].map((i) => generateAgent(i)),
  artefacts: [1, 2, 3, 4, 5].map((i) => generateArtefact(i)),
  facts: []
});

describe("testing killAgent manipulator", () => {
  test("the first point has three agents alive", () => {
    const now = generateStoryPoint();
    expect(now.agents.filter((agent) => !agent.dead).length).toEqual(3);
  }),
    test("using killAgent should kill an agent", () => {
      const now = generateStoryPoint();

      const after = killAgent(now.agents[0])(now);
      expect(after.agents.filter((agent) => !agent.dead).length).toEqual(2);
    });
});

describe("testing reviveAgent manipulator", () => {
  test("using reviveAgent should revive an agent", () => {
    const now = generateStoryPoint();

    const afterKill = killAgent(now.agents[0])(now);
    expect(
      afterKill.agents.filter((agent: Agent) => !agent.dead).length
    ).toEqual(2);

    const afterRev = reviveAgent(afterKill.agents[0])(now);
    expect(afterRev.agents.filter((agent) => !agent.dead).length).toEqual(3);
  });
});

describe("testing changeAgentResource manipulator", () => {
  test("using changeAgentResource should change an agent resource", () => {
    const now = generateStoryPoint();
    expect(now.agents[0].resources.knowledge).toEqual(0);

    const afterChange = changeAgentResource(now.agents[0], "knowledge", 1)(now);
    expect(afterChange.agents[0].resources.knowledge).toEqual(1);
  }),
    test("using changeAgentResource should never change an agent resource above 3", () => {
      const now = generateStoryPoint();
      expect(now.agents[0].resources.knowledge).toEqual(0);

      const afterPosChange = pipe(
        changeAgentResource(now.agents[0], "knowledge", 2),
        changeAgentResource(now.agents[0], "knowledge", 8)
      )(now);
      expect(afterPosChange.agents[0].resources.knowledge).toEqual(3);

      const afterNegChange = pipe(
        changeAgentResource(now.agents[0], "knowledge", -1),
        changeAgentResource(now.agents[0], "knowledge", -52)
      )(now);
      expect(afterNegChange.agents[0].resources.knowledge).toEqual(-3);
    });
});

describe("testing removeArtefactFromAgent manipulator", () => {
  test("using removeArtefactFromAgent should remove an artefact from agent", () => {
    const now = generateStoryPoint();
    expect(now.agents[0].inventory.length).toEqual(0);
    const newArtefact = generateArtefact(16);
    now.agents[0].inventory = [newArtefact];
    const afterChange = removeArtefactFromAgent(
      now.agents[0],
      newArtefact
    )(now);
    expect(afterChange.agents[0].inventory.length).toEqual(0);
  });
});

describe("testing giveArtefactToAgent manipulator", () => {
  test("using giveArtefactToAgent should give an artefact to agent", () => {
    const now = generateStoryPoint();
    expect(now.agents[0].inventory.length).toEqual(0);
    const newArtefact = generateArtefact(16);
    const afterChange = giveArtefactToAgent(now.agents[0], newArtefact)(now);
    expect(afterChange.agents[0].inventory.length).toEqual(1);
    expect(afterChange.agents[0].inventory[0]).toEqual(newArtefact);
  });
});

describe("testing removeArtefactFromDiscover manipulator", () => {
  test("using giveArtefactToAgent should remove an artefact from discover", () => {
    const now = generateStoryPoint();
    expect(now.artefacts.length).toEqual(5);
    console.log(now.artefacts);

    const afterChange = removeArtefactFromDiscover(now.artefacts[1])(now);
    console.log(afterChange.artefacts);
    expect(afterChange.artefacts.length).toEqual(4);
  });
});
