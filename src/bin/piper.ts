import minimist = require('minimist');

import { join, isAbsolute } from 'path';

import { runTask } from '../index';

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
  let path = args.file || 'pipefile.js';
  if (!isAbsolute(path)) {
    path = join(process.cwd(), path);
  }
  
  try {
    let pipefile = require(path);
    pipefile.go = function() {
      let t = pipefile[args._[0]];
      runTask(t);
    };
  } catch (e) {
    console.log(`Could not get pipefile (${path}), because error: ${e}`);
  }
}
