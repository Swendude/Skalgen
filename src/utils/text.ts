export const capitalize = (inp: string) =>
  `${inp[0].toUpperCase()}${inp.slice(1)}`;

export const showCollections = (inp: { show: (e: any) => string }[]) =>
  inp.map((e) => e.show(e)).map((t) => `\n\t - ${t}`);
