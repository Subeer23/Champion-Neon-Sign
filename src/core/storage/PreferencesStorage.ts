import type { DemoAccess } from '../../features/auth/domain/AuthRepository';
export interface PreferencesStorage {
  getDemoAccess?(): Promise<DemoAccess>;
  setDemoAccess?(mode: DemoAccess): Promise<void>;
  getOnboardingCompleted(): Promise<boolean>;
  setOnboardingCompleted(completed: boolean): Promise<void>;
}
