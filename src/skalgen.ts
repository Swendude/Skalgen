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

export type ResourceK = "knowledge" | "influence" | "might";

export type Resources = { [key in ResourceK]: number };

export type Agent = {
  id: number;
  name: string;
  inventory: Artefact[];
  dead: boolean;
  resources: Resources;
};

export type Artefact = {
  id: number;
  name: string;
  usage: Usage;
};

type Usage = {
  knowledge_requirement: number;
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
