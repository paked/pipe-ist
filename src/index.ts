import Promise = require('any-promise');
import extend = require('xtend');

import { readdir, stat, createReadStream } from 'fs';
import { join } from 'path';

interface doneInterface {
  max: number;
  count: number;
  files: string[];
}

function getFiles(folder: string="./") : Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    readdir(folder, (err, files) => {
      let DONE : doneInterface = {
        max: files.length,
        count: 0,
        files: []
      };

      files.forEach((file, i) => {
        var file = join(folder, files[i]);

        new Promise<string[]>((resolve, reject) => {
          stat(file, (err, stats) => {
            if (err) throw err;

            if (stats.isDirectory()) {
              getFiles(file)
              .then((files) => {
                resolve(files);
              });
            } else {
              resolve([file]);
            }
          });
        })
        .then((files) => {
          let ps : Array<Promise<any>> = files.map((filename) => {
            return new Promise<any>((resolve, reject) => {
              DONE.files.push(filename);
              resolve();
            });
          });

          return Promise.all(ps);
        })
        .then(() => {
          DONE.count++;
          if (DONE.count == DONE.max) {
            resolve(DONE.files);
          }
        });
      })
    });
  });
}

export function task(name: string, pipes: string[]) {
  getFiles()
  .then((files) => {
    console.log(files);
    files.forEach((filename) => {
      let file = createReadStream(filename);

      file.on('data', (chunk : any) => {
        console.log(chunk.toString());
      });
    });
  });
};
