import { RepositoryError } from '../../../core/errors/AppError';
import { solutionFixtures } from '../../../mocks/fixtures/solutions';
import { throwIfAborted } from '../../../mocks/throwIfAborted';
import type { Solution } from '../domain/Solution';
import type { SolutionRepository } from '../domain/SolutionRepository';
export class MockSolutionRepository implements SolutionRepository {
  constructor(private readonly items: readonly Solution[] = solutionFixtures) {}
  async list(signal?: AbortSignal): Promise<Solution[]> {
    throwIfAborted(signal);
    return this.items.map(item => ({ ...item }));
  }
  async getById(id: string, signal?: AbortSignal): Promise<Solution> {
    throwIfAborted(signal);
    const item = this.items.find(value => value.id === id);
    if (!item) {
      throw new RepositoryError('not-found', 'Solution unavailable.');
    }
    return { ...item };
  }
}
