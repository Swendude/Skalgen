import { Agent } from "../skalgen";

export const notMe = <TItem extends { id: number }>(
  me: TItem,
  others: TItem[]
): TItem[] => others.filter((other) => other.id !== me.id);
