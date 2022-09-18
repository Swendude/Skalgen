import agentGenerator from "./generators/agentGenerator";
import artefactGenerator from "./generators/artefactGenerator";
import { Story, StoryPoint } from "./skalgen";
import { createFates, makeChoice } from "./utils/fates";
import {
  findArtefact,
  politics,
  smear,
  study,
  train,
  useArtefact,
  spy,
  assault
} from "./actions/agentActions";
import { renderAgent, renderStory } from "./utils/text";
import prompts, { PromptObject } from "prompts";
import kleur from "kleur";
import { includesId, retrieveById, retrieveByName } from "./manipulations";
import { rawListeners } from "process";

const seed = parseInt(process.argv[2]) || Math.floor(Math.random() * 1000000);
const initialStory: Story = {
  storyPoints: [],
  agentGen: agentGenerator,
  artefactGen: artefactGenerator,
  fate: createFates(seed),
  seed: seed,
  actions: [
    findArtefact,
    useArtefact,
    study,
    politics,
    train,
    smear,
    spy,
    assault
  ]
};

export const bigBang = (s: Story): Story => {
  const newStoryPoint: StoryPoint = {
    agents: [...new Array(3)].map((i) => s.agentGen(s.fate())),
    artefacts: [...new Array(5)].map((i) => s.artefactGen(s.fate())),
    facts: []
  };
  return { ...s, storyPoints: [[newStoryPoint, "The world was created"]] };
};

export const tick = (
  s: Story,
  agentId?: number,
  actionName?: string
): Story => {
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

  const chosenAgent = agentId
    ? retrieveById(agentId, agentsAlive)
    : agentsAlive[currentAgentIndex];
  // const chosenAgent = makeChoice(s.fate, agentsAlive);

  if (!chosenAgent) {
    throw `This agent is not alive! (id:${agentId})`;
  }

  // pick an action
  const availableActions = s.actions.filter((_action) =>
    _action.checker(currentPoint, chosenAgent)
  );
  if (availableActions.length === 0) {
    return {
      ...s,
      storyPoints: [
        ...s.storyPoints,
        [currentPoint, `${renderAgent(chosenAgent)} could not take any action`]
      ]
    };
  }

  const chosenAction = actionName
    ? retrieveByName(actionName, availableActions)
    : makeChoice(s.fate, availableActions);

  if (!chosenAction) {
    throw `This action is not available for this agent!(id:${agentId}, name:${actionName})`;
  }

  return {
    ...s,
    storyPoints: [
      ...s.storyPoints,
      chosenAction.effect(s.fate(), currentPoint, chosenAgent)
    ]
  };
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
