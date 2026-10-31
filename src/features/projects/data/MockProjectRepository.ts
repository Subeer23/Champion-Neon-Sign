import { RepositoryError } from '../../../core/errors/AppError';
import { projectFixtures } from '../../../mocks/fixtures/projects';
import { throwIfAborted } from '../../../mocks/throwIfAborted';
import type { Project } from '../domain/Project';
import type { ProjectRepository } from '../domain/ProjectRepository';
const copy = (item: Project): Project => ({
  ...item,
  solutionIds: [...item.solutionIds],
  imageIds: [...item.imageIds],
});
export class MockProjectRepository implements ProjectRepository {
  constructor(private readonly items: readonly Project[] = projectFixtures) {}
  async list(signal?: AbortSignal): Promise<Project[]> {
    throwIfAborted(signal);
    return this.items.map(copy);
  }
  async getById(id: string, signal?: AbortSignal): Promise<Project> {
    throwIfAborted(signal);
    const item = this.items.find(value => value.id === id);
    if (!item) {
      throw new RepositoryError('not-found', 'Project unavailable.');
    }
    return copy(item);
  }
}
