import Promise = require('any-promise');

import { readdir, stat, createReadStream, createWriteStream } from 'fs';
import { Writable, Transform } from 'stream';
import { join } from 'path';

import { getFiles } from './utils';
import { Pipe } from './pipe';
import { Valve } from './valve';
import { RemoveAPipe } from './pipes/remove-a';

class RemoveLetterTransform extends Transform {
  _transform(chunk: any, encoding: string, callback: any) {
    chunk = chunk.toString().replace(/a/g, '');

    this.push(chunk);
    callback();
  }
}

/*
 * Create a task with a name and a set of pipes for it to run through.
 */
export function task(name: string, pipes: Pipe[], directory = './'): Promise<any> {
  return getFiles(directory)
    .then((files) => {
      files.forEach(filename => {
        let v: Valve = new Valve(
          createReadStream(filename),
          createWriteStream(filename + '.out')
        );

        for (let i = 0; i < pipes.length; i++) {
          v = pipes[i].do(v);
        }

        v.input.pipe(v.output);
      });
      
      return Promise.resolve();
    });
}
