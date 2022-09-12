"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const agentGenerator_1 = __importDefault(require("./generators/agentGenerator"));
const artefactGenerator_1 = __importDefault(require("./generators/artefactGenerator"));
const fates_1 = require("./utils/fates");
const text_1 = require("./utils/text");
const yargs_1 = __importDefault(require("yargs"));
const argv = (0, yargs_1.default)(process.argv.slice(2))
    .usage("Usage: $0 -s [num] -n [num]")
    .default("s", 42)
    .default("n", 5)
    .parseSync();
console.log(argv);
const seed = argv.s;
// const seed: string = (42).toString();
console.log(`Random seed: ${seed} ⚅`);
// Calling `fates(20)` is like rolling a D20
const fates = (0, fates_1.createFates)(seed);
const choices = {
    //   n_agents: fates(3),
    n_agents: fates(7),
    agent_seed: fates(),
    n_artefacts: fates(7),
    artefact_seed: fates(),
    distribution_fate: (0, fates_1.createFates)(fates()),
    story_fate: (0, fates_1.createFates)(fates())
};
console.log("----");
console.log(`Generating ${choices.n_agents} agents ☻`);
const agents = (0, agentGenerator_1.default)(choices.agent_seed, choices.n_agents);
console.log(`Agents:\n\t ${(0, text_1.showCollections)(agents)}`);
console.log("----");
console.log(`Generating ${choices.n_artefacts} artefacts ❖`);
const artefacts = (0, artefactGenerator_1.default)(choices.artefact_seed, choices.n_artefacts);
console.log(`Artefacts:\n\t ${(0, text_1.showCollections)(artefacts)}`);
console.log("----");
console.log(`Distributing artefacts ❖`);
for (let artefactK in artefacts) {
    const artefact = artefacts[artefactK];
    const chosenAgent = (0, fates_1.makeChoice)(choices.distribution_fate, agents);
    chosenAgent.posessions.push(artefact);
    console.log(`\t${artefact.show(artefact)} given to ${chosenAgent.show(chosenAgent)}`);
}
let story = {
    agents: agents,
    locations: []
};
console.log("===== Our Story Begins ======");
let n = 0;
while (!(n >= argv.n - 1)) {
    console.log(`~ Day ${n} ~`);
    for (let agentK in story.agents) {
        const agent = story.agents[agentK];
        const [name, effect] = (0, fates_1.makeChoice)(choices.story_fate, Object.entries(agent.actions));
        let [new_story, log] = effect.effect(agent, choices.story_fate, story);
        console.log(`\t${agent.show(agent)}'s turn => \t\t ${log}`);
        // console.log(
        //   "possessions:",
        //   agent.posessions.map((p) => p.show(p)).join(", ")
        // );
        story = new_story;
    }
    n += 1;
}
