import Rand from "rand-seed";

export const createFates = (seed: number | string) => {
  const fate = new Rand(seed.toString());
  return (max?: number) => {
    return Math.floor(fate.next() * (max || Number.MAX_VALUE)) + 1;
  };
};

export type Fate = ReturnType<typeof createFates>;

export const makeChoices = <OptionType>(
  fate: Fate,
  options: OptionType[],
  amount: number
): OptionType[] => {
  let seen: number[] = [];
  return Array.from({ length: amount }, () => {
    let choice = fate(options.length) - 1;
    while (seen.includes(choice)) {
      choice = fate(options.length) - 1;
    }
    seen.push(choice);
    if (seen.length === options.length) {
      seen = [];
    }
    return options[choice];
  });
};

export const makeChoice = <OptionType>(
  fate: Fate,
  options: OptionType[]
): OptionType => {
  let choice = fate(options.length) - 1;
  return options[choice];
};

// let n = 1000000;

// const results = {} as { [key: number]: number };
// while (n > 0) {
//   const choice = fates(18);
//   //   console.log(choice);
//   if (results[choice] !== undefined) {
//     results[choice] += 1;
//   } else {
//     results[choice] = 0;
//   }
//   n--;
// }

// console.log(results);

// for (const [key, value] of Object.entries(results)) {
//   console.log(`${key}: ${".".repeat(value / 1000)}`);
// }
