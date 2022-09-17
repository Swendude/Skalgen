import { Fate } from "./utils/fates";

type generator<T> = (seed: number) => T;

export type Story = {
  storyPoints: [StoryPoint, string][];
  fate: Fate;
  actions: AgentAction[];
  agentGen: generator<Agent>;
  artefactGen: generator<Artefact>;
  seed: number;
};

export type StoryPoint = {
  agents: Agent[];
  artefacts: Artefact[];
  facts: string[];
};

type attitudeVal = -3 | -2 | -1 | 0 | 1 | 2 | 3;
export type ResourceVal = 0 | 1 | 2;
export type ResourceT = "knowledge" | "influence" | "might";

export type Agent = {
  id: number;
  name: string;
  inventory: Artefact[];
  dead: boolean;
  //   attitudes: { [key: string]: attitudeVal };
  resources: { [key in ResourceT]: ResourceVal };
};

export type Artefact = {
  id: number;
  name: string;
  usage: Usage;
};

type Usage = {
  knowledge_requirement: ResourceVal;
  action: ArtefactAction;
};

type AgentEffect = (
  seed: number,
  now: StoryPoint,
  agent: Agent
) => [StoryPoint, string];

type ArtefactEffect = (
  seed: number,
  now: StoryPoint,
  agent: Agent,
  artefact: Artefact
) => [StoryPoint, string];

// type Stepper = (now: StoryPoint, effects: Effect[]) => StoryPoint;

export type AgentAction = {
  name: string;
  checker: (s: StoryPoint, agent: Agent) => boolean;
  effect: AgentEffect;
};

export type ArtefactAction = {
  name: string;
  checker: (s: StoryPoint, agent: Agent, artefact: Artefact) => boolean;
  effect: ArtefactEffect;
  postfix: string;
};
