import minimist = require('minimist');

import { join, isAbsolute } from 'path';

import { runTask, tasks, setChanged } from '../index';

interface Args {
  help: boolean;
  file: string
}

let args = minimist<Args>(process.argv.slice(2), {
  boolean: ['help'],
  string: ['file'],
  alias: {
    help: ['h'],
    file: ['f']
  }
});

if (args.help) {
  console.log(`
Usage: piper <task>

'piper' runs the specified task <task> as defined by the 'pipe.js' file.

Options:
-f      Choose which 'pipe.js' file to run
              `);
} else {
  let taskName = args._[0];

  let path = args.file || 'pipefile.js';
  if (!isAbsolute(path)) {
    path = join(process.cwd(), path);
  }
  
  try {
    let pipefile: any;
    setChanged(function(tn) {
      if (tn != taskName) {
        console.log(`${tn} is not ${taskName}`);
        return;
      }

      runTask(tasks[taskName]);
    });

    pipefile = require(path);
  } catch (e) {
    console.log(`Could not get pipefile (${path}), because error: ${e}`);
  }
}
