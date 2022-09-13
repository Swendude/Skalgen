import agentGenerator from "./generators/agentGenerator";
import artefactGenerator from "./generators/artefactGenerator";
import { createFates, makeChoice } from "./utils/fates";
import { showCollections } from "./utils/text";
import yargs from "yargs";
import { showStory, Story } from "./story";
import prompts, { PromptObject, PromptType } from "prompts";

// const questions: PromptObject<string> = [
//   {
//     type: "select",
//     name: "swen"
//   }
// ];
const startQuestions: PromptObject[] = [
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

prompts(startQuestions).then((result) =>
  console.log(interactive(generate_story(result.seed)))
);

const interactive = async (story: Story) => {
  const question: PromptObject[] = [
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
    const choice = await prompts(question);
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

const generate_story = (seed: number) => {
  const fates = createFates(seed);

  const choices = {
    //   n_agents: fates(3),
    n_agents: fates(7),
    agent_seed: fates(),
    n_artefacts: fates(7),
    artefact_seed: fates(),
    distribution_fate: createFates(fates()),
    story_fate: createFates(fates())
  };

  const agents = agentGenerator(choices.agent_seed, choices.n_agents);

  const artefacts = artefactGenerator(
    choices.artefact_seed,
    choices.n_artefacts
  );

  for (let artefactK in artefacts) {
    const artefact = artefacts[artefactK];
    const chosenAgent = makeChoice(choices.distribution_fate, agents);
    chosenAgent.posessions.push(artefact);
  }

  return {
    agents: agents,
    locations: [],
    story_fate: choices.story_fate
  } as Story;
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
