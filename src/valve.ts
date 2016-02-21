import { Readable } from 'stream';

export class Valve {
  public input: any;
  public output: string;
  public root: string;

  constructor(i: Readable, o: string, r: string) {
    this.input = i;
    this.output = o;
    this.root = r;
  }
}
