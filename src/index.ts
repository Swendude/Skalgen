import agentGenerator from "./generators/agentGenerator";
import artefactGenerator from "./generators/artefactGenerator";
import { Story, StoryPoint } from "./skalgen";
import { createFates, makeChoice } from "./utils/fates";
import {
  doNothing,
  findArtefact,
  study,
  useArtefact
} from "./actions/agentActions";
import { renderStory } from "./utils/text";
import prompts, { PromptObject } from "prompts";
import kleur from "kleur";

const seed = parseInt(process.argv[2]) || Math.floor(Math.random() * 1000000);
const initialStory: Story = {
  storyPoints: [],
  agentGen: agentGenerator,
  artefactGen: artefactGenerator,
  fate: createFates(seed),
  seed: seed,
  actions: [doNothing, findArtefact, useArtefact, study]
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

  const agentsAlive = currentPoint.agents.filter((agent) => !agent.dead);
  if (agentsAlive.length === 0) {
    return {
      ...s,
      storyPoints: [
        ...s.storyPoints,
        [{ ...currentPoint }, "A barren wasteland"]
      ]
    };
  }
  const currentAgentIndex = (s.storyPoints.length - 1) % agentsAlive.length;
  const chosenAgent = currentPoint.agents[currentAgentIndex];
  // const chosenAgent = makeChoice(s.fate, agentsAlive);

  // pick an action
  const chosenAction = makeChoice(s.fate, s.actions);
  if (chosenAction.checker(currentPoint, chosenAgent)) {
    return {
      ...s,
      storyPoints: [
        ...s.storyPoints,
        chosenAction.effect(s.fate(), currentPoint, chosenAgent)
      ]
    };
  } else {
    return {
      ...s,
      storyPoints: [
        ...s.storyPoints,
        [
          currentPoint,
          `${chosenAgent.name} could not take their action (wanted ${chosenAction.name})`
        ]
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
        { title: "log & exit", value: "log" },
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
    console.log(choice.next_step);
    switch (choice.next_step) {
      case "exit":
        exited = true;
        break;
      case "next":
        last_message = "Tick returned";
        currentStory = tick(currentStory);
        break;
      case "log": {
        currentStory.storyPoints.forEach((sp, i) => {
          console.log(`${kleur.bgWhite().black(`${i}`)} ${sp[1]}`);
        });
        exited = true;
        break;
      }
    }
  }
};

run_cli();
