import Promise = require('any-promise');

import { createReadStream, createWriteStream } from 'fs';

import { getFiles } from './utils';
import { Pipe } from './pipe';
import { Valve } from './valve';

/*
 * Create a task with a name and a set of pipes for it to run through.
 */
export function task(name: string, pipes: Pipe[], directory = './'): Promise<any> {
  return getFiles(directory)
    .then((files) => {
      let promises: Promise<any>[] = files.map(filename => {
        return new Promise<any>(resolve => {
          let v: Valve = new Valve(
            createReadStream(filename),
            createWriteStream(filename + '.out')
          );

          for (let i = 0; i < pipes.length; i++) {
            v = pipes[i].do(v);
          }

          v.input.pipe(v.output);

          resolve();
        });
      });

      return Promise.all(promises);
    });
}
