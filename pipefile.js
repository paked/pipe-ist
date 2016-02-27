var join = require('path').join;
var pi = require('./');

pi.task('build', [
  require('./dist/pipes/compile-typescript.js'),
  require('./dist/pipes/move-to-dist.js')
], join(process.cwd(), 'src'));
