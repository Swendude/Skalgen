"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tick = exports.bigBang = void 0;
const agentGenerator_1 = __importDefault(require("./generators/agentGenerator"));
const artefactGenerator_1 = __importDefault(require("./generators/artefactGenerator"));
const fates_1 = require("./utils/fates");
const agentActions_1 = require("./actions/agentActions");
const text_1 = require("./utils/text");
const prompts_1 = __importDefault(require("prompts"));
const kleur_1 = __importDefault(require("kleur"));
const manipulations_1 = require("./manipulations");
const seed = parseInt(process.argv[2]) || Math.floor(Math.random() * 1000000);
const initialStory = {
    storyPoints: [],
    agentGen: agentGenerator_1.default,
    artefactGen: artefactGenerator_1.default,
    fate: (0, fates_1.createFates)(seed),
    seed: seed,
    actions: [agentActions_1.findArtefact, agentActions_1.useArtefact, agentActions_1.study, agentActions_1.politics, agentActions_1.train, agentActions_1.smear]
};
const bigBang = (s) => {
    const newStoryPoint = {
        agents: [...new Array(6)].map((i) => s.agentGen(s.fate())),
        artefacts: [...new Array(15)].map((i) => s.artefactGen(s.fate())),
        facts: []
    };
    return Object.assign(Object.assign({}, s), { storyPoints: [[newStoryPoint, "The world was created"]] });
};
exports.bigBang = bigBang;
const tick = (s, agentId, actionName) => {
    const [currentPoint, currentLog] = s.storyPoints[s.storyPoints.length - 1];
    // pick an agent
    const agentsAlive = currentPoint.agents.filter((agent) => !agent.dead);
    if (agentsAlive.length === 0) {
        return Object.assign(Object.assign({}, s), { storyPoints: [
                ...s.storyPoints,
                [Object.assign({}, currentPoint), "A barren wasteland"]
            ] });
    }
    const currentAgentIndex = (s.storyPoints.length - 1) % agentsAlive.length;
    const chosenAgent = agentId
        ? (0, manipulations_1.retrieveById)(agentId, agentsAlive)
        : agentsAlive[currentAgentIndex];
    // const chosenAgent = makeChoice(s.fate, agentsAlive);
    if (!chosenAgent) {
        throw `This agent is not alive! (id:${agentId})`;
    }
    // pick an action
    const availableActions = s.actions.filter((_action) => _action.checker(currentPoint, chosenAgent));
    if (availableActions.length === 0) {
        return Object.assign(Object.assign({}, s), { storyPoints: [
                ...s.storyPoints,
                [currentPoint, `${(0, text_1.renderAgent)(chosenAgent)} could not take any action`]
            ] });
    }
    const chosenAction = actionName
        ? (0, manipulations_1.retrieveByName)(actionName, availableActions)
        : (0, fates_1.makeChoice)(s.fate, availableActions);
    if (!chosenAction) {
        throw `This action is not available for this agent!(id:${agentId}, name:${actionName})`;
    }
    return Object.assign(Object.assign({}, s), { storyPoints: [
            ...s.storyPoints,
            chosenAction.effect(s.fate(), currentPoint, chosenAgent)
        ] });
};
exports.tick = tick;
let currentStory = (0, exports.bigBang)(initialStory);
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
        const choice = await (0, prompts_1.default)(nextStep);
        console.log(choice.next_step);
        switch (choice.next_step) {
            case "exit":
                exited = true;
                break;
            case "next":
                last_message = "Tick returned";
                currentStory = (0, exports.tick)(currentStory);
                break;
            case "log": {
                currentStory.storyPoints.forEach((sp, i) => {
                    console.log(`${kleur_1.default.bgWhite().black(`${i}`)} ${sp[1]}`);
                });
                exited = true;
                break;
            }
        }
    }
};
run_cli();
