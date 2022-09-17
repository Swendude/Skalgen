import { Artefact, ResourceVal } from "../skalgen";
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
const _suffixs = [
  "Dagger 🗡",
  "Candle 🕯",
  "Cauldron 🍯",
  "Mantle 🧥",
  "Banjo 🪕",
  "Pickaxe ⛏",
  "Wand 🪄",
  "Mirror 🪞",
  "Shoes 👞",
  "Quill 🪶",
  "Tablet 🪨",
  "Sword 🗡",
  "Amulet 🧿",
  "Ring 💍",
  "Egg 🥚",
  "Scroll 📜",
  "Tome 📖"
];

const actionOptions = [killOtherAgent, reviveOtherAgent, gainMight];

const artefactGenerator = (seed: number): Artefact => {
  let fate = createFates(seed);

  const pfixs = makeChoice(fate, _prefixs);
  const sfixs = makeChoice(fate, _suffixs);
  return {
    id: fate(),
    name: `${pfixs} ${sfixs}`,
    usage: {
      knowledge_requirement: fate(3) as ResourceVal,
      action: makeChoice(fate, actionOptions)
    }
  };
};
export default artefactGenerator;
