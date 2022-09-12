import { Artefact } from "../story";
import { capitalize } from "../utils/text";
import { createFates, makeChoices } from "../utils/fates";

const _prefixs = ["ancient", "magical", "cursed", "blessed"];
const _suffixs = ["dagger", "tablet", "sword", "amulet", "ring"];

const artefactGenerator = (
  seed: string | number,
  amount: number
): Artefact[] => {
  let fate = createFates(seed);

  const pfixs = makeChoices(fate, _prefixs, amount);
  const sfixs = makeChoices(fate, _suffixs, amount);

  return Array.from({ length: amount }, (v: unknown, i: number) => ({
    name: `the ${pfixs[i]} ${sfixs[i]}`,
    show: (artefact) => `${capitalize(artefact.name)}`,
    usage: {}
  }));
};
export default artefactGenerator;
