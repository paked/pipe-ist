var pi = require('../../../dist/index');

var pipes = [
  new (new require('../../../dist/pipes/compile-typescript.js').CompileTypeScriptPipe)(),
  new (new require('../../../dist/pipes/move-to-bin.js').MoveToBinPipe)()
];

pi.task('default', pipes);
