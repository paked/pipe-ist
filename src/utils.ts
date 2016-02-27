import Promise = require('any-promise');
import thenify = require('thenify');
import minimist = require('minimist');

import { readdir, stat } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

// `fs.readFile` in promise form, courtesy https://github.com/typings/typings/blob/master/src/utils/fs.ts#L40
export const readFile: (path: string, encoding: string) => Promise<string> = thenify<string, string, string>(fs.readFile);

/*
 * Retrieve all of the files within a given folder.
 */
export function getFiles(folder: string = './'): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    readdir(folder, (err, files) => {
      let promises: Promise<any>[] = files.map((filename) => {
        return new Promise<any>((resolve, reject) => {
          filename = join(folder, filename);

          stat(filename, (err, stats) => {
            if (err) {
              console.log(err);
              throw err;
            }

            if (stats.isDirectory()) {
              getFiles(filename)
              .then((files) => {
                resolve(files);
              });
            } else {
              resolve([filename]);
            }
          });
        });
      });

      Promise.all(promises)
      .then(filenames => {
        // Flatten filenames array (string[][] -> string[])
        let files = [].concat.apply([], filenames);
        resolve(files);
      });
    });
  });
}

interface Args {
  help: boolean;
  file: string
}

export function getArgs(raw = process.argv.slice(2)): Args & minimist.ParsedArgs {
  return minimist<Args>(raw, {
    boolean: ['help'],
    string: ['file'],
    alias: {
      help: ['h'],
      file: ['f']
    }
  });
}
