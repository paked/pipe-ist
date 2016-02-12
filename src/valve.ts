import { Readable, Writable } from 'stream';

export class Valve {
  public input: any;
  public output: string;
  public filename: string;

  constructor(i: Readable, o: string, file: string) {
    this.filename = file;
    this.input = i;
    this.output = o;
  }

  setInput(i: any) {
    this.input = i;
  }
}
