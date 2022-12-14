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
  ["Dagger", "ðĄ"],
  ["Candle", "ðŊ"],
  ["Cauldron", "ðŊ"],
  ["Mantle", "ð§Ĩ"],
  ["Banjo", "ðŠ"],
  ["Pickaxe", "â"],
  ["Wand", "ðŠ"],
  ["Mirror", "ðŠ"],
  ["Shoes", "ð"],
  ["Quill", "ðŠķ"],
  ["Tablet", "ðŠĻ"],
  ["Sword", "ðĄ"],
  ["Amulet", "ð§ŋ"],
  ["Ring", "ð"],
  ["Egg", "ðĨ"],
  ["Scroll", "ð"],
  ["Tome", "ð"]
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
