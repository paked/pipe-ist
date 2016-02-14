import { relative, join } from 'path';

import { Valve } from './valve';

export class MoveToBinPipe {
  private root: string;

  constructor(root: string) {
    this.root = root;
  }

  do(v: Valve): Valve {
    let dist = join(this.root, 'dist');
    let out = join(dist, relative(this.root, v.filename));

    v.output = out;

    return v;
  }
}
