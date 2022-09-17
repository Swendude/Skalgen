"use strict";
// import Rand from "rand-seed";
// import { Fate } from "./utils/fates";
// import { capitalize } from "./utils/text";
// export type entities = "Artefact_Other" | "Artefact_Self" | "Nothing" | "Agent";
// export type Story = {
//   agents: Agent[];
//   locations: Location[];
//   story_fate: Fate;
// };
// export const showStory = (story: Story) => {
//   const agents = story.agents.map((agent) => showAgent(agent));
//   let result = `Agents:\t${agents.join(", ")}`;
//   return result;
// };
// export type Action<T> = {
//   requires: entities;
//   effect: (t: T, fate: Fate, story: Story) => [Story, string];
// };
// export type Agent = {
//   name: string;
//   bioform: string;
//   posessions: Artefact[];
//   actions: { [index: string]: Action<Agent> };
// };
// export const showAgent = (agent: Agent) => {
//   return `${capitalize(agent.name)} the ${capitalize(agent.bioform)}`;
// };
// export type Location = {
//   name: string;
//   x: number;
//   y: number;
// };
// export type Usage<T> = {
//   requires: "Agent" | "Nothing";
//   effect: (t: T, fate: Fate, story: Story) => Story;
// };
// export type Artefact = {
//   name: string;
//   show: (artefact: Artefact) => string;
//   usage: { [index: string]: Usage<Artefact> };
// };
