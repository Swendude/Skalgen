import { Fate } from "./utils/fates";

type generator<T> = (seed: number) => T;

export type Story = {
  storyPoints: [StoryPoint, string][];
  fate: Fate;
  actions: Action[];
  agentGen: generator<Agent>;
  artefactGen: generator<Artefact>;
};

export type StoryPoint = {
  agents: Agent[];
  artefacts: Artefact[];
  facts: string[];
};

type attitudeVal = -3 | -2 | -1 | 0 | 1 | 2 | 3;
type resourceVal = 0 | 1 | 2;
type resourceT = "knowledge" | "influence" | "might";

export type Agent = {
  name: string;
  inventory: Artefact[];
  //   attitudes: { [key: string]: attitudeVal };
  //   resources: { [key in resourceT]: resourceVal };
};

export type Artefact = {
  name: string;
};

type Effect = (
  now: StoryPoint,
  agent: Agent,
  seed: number
) => [StoryPoint, string];

// type Stepper = (now: StoryPoint, effects: Effect[]) => StoryPoint;

export type Action = {
  name: string;
  checker: (s: StoryPoint) => boolean;
  effect: Effect;
};
