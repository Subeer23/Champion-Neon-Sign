import { createRepositories } from '../app/dependencies/createRepositories';
import { MockSolutionRepository } from '../features/solutions/data/MockSolutionRepository';
import { MockProjectRepository } from '../features/projects/data/MockProjectRepository';
import { createHttpClient } from '../core/network/createHttpClient';

describe('mock repository contracts', () => {
  it('uses mocks by default without creating a network client', async () => {
    const repositories = createRepositories();
    expect(repositories.solutions).toBeInstanceOf(MockSolutionRepository);
    expect(repositories.projects).toBeInstanceOf(MockProjectRepository);
    const items = await repositories.solutions.list();
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(await repositories.solutions.getById(item.id)).toEqual(item);
    }
  });
  it('returns independent copies, including nested project arrays', async () => {
    const repository = new MockProjectRepository();
    const item = await repository.getById('branding');
    item.solutionIds.push('modified');
    expect((await repository.getById('branding')).solutionIds).toEqual([
      'branding',
    ]);
  });
  it('handles empty data, missing IDs, and cancellation', async () => {
    const solutions = new MockSolutionRepository([]);
    expect(await solutions.list()).toEqual([]);
    await expect(solutions.getById('missing')).rejects.toMatchObject({
      code: 'not-found',
    });
    await expect(
      new MockProjectRepository().getById('missing'),
    ).rejects.toMatchObject({ code: 'not-found' });
    const controller = new AbortController();
    controller.abort();
    await expect(solutions.list(controller.signal)).rejects.toMatchObject({
      code: 'cancelled',
    });
  });
  it('rejects an insecure future API host before any request', () => {
    expect(() => createHttpClient('http://example.invalid')).toThrow('HTTPS');
  });
});
