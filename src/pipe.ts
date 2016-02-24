import { Valve } from './valve';

/*
 * Pipe controls the flow of data in an `pipe-ist` build stream.
 */
export interface Pipe {
  do(v: Valve): Valve;
  allows(filename: string): boolean;
}

export interface Plumber {
  create(): Pipe;
}

export function isPlumber(p: any): p is Plumber {
  return p.create !== undefined; // this is a *really* bad solution.
}
