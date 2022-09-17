import { Artefact, Story, Agent } from "../skalgen";
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
  console.log(kleur.red().italic(`Seed ${s.seed}\n`));
  console.log(kleur.red().bold(currentLog));
  console.log(kleur.green().bold(`\n Agents:`));
  currentPoint.agents.forEach((agent) => {
    console.log(`    ${renderAgent(agent)}`);
    console.log(
      `      ${kleur.italic().green(`I:${agent.resources.influence}`)} ${kleur
        .italic()
        .blue(`K:${agent.resources.knowledge}`)} ${kleur
        .italic()
        .blue(`M:${agent.resources.might}`)}`
    );
    agent.inventory.forEach((artefact) => {
      console.log(`        ${renderArtefact(artefact)}`);
    });
  });
  console.log(kleur.blue().bold(`\n Artefacts to be discovered:`));
  currentPoint.artefacts.forEach((artefact) => {
    console.log(`    ${renderArtefact(artefact)}`);
  });
  console.log(kleur.red().underline(`----------------------------------`));
};

export const renderArtefact = (artefact: Artefact): string =>
  `${kleur.blue().bold(`${artefact.name} ${artefact.usage.action.postfix}`)} (${
    artefact.usage.knowledge_requirement
  })`;

export const renderAgent = (agent: Agent): string =>
  `${kleur.green().bold(agent.name)}${agent.dead ? "☠️" : ""}`;
