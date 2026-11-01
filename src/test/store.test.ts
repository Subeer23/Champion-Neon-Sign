import { rootApi } from '../app/store/rootApi';
import { createRepositories } from '../app/dependencies/createRepositories';
import { RepositoryError } from '../core/errors/AppError';
import { solutionsApi } from '../features/solutions/state/solutionsApi';
import {
  hydrateOnboarding,
  saveOnboardingCompleted,
} from '../features/onboarding/state/onboardingSlice';
import { createMemoryPreferences, createTestStore } from './createTestStore';

describe('store and injected dependencies', () => {
  it('caches queries without duplicating catalogue data in a slice', async () => {
    const repositories = createRepositories();
    const list = jest.spyOn(repositories.solutions, 'list');
    const store = createTestStore({ repositories });
    const first = store.dispatch(
      solutionsApi.endpoints.getSolutions.initiate(),
    );
    await first.unwrap();
    const second = store.dispatch(
      solutionsApi.endpoints.getSolutions.initiate(),
    );
    await second.unwrap();
    expect(list).toHaveBeenCalledTimes(1);
    expect(Object.keys(store.getState()).sort()).toEqual([
      'auth',
      'catalogApi',
      'onboarding',
    ]);
    first.unsubscribe();
    second.unsubscribe();
    store.dispatch(rootApi.util.resetApiState());
  });
  it('normalizes repository failures and allows a successful retry', async () => {
    const repositories = createRepositories();
    jest
      .spyOn(repositories.solutions, 'list')
      .mockRejectedValueOnce(new RepositoryError('network', 'Offline'));
    const store = createTestStore({ repositories });
    const request = store.dispatch(
      solutionsApi.endpoints.getSolutions.initiate(),
    );
    await expect(request.unwrap()).rejects.toEqual({
      code: 'network',
      message: 'Offline',
    });
    const retry = request.refetch();
    expect((await retry.unwrap()).length).toBeGreaterThan(0);
    request.unsubscribe();
    retry.unsubscribe();
    store.dispatch(rootApi.util.resetApiState());
  });
  it('persists onboarding through an injected storage boundary', async () => {
    const preferences = createMemoryPreferences();
    const store = createTestStore({ preferences });
    await store.dispatch(hydrateOnboarding()).unwrap();
    await store.dispatch(saveOnboardingCompleted(true)).unwrap();
    const nextStore = createTestStore({ preferences });
    await nextStore.dispatch(hydrateOnboarding()).unwrap();
    expect(nextStore.getState().onboarding).toMatchObject({
      completed: true,
      status: 'ready',
    });
  });
  it('does not report persisted completion when storage fails', async () => {
    const preferences = createMemoryPreferences();
    jest
      .spyOn(preferences, 'setOnboardingCompleted')
      .mockRejectedValue(new Error('Disk unavailable'));
    const store = createTestStore({ preferences });
    await store.dispatch(saveOnboardingCompleted(true));
    expect(store.getState().onboarding).toMatchObject({
      completed: false,
      saving: false,
      error: 'Preferences could not be saved.',
    });
  });
});
