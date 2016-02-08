import Promise = require('any-promise');

import { readdir, stat } from 'fs';

function getFiles(folder: string="./") : Promise<string[]> {
  return new Promise<string[]>(resolve, reject) => {
    readdir(folder, (err, files) => {
      let results []string = [];

      files.forEach((file) => {
        var file = files[i];

        (file, results) => {
          stat(file, (err, stats) => {
            if (err) throw err;

            if (stats.isDir()) {
              getFiles(folder + file).
                then((files) => {results.push(files...)});
            }
          });
        }(file, results);
      })
    });
  });
}

export function task(name: string, pipes: string[]) {
};
