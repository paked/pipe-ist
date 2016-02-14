import test = require('blue-tape');

import { join } from 'path';
import { EOL } from 'os';

import { task } from './index';
import { readFile } from './utils';
import { RemoveAPipe } from './pipes/remove-a';
import { MoveToBinPipe } from './pipes/move-to-bin';
import { CompileTypeScriptPipe } from './pipes/compile-typescript';

test('index', t => {
  t.test('basic rename rewrite', t => {
    const FIXTURE_DIR = join(__dirname, '__test__/index-task');

    return task('default', [
                  new RemoveAPipe(),
                  new MoveToBinPipe(FIXTURE_DIR)
                ],
                FIXTURE_DIR)
    .then(() => {
      return readFile(join(FIXTURE_DIR, '/dist/sample.txt'), 'utf-8');
    })
    .then(sampleFile => {
      t.deepEqual(sampleFile, [
        `something`,
        ``
      ].join(EOL));
    });
  });

  t.test('compile to TypeScript', t => {
    const FIXTURE_DIR = join(__dirname, '__test__/index-compile-typescript');

    return task('default', [
                  new CompileTypeScriptPipe(),
                  new MoveToBinPipe(FIXTURE_DIR)
                ],
                FIXTURE_DIR).
    then(() => { console.log('finished the thing!'); });
  });
});
