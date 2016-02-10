import test = require('blue-tape');

import { join, relative } from 'path';
import { getFiles } from './index';

test('index', t => {
  t.test('list files', t => {
    const FIXTURE_DIR = join(__dirname, '__test__');

    return getFiles(FIXTURE_DIR)
      .then(paths => {
        let filenames = paths.map(filename => relative(FIXTURE_DIR, filename)).sort();

        t.deepEqual(filenames, [
          'src/simple.txt',
          'pipe.js'
        ].sort());
      });
  });
});

