import { Readable, Writable } from 'stream';

export class Valve {
  public input: any;
  public output: any;

  constructor(i: Readable, o: Writable) {
    this.input = i;
    this.output = o;
  }

  setInput(i: any) {
    this.input = i;
  }

  setOutput(o: any) {
    this.output = o;
  }
}
