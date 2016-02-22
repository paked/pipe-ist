import Promise = require('any-promise');

import { mkdirSync, stat, statSync,  createReadStream, createWriteStream } from 'fs';

import { join, dirname } from 'path';
import rimraf = require('rimraf');
import mkdirp = require('mkdirp');

import { getFiles } from './utils';
import { Pipe } from './pipe';
import { Valve } from './valve';

interface Task {
  name: string
  pipes: Pipe[]
  directory: string
}

export let tasks: { [name: string]: Task; } = {};
let changed: (string) => void = () => undefined;

export function setChanged(fn: (string) => void) {
  changed = fn;
}

export function task(name: string, pipes: Pipe[], directory = process.cwd()): Promise<Task> {
  let t: Task = {
    name: name,
    pipes: pipes,
    directory: directory
  };

  return new Promise<Task>((resolve, reject) => {
    tasks[t.name] = t;
    changed(t.name);
    resolve(t);
  });
}


/*
 * Run a previously defined task.
 */
export function runTask(t: Task): Promise<any> {
  console.log(`Running task ${t.name}...`);

  return new Promise<any>((resolve) => {
    let distPath = join(t.directory, 'dist');
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
    return getFiles(t.directory);
  })
  .then((files) => {
    let promises: Promise<any>[] = files.map((filename) => {
      return new Promise<any>(resolve => {
        let v: Valve = new Valve(
          createReadStream(filename),
          filename,
          t.directory
        );

        for (let i = 0; i < t.pipes.length; i++) {
          let pipe = t.pipes[i];
          if (pipe.allows(filename)) {
            v = pipe.do(v);
          }
        }

        try {
          let stats = statSync(dirname(v.output));
        } catch(e) {
          if (e.code == 'ENOENT') {
            mkdirp.sync(dirname(v.output));
          }
        }
        
        v.input.pipe(createWriteStream(v.output));

        resolve();
      });
    });

    return Promise.all(promises)
      .then(() => {
        console.log(`Finished running task ${t.name}`);

        return Promise.resolve();
      });
  });
}
