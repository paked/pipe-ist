import { Readable, Writable } from 'stream';
import { Valve } from './valve';

/*
 * Pipe controls the flow of data in an `pipe-ist` build stream.
 */
export interface Pipe {
  do(v: Valve): Valve;
}
