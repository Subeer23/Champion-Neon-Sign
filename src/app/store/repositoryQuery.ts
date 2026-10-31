import type { BaseQueryApi } from '@reduxjs/toolkit/query';
import { toAppError } from '../../core/errors/AppError';
import type { AppDependencies, Repositories } from '../dependencies/types';
/** The thunk extra argument is the single dependency-injection boundary. */
export async function repositoryQuery<T>(
  api: BaseQueryApi,
  operation: (repositories: Repositories, signal: AbortSignal) => Promise<T>,
) {
  try {
    const { repositories } = api.extra as AppDependencies;
    return { data: await operation(repositories, api.signal) };
  } catch (error) {
    return { error: toAppError(error) };
  }
}
