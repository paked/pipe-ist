import Promise = require('any-promise');
import extend = require('xtend');

import { readdir, stat } from 'fs';
import { join } from 'path';

function getFiles(folder: string="./") : Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    readdir(folder, (err, files) => {
      interface doneInterface {
        max: number;
        count: number;
        files: string[];
      }

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
          files.forEach((file) => { DONE.files.push(file) });

          if (DONE.count == DONE.max) {
            resolve(DONE.files);
          }
        });

        DONE.count++;
      })
    });
  });
}

export function task(name: string, pipes: string[]) {
  getFiles()
  .then((files) => { console.log(files) });
};
