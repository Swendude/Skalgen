import agentGenerator from "./generators/agentGenerator";
import artefactGenerator from "./generators/artefactGenerator";
import { createFates, makeChoice } from "./utils/fates";
import { showCollections } from "./utils/text";
import yargs from "yargs";
import { Story } from "./story";

const argv = yargs(process.argv.slice(2))
  .usage("Usage: $0 -s [num] -n [num]")
  .default("s", 42)
  .default("n", 5)
  .parseSync();

console.log(argv);
const seed: number = argv.s;
// const seed: string = (42).toString();
console.log(`Random seed: ${seed} ⚅`);

// Calling `fates(20)` is like rolling a D20
const fates = createFates(seed);

const choices = {
  //   n_agents: fates(3),
  n_agents: fates(7),
  agent_seed: fates(),
  n_artefacts: fates(7),
  artefact_seed: fates(),
  distribution_fate: createFates(fates()),
  story_fate: createFates(fates())
};

console.log("----");

console.log(`Generating ${choices.n_agents} agents ☻`);

const agents = agentGenerator(choices.agent_seed, choices.n_agents);

console.log(`Agents:\n\t ${showCollections(agents)}`);

console.log("----");

console.log(`Generating ${choices.n_artefacts} artefacts ❖`);

const artefacts = artefactGenerator(choices.artefact_seed, choices.n_artefacts);

console.log(`Artefacts:\n\t ${showCollections(artefacts)}`);

console.log("----");

console.log(`Distributing artefacts ❖`);
for (let artefactK in artefacts) {
  const artefact = artefacts[artefactK];
  const chosenAgent = makeChoice(choices.distribution_fate, agents);
  chosenAgent.posessions.push(artefact);
  console.log(
    `\t${artefact.show(artefact)} given to ${chosenAgent.show(chosenAgent)}`
  );
}

let story: Story = {
  agents: agents,
  locations: []
};

console.log("===== Our Story Begins ======");
let n = 0;
while (!(n >= argv.n - 1)) {
  console.log(`~ Day ${n} ~`);
  for (let agentK in story.agents) {
    const agent = story.agents[agentK];
    const [name, effect] = makeChoice(
      choices.story_fate,
      Object.entries(agent.actions)
    );
    let [new_story, log] = effect.effect(agent, choices.story_fate, story);
    console.log(`\t${agent.show(agent)}'s turn => \t\t ${log}`);

    // console.log(
    //   "possessions:",
    //   agent.posessions.map((p) => p.show(p)).join(", ")
    // );
    story = new_story;
  }
  n += 1;
}
