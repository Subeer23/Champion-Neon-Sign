import type { Solution } from './Solution';
export interface SolutionRepository {
  list(signal?: AbortSignal): Promise<Solution[]>;
  getById(id: string, signal?: AbortSignal): Promise<Solution>;
}
