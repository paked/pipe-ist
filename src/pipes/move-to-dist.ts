import { relative, join } from 'path';

import { Valve } from '../valve';

export class MoveToDistPipe {
  allows(filename: string): boolean {
    return true;
  }

  do(v: Valve): Valve {
    let dist = join(v.root, 'dist');
    let out = join(dist, relative(v.root, v.output));

    v.output = out;

    return v;
  }
}

export function create(): Pipe {
  return new MoveToDistPipe();
}
