import { Artefact } from "../skalgen";
import { capitalize } from "../utils/text";
import { createFates, makeChoice } from "../utils/fates";

const _prefixs = [
  "ancient",
  "magical",
  "cursed",
  "blessed",
  "weird",
  "demonic"
];
const _suffixs = [
  "dagger 🗡",
  "tablet 🪨",
  "sword 🗡",
  "amulet 🧿",
  "ring 💍",
  "egg 🥚",
  "scroll 📜",
  "tome 📖"
];

const artefactGenerator = (seed: number): Artefact => {
  let fate = createFates(seed);

  const pfixs = makeChoice(fate, _prefixs);
  const sfixs = makeChoice(fate, _suffixs);
  return { name: `the ${pfixs} ${sfixs}` };
};
export default artefactGenerator;
