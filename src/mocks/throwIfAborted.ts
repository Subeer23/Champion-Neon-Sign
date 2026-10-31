import { RepositoryError } from '../core/errors/AppError';
export function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    throw new RepositoryError('cancelled', 'Request cancelled.');
  }
}
