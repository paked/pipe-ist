import { transpile, ModuleKind} from 'typescript';
import { Transform } from 'stream';
import { extname, parse, format } from 'path';

import { Valve } from '../valve';
import { Pipe } from '../pipe';

export class CompileTypeScriptPipe extends Transform {
  allows(filename): boolean {
    return extname(filename) == '.ts';
  }

  do(v: Valve): Valve {
    v.input = v.input.pipe(this);
  
    let extension = extname(v.output);

    // Change file extensions to JavaScript
    v.output = v.output.substr(0, v.output.length - extension.length) + '.js';

    return v;
  }

  _transform(chunk: any, encoding: string, callback: any) {
    chunk = transpile(chunk.toString(), { module: ModuleKind.CommonJS });

    this.push(chunk);
    callback();
  }
}

export function create(): Pipe {
  return new CompileTypeScriptPipe();
}
