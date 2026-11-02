import type {
  DemoSnapshot,
  ProfileInput,
  QuoteInput,
  DemoQuote,
} from '../../account/domain/models';
export type DemoAccess = 'guest' | 'demo' | null;
export interface DemoChallenge {
  id: string;
  expiresAt: number;
  code: string;
}
/** Device-local demo accounts. Not a production identity/security boundary. */
export interface AuthRepository {
  hydrate(legacyAccess?: DemoAccess): Promise<DemoAccess>;
  login(email: string, password: string): Promise<void>;
  signUp(
    name: string,
    email: string,
    password: string,
    phone: string,
  ): Promise<void>;
  setAccess(mode: DemoAccess): Promise<void>;
  requestReset(email: string): Promise<DemoChallenge>;
  verifyCode(challengeId: string, code: string): Promise<void>;
  resetPassword(challengeId: string, password: string): Promise<void>;
  updateProfile(input: ProfileInput): Promise<void>;
  changePassword(current: string, next: string): Promise<void>;
  toggleSavedProject(id: string): Promise<void>;
  saveQuotation(input: QuoteInput, requestId: string): Promise<DemoQuote>;
  saveQuoteDraft(
    form: import('../../quote/domain/Quote').QuoteFormData,
    id: string,
    step: number,
  ): Promise<DemoQuote>;
  submitQuote(
    form: import('../../quote/domain/Quote').QuoteFormData,
    id: string,
  ): Promise<DemoQuote>;
  deleteQuotation(id: string): Promise<void>;
  cancelQuotation(id: string): Promise<void>;
  setNotificationsEnabled(enabled: boolean): Promise<void>;
  markNotificationRead(id: string): Promise<void>;
  clearDemoData(): Promise<void>;
  getSnapshot(): DemoSnapshot;
  subscribe(listener: () => void): () => void;
  clear(): void;
}
export const validEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export const passwordRules = (value: string) => [
  value.length >= 8 && value.length <= 128,
  /[A-Z]/.test(value),
  /[0-9]/.test(value),
  /[^A-Za-z0-9]/.test(value),
];
