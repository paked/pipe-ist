import { Readable } from 'stream';

export class Valve {
  public input: any;
  public output: string;

  constructor(i: Readable, o: string) {
    this.input = i;
    this.output = o;
  }
}
