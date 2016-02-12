import test = require('blue-tape');

import { join } from 'path';
import { EOL } from 'os';

import { task } from './index';
import { readFile } from './utils';
import { RemoveAPipe } from './pipes/remove-a';
import { MoveToBinPipe } from './pipes/move-to-bin';

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
    }).then(sampleFile => {
      t.deepEqual(sampleFile, [
        `something`,
        ``
      ].join(EOL));
    });
  });
});
