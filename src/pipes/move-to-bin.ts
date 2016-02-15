import { relative, join } from 'path';

import { Valve } from '../valve';

export class MoveToBinPipe {
  private root: string;

  constructor(root: string) {
    this.root = root;
  }

  allows(filename: string): boolean {
    return true;
  }

  do(v: Valve): Valve {
    let dist = join(this.root, 'dist');
    let out = join(dist, relative(this.root, v.output));

    v.output = out;

    return v;
  }
}
