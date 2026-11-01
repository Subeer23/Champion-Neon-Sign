import { createDemoTestStorage } from './demoTestStorage';
import { createAppStore } from '../app/store/store';
import { createRepositories } from '../app/dependencies/createRepositories';
import type { AppDependencies } from '../app/dependencies/types';
import type { PreferencesStorage } from '../core/storage/PreferencesStorage';

export function createMemoryPreferences(initial = false): PreferencesStorage {
  let completed = initial;
  let access: 'guest' | 'demo' | null = initial ? 'guest' : null;
  return {
    async getDemoAccess() {
      return access;
    },
    async setDemoAccess(value) {
      access = value;
    },
    async getOnboardingCompleted() {
      return completed;
    },
    async setOnboardingCompleted(value) {
      completed = value;
    },
  };
}
const databases = new WeakMap<PreferencesStorage, Map<string, string>>();
export function createTestStore(overrides: Partial<AppDependencies> = {}) {
  const preferences = overrides.preferences ?? createMemoryPreferences();
  const values = databases.get(preferences) ?? new Map<string, string>();
  databases.set(preferences, values);
  const { repo: demo } = createDemoTestStorage(values);
  return createAppStore({
    demo,
    repositories: createRepositories(),
    preferences,
    ...overrides,
  });
}
