import { Agent } from "../skalgen";
import fs from "fs";
import { createFates, Fate, makeChoice, makeChoices } from "../utils/fates";
import _firstNames from "./seeds/firstnames.json";
import _surNames from "./seeds/surnames.json";
import _titles from "./seeds/jobnames.json";
const _face = ["😈", "🧝‍♀️", "🧝‍♂️", "🧙‍♂️", "👨‍🎨", "🧑‍🌾", "🧑‍🍳", "👩‍🎨", "🧑‍⚖️"];

const agentGenerator = (seed: number): Agent => {
  let fate = createFates(seed);
  return {
    id: fate(),
    name: `${makeChoice(fate, _face)} ${makeChoice(
      fate,
      _firstNames
    )} ${makeChoice(fate, _surNames)} the ${makeChoice(fate, _titles)}`,
    inventory: [],
    dead: false,
    resources: {
      knowledge: 0,
      influence: 0,
      might: 0
    }
  };
};
export default agentGenerator;
