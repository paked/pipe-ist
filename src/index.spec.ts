import test = require('blue-tape');

import { join } from 'path';

import { task } from './index';
import { RemoveAPipe } from './pipes/remove-a';

test('index', t => {
  t.test('basic rename rewrite', t => {
    const FIXTURE_DIR = join(__dirname, '__test__/index-task');

    return task('default', [
      new RemoveAPipe()
    ], FIXTURE_DIR)
    .then(() => {console.log('done')});
  });
});
