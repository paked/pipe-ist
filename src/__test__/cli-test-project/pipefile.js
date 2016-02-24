var pi = require('../../../dist/index');

var pipes = [
  require('../../../dist/pipes/compile-typescript.js'),
  require('../../../dist/pipes/move-to-dist.js')
];

pi.task('default', pipes);
