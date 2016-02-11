import { Transform, Readable, Writable } from 'stream';
import { Valve } from './valve';

export class RemoveAPipe extends Transform {
  do(v: Valve): Valve {
    v.input = v.input.pipe(this);

    return v;
  }

  _transform(chunk: any, encoding: string, callback: any) {
    console.log('doing something');

    chunk = chunk.toString().replace(/a/g, '');

    this.push(chunk);
    callback();
  }
}