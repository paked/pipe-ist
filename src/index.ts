import { readdir, stat, createReadStream } from 'fs';
import { join } from 'path';
import { getFiles } from './utils';

/*
 * Create a task with a name and a set of pipes for it to run through.
 */
export function task(name: string, pipes: string[]) {
  getFiles()
  .then((files) => {
    console.log(files);
    files.forEach((filename) => {
      let file = createReadStream(filename);

      file.on('data', (chunk: any) => {
        console.log(`Reading ${filename}:`);
        console.log(chunk.toString());
      });
    });
  });
}
