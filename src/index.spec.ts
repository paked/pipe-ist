import test = require('blue-tape');

import { join } from 'path';
import { EOL } from 'os';

import { task } from './index';
import { readFile } from './utils';
import { RemoveAPipe } from './pipes/remove-a';

test('index', t => {
  t.test('basic rename rewrite', t => {
    const FIXTURE_DIR = join(__dirname, '__test__/index-task');

    return task('default', [
                  new RemoveAPipe()
                ],
                FIXTURE_DIR)
    .then(() => {
      return readFile(join(FIXTURE_DIR, 'sample.txt.out'), 'utf-8');
    }).then(sampleFile => {
      console.log(sampleFile);
      t.deepEqual(sampleFile, [
        `something`,
        ``
      ].join(EOL));
    });
  });
});
