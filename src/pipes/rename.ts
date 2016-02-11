import { createWriteStream } from 'fs';
import { Readable, Writable } from 'stream';

/*
 * Renames a file
 */
export class RenamePipe {
  filename: string;

  constructor(filename: string) {
    this.filename = filename;
  }

  do(input: Readable, output: Writable): Writable {
    output.end();

    return createWriteStream(this.filename);
  }
}
