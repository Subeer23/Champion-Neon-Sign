export interface PreferencesStorage {
  getOnboardingCompleted(): Promise<boolean>;
  setOnboardingCompleted(completed: boolean): Promise<void>;
}
