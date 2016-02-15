import Promise = require('any-promise');

import { mkdirSync, stat, createReadStream, createWriteStream } from 'fs';
import { join } from 'path';
import rimraf = require('rimraf');

import { getFiles } from './utils';
import { Pipe } from './pipe';
import { Valve } from './valve';

/*
 * Create a task with a name and a set of pipes for it to run through.
 */
export function task(name: string, pipes: Pipe[], directory = './'): Promise<any> {
  return new Promise<any>((resolve) => {
    let distPath = join(directory, 'dist');
    stat(distPath, (err, stats) => {
      if (err == undefined) {
        rimraf(distPath, (err) => {
          if (err) {
            console.log('something error-y happened!');
          }

          mkdirSync(distPath);
          resolve();
        });

        return;
      }

      mkdirSync(distPath);
      resolve();
    });
  })
  .then(() => {
    return getFiles(directory);
  })
  .then((files) => {
    let promises: Promise<any>[] = files.map((filename) => {
      return new Promise<any>(resolve => {
        let v: Valve = new Valve(
          createReadStream(filename),
          filename
        );

        for (let i = 0; i < pipes.length; i++) {
          let pipe = pipes[i];
          if (pipe.allows(filename)) {
            v = pipes[i].do(v);
          }
        }

        v.input.pipe(createWriteStream(v.output));

        resolve();
      });
    });

    return Promise.all(promises);
  });
}
