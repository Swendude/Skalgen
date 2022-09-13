"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const agentGenerator_1 = __importDefault(require("./generators/agentGenerator"));
const artefactGenerator_1 = __importDefault(require("./generators/artefactGenerator"));
const fates_1 = require("./utils/fates");
const prompts_1 = __importDefault(require("prompts"));
// const questions: PromptObject<string> = [
//   {
//     type: "select",
//     name: "swen"
//   }
// ];
const startQuestions = [
    {
        type: "number",
        name: "seed",
        message: "What seed do you want to use?",
        initial: 42
    },
    {
        type: "number",
        name: "steps",
        message: "How many steps do you want to use?",
        initial: 5
    }
];
(0, prompts_1.default)(startQuestions).then((result) => console.log(interactive(generate_story(result.seed))));
const interactive = async (story) => {
    const question = [
        {
            type: "select",
            name: "operation",
            message: "What whould you like to do",
            choices: [
                {
                    title: "Inspect agents",
                    value: "agents"
                },
                {
                    title: "Inspect story",
                    value: "story"
                },
                {
                    title: "Run simulation",
                    value: "simulation"
                },
                {
                    title: "Exit",
                    value: "exit"
                }
            ],
            initial: 0
        }
    ];
    let stop = false;
    while (!stop) {
        const choice = await (0, prompts_1.default)(question);
        switch (choice.operation) {
            case "exit": {
                stop = true;
            }
        }
    }
};
// const argv = yargs(process.argv.slice(2))
//   .usage("Usage: $0 -s [num] -n [num]")
//   .default("s", 42)
//   .default("n", 5)
//   .parseSync();
// console.log(argv);
// const seed: number = argv.s;
// const steps: number = argv.n;
const generate_story = (seed) => {
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
    const agents = (0, agentGenerator_1.default)(choices.agent_seed, choices.n_agents);
    const artefacts = (0, artefactGenerator_1.default)(choices.artefact_seed, choices.n_artefacts);
    for (let artefactK in artefacts) {
        const artefact = artefacts[artefactK];
        const chosenAgent = (0, fates_1.makeChoice)(choices.distribution_fate, agents);
        chosenAgent.posessions.push(artefact);
    }
    return {
        agents: agents,
        locations: [],
        story_fate: choices.story_fate
    };
};
// const initialStory = generate_story(seed);
// console.log(initialStory);
// let storySteps = [initialStory];
// console.log("===== Our Story Begins ======");
// let n = 0;
// while (!(n >= argv.n - 1)) {
//   console.log(`~ ✺ Day ${n} ✺ ~`);
//   for (let agentK in story.agents) {
//     let story = storySteps[storySteps.length - 1];
//     const agent = story.agents[agentK];
//     const [name, effect] = makeChoice(
//       story.story_fate,
//       Object.entries(agent.actions)
//     );
//     let [new_story, log] = effect.effect(agent, story.story_fate, story);
//     console.log(`\t▷ ${log}`);
//     storySteps = [...storySteps, new_story];
//   }
//   n += 1;
// }
// console.log(storySteps);
