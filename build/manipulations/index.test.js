"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ramda_1 = require("ramda");
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
            const after = (0, _1.killAgent)(now.agents[0])(now);
            expect(after.agents.filter((agent) => !agent.dead).length).toEqual(2);
        });
});
describe("testing reviveAgent manipulator", () => {
    test("using reviveAgent should revive an agent", () => {
        const now = generateStoryPoint();
        const afterKill = (0, _1.killAgent)(now.agents[0])(now);
        expect(afterKill.agents.filter((agent) => !agent.dead).length).toEqual(2);
        const afterRev = (0, _1.reviveAgent)(afterKill.agents[0])(now);
        expect(afterRev.agents.filter((agent) => !agent.dead).length).toEqual(3);
    });
});
describe("testing changeAgentResource manipulator", () => {
    test("using changeAgentResource should change an agent resource", () => {
        const now = generateStoryPoint();
        expect(now.agents[0].resources.knowledge).toEqual(0);
        const afterChange = (0, _1.changeAgentResource)(now.agents[0], "knowledge", 1)(now);
        expect(afterChange.agents[0].resources.knowledge).toEqual(1);
    }),
        test("using changeAgentResource should never change an agent resource above 3", () => {
            const now = generateStoryPoint();
            expect(now.agents[0].resources.knowledge).toEqual(0);
            const afterPosChange = (0, ramda_1.pipe)((0, _1.changeAgentResource)(now.agents[0], "knowledge", 2), (0, _1.changeAgentResource)(now.agents[0], "knowledge", 8))(now);
            expect(afterPosChange.agents[0].resources.knowledge).toEqual(3);
            const afterNegChange = (0, ramda_1.pipe)((0, _1.changeAgentResource)(now.agents[0], "knowledge", -1), (0, _1.changeAgentResource)(now.agents[0], "knowledge", -52))(now);
            expect(afterNegChange.agents[0].resources.knowledge).toEqual(-3);
        });
});
