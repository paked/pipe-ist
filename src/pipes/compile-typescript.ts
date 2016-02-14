import { transpile, ModuleKind} from 'typescript';
import { Transform } from 'stream';
import { extname, parse, format } from 'path';

import { Valve } from '../valve';

export class CompileTypeScriptPipe extends Transform {
  do(v: Valve): Valve {
    let extension = extname(v.output);
    if (extension !== '.ts') {
      return v;
    }

    v.input = v.input.pipe(this);

    // Change file extensions to JavaScript
    v.output = v.output.substr(0, v.output.length - extension.length) + '.js';

    return v;
  }

  _transform(chunk: any, encoding: string, callback: any) {
    console.log('transforming');
    chunk = transpile(chunk.toString(), { module: ModuleKind.CommonJS });

    this.push(chunk);
    callback();
  }
}
