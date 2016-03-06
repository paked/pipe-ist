import { Valve } from './valve';

/*
 * Pipe controls the flow of data in an `pipe-ist` build stream.
 */
export interface Pipe {
  do(v: Valve): Valve;
  allows(filename: string): boolean;
}

/*
 * Plumber is a factory which creates a Pipe
 */
export interface Plumber {
  create(): Pipe;
}

/*
 * Detects if a given objectis a Plumber
 */
export function isPlumber(p: any): p is Plumber {
  return p.create !== undefined; // this is a *really* bad solution.
}

/*
 * Detects if a given object is a Pipe
 */
export function isPipe(p: any): p is Pipe {
  return p.do !== undefined && p.allows !== undefined; // this is a *really* bad solution.
}

export class WrapPlumber {
  private pipe: Pipe;

  constructor(p: Pipe) {
    this.pipe = p;
  }

  create(): Pipe {
    return this.pipe;
  }
}
