import { Agent } from "../skalgen";
import fs from "fs";
import { createFates, Fate, makeChoice, makeChoices } from "../utils/fates";
import _firstNames from "./seeds/firstnames.json";
import _surNames from "./seeds/surnames.json";
import _titles from "./seeds/jobnames.json";
import { _modifiersChoices } from "../manipulators/modifiers";
const agentGenerator = (seed: number): Agent => {
  let fate = createFates(seed);
  const modifier = makeChoice(fate, _modifiersChoices);

  return modifier({
    id: fate(),
    first_name: makeChoice(fate, _firstNames),
    surname: makeChoice(fate, _surNames),
    title: null,
    inventory: [],
    dead: false,
    resources: {
      knowledge: 0,
      influence: 0,
      might: 0
    },
    modifier: null
  });
};
export default agentGenerator;
