import { createAppStore } from '../app/store/store';
import { createRepositories } from '../app/dependencies/createRepositories';
import type { AppDependencies } from '../app/dependencies/types';
import type { PreferencesStorage } from '../core/storage/PreferencesStorage';

export function createMemoryPreferences(initial = false): PreferencesStorage {
  let completed = initial;
  return {
    async getOnboardingCompleted() {
      return completed;
    },
    async setOnboardingCompleted(value) {
      completed = value;
    },
  };
}
export function createTestStore(overrides: Partial<AppDependencies> = {}) {
  return createAppStore({
    repositories: createRepositories(),
    preferences: createMemoryPreferences(),
    ...overrides,
  });
}
