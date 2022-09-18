"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const testSeed = 42;
const generateAgent = (id) => ({
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
const generateArtefact = (id) => ({
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
const generateStoryPoint = () => ({
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
            const after = (0, _1.killAgent)(now.agents[0], now);
            expect(after.agents.filter((agent) => !agent.dead).length).toEqual(2);
        });
});
// const initialStory: Story = {
//   storyPoints: [[generateStoryPoint(), "first"]],
//   agentGen: agentGenerator,
//   artefactGen: artefactGenerator,
//   fate: createFates(testSeed),
//   seed: testSeed,
//   actions: [findArtefact, useArtefact, study, politics, train, smear]
// };
