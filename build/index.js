"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const agentGenerator_1 = __importDefault(require("./generators/agentGenerator"));
const artefactGenerator_1 = __importDefault(require("./generators/artefactGenerator"));
const fates_1 = require("./utils/fates");
const actions_1 = require("./actions");
const text_1 = require("./utils/text");
const prompts_1 = __importDefault(require("prompts"));
const kleur_1 = __importDefault(require("kleur"));
const initialStory = {
    storyPoints: [],
    agentGen: agentGenerator_1.default,
    artefactGen: artefactGenerator_1.default,
    fate: (0, fates_1.createFates)(Math.random() * 1000),
    actions: [actions_1.doNothing, actions_1.findArtefact]
};
const bigBang = (s) => {
    const newStoryPoint = {
        agents: [...new Array(3)].map((i) => s.agentGen(s.fate())),
        artefacts: [...new Array(6)].map((i) => s.artefactGen(s.fate())),
        facts: []
    };
    return Object.assign(Object.assign({}, s), { storyPoints: [[newStoryPoint, "The world was created"]] });
};
const tick = (s) => {
    const [currentPoint, currentLog] = s.storyPoints[s.storyPoints.length - 1];
    // pick an agent
    const chosenAgent = (0, fates_1.makeChoice)(s.fate, currentPoint.agents);
    // pick an action
    const chosenAction = (0, fates_1.makeChoice)(s.fate, s.actions);
    if (chosenAction.checker(currentPoint)) {
        return Object.assign(Object.assign({}, s), { storyPoints: [
                ...s.storyPoints,
                chosenAction.effect(currentPoint, chosenAgent, s.fate())
            ] });
    }
    else {
        return Object.assign(Object.assign({}, s), { storyPoints: [
                ...s.storyPoints,
                [currentPoint, `${chosenAgent.name} could not take their action`]
            ] });
    }
};
let currentStory = bigBang(initialStory);
const run_cli = async () => {
    let exited = false;
    let last_message = `Waiting for input`;
    while (!exited) {
        process.stdout.write("\u001B[2J\u001B[0;0f");
        console.log(`> ${kleur_1.default.black().bold().bgWhite(last_message)}\n`);
        (0, text_1.renderStory)(currentStory);
        const nextStep = {
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
        const choice = await (0, prompts_1.default)(nextStep);
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
