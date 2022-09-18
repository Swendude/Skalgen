import { pipe, curry } from "ramda";

const incr = (x: number) => x + 1;
const pow = curry((y: number, x: number) => Math.pow(x, y));
const bla = (x: number) => "Bla".repeat(x);

console.log(pipe(incr, pow(2), bla)(5));
