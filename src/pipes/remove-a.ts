import { Transform } from 'stream';
import { Valve } from '../valve';

export class RemoveAPipe extends Transform {
  do(v: Valve): Valve {
    v.input = v.input.pipe(this);

    return v;
  }

  allows(filename: string): boolean {
    return true;
  }

  _transform(chunk: any, encoding: string, callback: any) {
    chunk = chunk.toString().replace(/a/g, '');

    this.push(chunk);
    callback();
  }
}
