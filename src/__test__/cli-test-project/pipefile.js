var pi = require('../../../dist/index');

var pipes = [
  new (new require('../../../dist/pipes/compile-typescript.js').CompileTypeScriptPipe)(),
  new (new require('../../../dist/pipes/move-to-dist.js').MoveToDistPipe)()
];

pi.task('default', pipes);
