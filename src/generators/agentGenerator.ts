import { Agent, Story, Artefact } from "../story";
import { capitalize } from "../utils/text";
import { createFates, Fate, makeChoice, makeChoices } from "../utils/fates";

const _names = ["roger", "bill", "joe", "gina", "leslie", "amalia"];
const _bioforms = ["bunny", "raccoon", "mouse", "badger"];

const agentGenerator = (seed: string | number, amount: number): Agent[] => {
  let fate = createFates(seed);

  const names = makeChoices(fate, _names, amount);
  const bioforms = makeChoices(fate, _bioforms, amount);

  return Array.from({ length: amount }, (v: unknown, i: number) => ({
    name: names[i],
    bioform: bioforms[i],
    posessions: [],
    show: (agent) => {
      return `${capitalize(agent.name)} the ${capitalize(agent.bioform)}`;
    },
    actions: {
      DO_NOTHING: {
        requires: "Nothing",
        effect: (self, fate, story) => [
          story,
          `${self.show(self)} decided to do nothing`
        ]
      },
      GIVE_ITEM: {
        requires: "Artefact_Self",
        effect: (self, fate, story) => {
          const agentToGift: Agent = makeChoice(fate, story.agents);
          if (self.posessions.length > 0) {
            const artefactChoice = fate(self.posessions.length);
            const artefact: Artefact = self.posessions[artefactChoice - 1];

            agentToGift.posessions = [...agentToGift.posessions, artefact];
            self.posessions = self.posessions.filter(
              (p, i) => i !== artefactChoice
            );
            return [
              story,
              `${self.show(self)} gave ${agentToGift.show(
                agentToGift
              )} ${artefact.show(artefact)}`
            ];
          }

          return [
            story,
            `${self.show(self)} wanted to gift an artefact but had none`
          ];
        }
      }
    }
  }));
};
export default agentGenerator;
