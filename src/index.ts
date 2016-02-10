import Promise = require('any-promise');

import { readdir, stat, createReadStream } from 'fs';
import { join } from 'path';

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
};
