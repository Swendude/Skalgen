import { Agent } from "../skalgen";

export type Modifier = (agent: Agent) => Agent;

const evilModifier: Modifier = (agent) => ({
  ...agent,
  title: "omen of evil",
  modifier: "evil"
});

const goodModifier: Modifier = (agent) => ({
  ...agent,
  title: "hero of good",
  modifier: "good"
});

export const _modifiersChoices = [evilModifier, goodModifier];
