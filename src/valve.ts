import { Readable, Writable } from 'stream';
export class Valve {
  input: any;
  output: any;

  constructor(i: Readable, o: Writable) {
    this.input = i;
    this.output = o;
  }
}
