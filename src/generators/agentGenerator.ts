import { Agent } from "../skalgen";
import { capitalize } from "../utils/text";
import { createFates, Fate, makeChoice, makeChoices } from "../utils/fates";

const _face = ["😈", "🧝‍♀️", "🧝‍♂️", "🧙‍♂️", "👨‍🎨", "🧑‍🌾", "🧑‍🍳", "👩‍🎨", "🧑‍⚖️"];
const _names = ["roger", "bill", "joe", "gina", "leslie", "amalia"];
const _titles = [
  "swordmaster",
  "the bladesmith",
  "the cobbler",
  "the wise",
  "the blind",
  "the mad",
  "the wicked",
  "the ruler"
];

const agentGenerator = (seed: number): Agent => {
  let fate = createFates(seed);
  return {
    name: `${makeChoice(fate, _face)} ${makeChoice(fate, _names)} ${makeChoice(
      fate,
      _titles
    )}`,
    inventory: []
  };
};
export default agentGenerator;
