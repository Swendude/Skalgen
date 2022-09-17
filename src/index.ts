import agentGenerator from "./generators/agentGenerator";
import artefactGenerator from "./generators/artefactGenerator";
import { Story, StoryPoint } from "./skalgen";
import { createFates, makeChoice } from "./utils/fates";
import { doNothing, findArtefact } from "./actions";
import { logo, renderStory } from "./utils/text";
import prompts, { PromptObject } from "prompts";
import kleur from "kleur";
const initialStory: Story = {
  storyPoints: [],
  agentGen: agentGenerator,
  artefactGen: artefactGenerator,
  fate: createFates(Math.random() * 1000),
  actions: [doNothing, findArtefact]
};

const bigBang = (s: Story): Story => {
  const newStoryPoint: StoryPoint = {
    agents: [...new Array(3)].map((i) => s.agentGen(s.fate())),
    artefacts: [...new Array(6)].map((i) => s.artefactGen(s.fate())),
    facts: []
  };
  return { ...s, storyPoints: [[newStoryPoint, "The world was created"]] };
};

const tick = (s: Story): Story => {
  const [currentPoint, currentLog] = s.storyPoints[s.storyPoints.length - 1];
  // pick an agent
  const chosenAgent = makeChoice(s.fate, currentPoint.agents);
  // pick an action
  const chosenAction = makeChoice(s.fate, s.actions);
  if (chosenAction.checker(currentPoint)) {
    return {
      ...s,
      storyPoints: [
        ...s.storyPoints,
        chosenAction.effect(currentPoint, chosenAgent, s.fate())
      ]
    };
  } else {
    return {
      ...s,
      storyPoints: [
        ...s.storyPoints,
        [currentPoint, `${chosenAgent.name} could not take their action`]
      ]
    };
  }
};

let currentStory = bigBang(initialStory);

const run_cli = async () => {
  let exited = false;
  let last_message = `Waiting for input`;

  while (!exited) {
    process.stdout.write("\u001B[2J\u001B[0;0f");
    console.log(`> ${kleur.black().bold().bgWhite(last_message)}\n`);
    renderStory(currentStory);
    const nextStep: PromptObject = {
      name: "next_step",
      type: "select",
      choices: [
        { title: "next", value: "next" },
        { title: "exit", value: "exit" }
      ],
      onState: (state) => {
        if (state.aborted) {
          process.nextTick(() => {
            process.exit(0);
          });
        }
      },
      message: "SKALGEN: Select option ('next' or 'exit')"
    };
    const choice = await prompts(nextStep);

    switch (choice.next_step) {
      case "exit":
        exited = true;
      case "next":
        last_message = "Tick returned";
        currentStory = tick(currentStory);
    }
  }
};

run_cli();
