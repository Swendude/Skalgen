import { Story } from "../skalgen";
import kleur from "kleur";

export const capitalize = (inp: string) =>
  `${inp[0].toUpperCase()}${inp.slice(1)}`;

export const showCollections = (inp: { show: (e: any) => string }[]) =>
  inp.map((e) => e.show(e)).map((t) => `\n\t - ${t}`);

export const renderStory = (s: Story, point?: number): void => {
  const currentPointI = point || s.storyPoints.length - 1;
  const [currentPoint, currentLog] = s.storyPoints[currentPointI];
  console.log(
    kleur.red().underline(`-StoryPoint ${currentPointI} --------------------`)
  );
  console.log(kleur.red().bold(currentLog));
  console.log(kleur.green().bold(`\n Agents:`));
  currentPoint.agents.forEach((agent) => {
    console.log(`    ${kleur.green().bold(agent.name)}`);
    agent.inventory.forEach((item) => {
      console.log(`        ${kleur.blue(item.name)}`);
    });
  });
  console.log(kleur.blue().bold(`\n Artefacts to be discovered:`));
  currentPoint.artefacts.forEach((artefact) => {
    console.log(`    ${kleur.blue().bold(artefact.name)}`);
  });
  console.log(kleur.red().underline(`----------------------------------`));
};
