import Promise = require('any-promise');
import extend = require('xtend');

import { readdir, stat } from 'fs';
import { join } from 'path';

interface doneInterface {
  max: number;
  count: number;
  files: string[];
}

function getFiles(folder: string="./") : Promise<string[]> {
  return new Promise<string[]>((rresolve, reject) => {
    console.log('starting promise chain')
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
          files.forEach((file) => { DONE.files.push(file) });

          console.log(DONE.count, DONE.max);

          if (DONE.count == DONE.max) {
            console.log('resolving');
            rresolve(DONE.files);
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
