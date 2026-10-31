import { createAsyncStorage } from '@react-native-async-storage/async-storage';
import type { PreferencesStorage } from './PreferencesStorage';

export function createPreferencesStorage(): PreferencesStorage {
  const storage = createAsyncStorage('champion-preferences');
  const key = 'onboarding-completed-v1';
  return {
    async getOnboardingCompleted() {
      return (await storage.getItem(key)) === 'true';
    },
    async setOnboardingCompleted(completed) {
      await storage.setItem(key, String(completed));
    },
  };
}
