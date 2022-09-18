import { Artefact } from "../skalgen";
import { capitalize } from "../utils/text";
import { createFates, makeChoice } from "../utils/fates";
import {
  gainMight,
  killOtherAgent,
  reviveOtherAgent
} from "../actions/artefactActions";
import { kill } from "process";

const _prefixs = [
  "Ancient",
  "Magical",
  "Cursed",
  "Blessed",
  "Weird",
  "Demonic",
  "Alchemic",
  "Mysterious"
];
const _names = [
  ["Dagger", "🗡"],
  ["Candle", "🕯"],
  ["Cauldron", "🍯"],
  ["Mantle", "🧥"],
  ["Banjo", "🪕"],
  ["Pickaxe", "⛏"],
  ["Wand", "🪄"],
  ["Mirror", "🪞"],
  ["Shoes", "👞"],
  ["Quill", "🪶"],
  ["Tablet", "🪨"],
  ["Sword", "🗡"],
  ["Amulet", "🧿"],
  ["Ring", "💍"],
  ["Egg", "🥚"],
  ["Scroll", "📜"],
  ["Tome", "📖"]
];

const actionOptions = [killOtherAgent, reviveOtherAgent, gainMight];

const artefactGenerator = (seed: number): Artefact => {
  let fate = createFates(seed);

  const chosenAction = makeChoice(fate, actionOptions);
  const pfixs = makeChoice(fate, _prefixs);
  const [name, icon] = makeChoice(fate, _names);
  const sfix = chosenAction.postfix;
  return {
    id: fate(),
    name: `${pfixs} ${name} ${sfix} ${icon}`,
    usage: {
      knowledge_requirement: fate(3),
      action: chosenAction
    }
  };
};
export default artefactGenerator;
