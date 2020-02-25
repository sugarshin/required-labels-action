import { Readable } from 'stream';

export interface ExecError extends Error {
  stdout: Readable;
}
