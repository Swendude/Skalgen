import Rand from "rand-seed";
import { Fate } from "./utils/fates";

export type entities = "Artefact_Other" | "Artefact_Self" | "Nothing" | "Agent";

export type Story = {
  agents: Agent[];
  locations: Location[];
};

export type Action<T> = {
  requires: entities;
  effect: (t: T, fate: Fate, story: Story) => [Story, string];
};

export type Agent = {
  name: string;
  bioform: string;
  posessions: Artefact[];
  show: (agent: Agent) => string;
  actions: { [index: string]: Action<Agent> };
};

export type Location = {
  name: string;
  x: number;
  y: number;
};

export type Usage<T> = {
  requires: "Agent" | "Nothing";
  effect: (t: T, fate: Fate, story: Story) => Story;
};

export type Artefact = {
  name: string;
  show: (artefact: Artefact) => string;
  usage: { [index: string]: Usage<Artefact> };
};
