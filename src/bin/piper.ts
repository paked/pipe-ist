#!/usr/bin/env node

import { join, isAbsolute } from 'path';

import { getArgs } from '../utils';

console.log('Welcome to piper!');

let args = getArgs();

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
  } catch (e) {
    console.log(`Could not get pipefile (${path}), because error: ${e}`);
  }
}
