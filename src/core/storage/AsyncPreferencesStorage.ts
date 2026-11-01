import { createAsyncStorage } from '@react-native-async-storage/async-storage';
import type { PreferencesStorage } from './PreferencesStorage';

export function createPreferencesStorage(): PreferencesStorage {
  const storage = createAsyncStorage('champion-preferences');
  const key = 'onboarding-completed-v1';
  return {
    async getDemoAccess() {
      const mode = await storage.getItem('demo-access-v1');
      return mode === 'guest' || mode === 'demo' ? mode : null;
    },
    async setDemoAccess(mode) {
      if (mode === null) await storage.removeItem('demo-access-v1');
      else await storage.setItem('demo-access-v1', mode);
    },
    async getOnboardingCompleted() {
      return (await storage.getItem(key)) === 'true';
    },
    async setOnboardingCompleted(completed) {
      await storage.setItem(key, String(completed));
    },
  };
}
