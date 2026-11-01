import { z } from 'zod';
import type {
  AuthRepository,
  DemoAccess,
  DemoChallenge,
} from '../../auth/domain/AuthRepository';
import { passwordRules, validEmail } from '../../auth/domain/AuthRepository';
import {
  profileSchema,
  profileInputSchema,
  quoteSchema,
  quoteInputSchema,
  notificationSchema,
  normalizeEmail,
  emptySnapshot,
  type DemoSnapshot,
  type ProfileInput,
  type QuoteInput,
} from '../domain/models';
import {
  DEMO_PASSWORD_ITERATIONS,
  passwordHasher,
  type PasswordHasher,
} from './passwordHasher';
import { projectFixtures } from '../../../mocks/fixtures/projects';
import { solutionFixtures } from '../../../mocks/fixtures/solutions';
export interface DemoStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
export const DEMO_DATABASE_KEY = 'champion-demo:v1:database';
const credentialSchema = z.object({
  algorithm: z.literal('pbkdf2-sha256'),
  iterations: z.union([z.literal(DEMO_PASSWORD_ITERATIONS), z.literal(600000)]),
  salt: z.string().min(16).max(200),
  digest: z.string().regex(/^[a-f0-9]{64}$/),
});
const accountSchema = z.object({
  profile: profileSchema,
  credential: credentialSchema,
  savedProjects: z.array(z.string()).max(1000),
  quotations: z.array(quoteSchema).max(500),
  notifications: z.array(notificationSchema).max(500),
  notificationsEnabled: z.boolean(),
});
const databaseSchema = z.object({
  version: z.literal(1),
  accounts: z.array(accountSchema).max(100),
  session: z.union([
    z.object({ kind: z.literal('guest') }),
    z.object({ kind: z.literal('account'), accountId: z.string() }),
    z.null(),
  ]),
});
type Database = z.infer<typeof databaseSchema>;
const freshDatabase = (): Database => ({
  version: 1,
  accounts: [],
  session: null,
});
let sequence = 0;
// Non-secret unique identifiers/salts, not tokens. No CSPRNG claim in this local demo.
export const localId = () =>
  `${Date.now().toString(36)}-${(++sequence).toString(36)}-${Math.random()
    .toString(36)
    .slice(2)}-${Math.random().toString(36).slice(2)}`;
export class LocalDemoRepository implements AuthRepository {
  private database: Database | null = null;
  private hasStoredDatabase = false;
  private snapshot: DemoSnapshot = emptySnapshot;
  private listeners = new Set<() => void>();
  private queue: Promise<unknown> = Promise.resolve();
  private challenge:
    | (DemoChallenge & {
        accountId: string;
        verified: boolean;
        attempts: number;
      })
    | null = null;
  constructor(
    private storage: DemoStorage,
    private hasher: PasswordHasher = passwordHasher,
    private now: () => number = Date.now,
  ) {}
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private serial<T>(work: () => Promise<T>): Promise<T> {
    const result = this.queue.then(work);
    this.queue = result.catch(() => undefined);
    return result;
  }
  private async load(): Promise<Database> {
    if (this.database) return this.database;
    let raw: string | null;
    try {
      raw = await this.storage.getItem(DEMO_DATABASE_KEY);
    } catch {
      throw new Error('Local demo storage could not be read. Please retry.');
    }
    if (raw === null) return freshDatabase();
    this.hasStoredDatabase = true;
    try {
      const result = databaseSchema.parse(JSON.parse(raw));
      const ids = new Set(result.accounts.map(a => a.profile.id));
      const emails = new Set(result.accounts.map(a => a.profile.email));
      if (
        ids.size !== result.accounts.length ||
        emails.size !== result.accounts.length
      )
        throw new Error();
      if (
        result.session?.kind === 'account' &&
        !ids.has(result.session.accountId)
      )
        result.session = null;
      for (const a of result.accounts) {
        a.savedProjects = [...new Set(a.savedProjects)];
        if (
          new Set(a.quotations.map(q => q.id)).size !== a.quotations.length ||
          new Set(a.notifications.map(n => n.id)).size !==
            a.notifications.length
        )
          throw new Error();
      }
      return result;
    } catch {
      throw new Error(
        'Local demo data is damaged or from an unsupported version. Retry or clear demo data.',
      );
    }
  }
  private publish(db: Database) {
    this.database = db;
    const account =
      db.session?.kind === 'account'
        ? db.accounts.find(
            a =>
              a.profile.id === (db.session as { accountId: string }).accountId,
          )
        : undefined;
    this.snapshot = account
      ? {
          profile: account.profile,
          savedProjects: account.savedProjects,
          quotations: account.quotations,
          notifications: account.notifications,
          notificationsEnabled: account.notificationsEnabled,
        }
      : emptySnapshot;
    this.listeners.forEach(listener => listener());
  }
  private async commit(db: Database) {
    const valid = databaseSchema.parse(db);
    try {
      await this.storage.setItem(DEMO_DATABASE_KEY, JSON.stringify(valid));
    } catch {
      throw new Error('Local demo changes could not be saved. Please retry.');
    }
    this.hasStoredDatabase = true;
    this.publish(valid);
  }
  private async edit<T>(work: (db: Database) => Promise<T> | T): Promise<T> {
    return this.serial(async () => {
      const db = databaseSchema.parse(await this.load());
      const result = await work(db);
      await this.commit(db);
      return result;
    });
  }
  private editAccount<T>(work: (db: Database) => Promise<T> | T): Promise<T> {
    const owner = this.snapshot.profile?.id;
    return this.edit(db => {
      if (!owner)
        throw new Error('Login or sign up to use this demo account feature.');
      if (this.account(db).profile.id !== owner)
        throw new Error(
          'Your demo session changed. Please retry from your account.',
        );
      return work(db);
    });
  }
  private account(db: Database) {
    const session = db.session;
    const account =
      session?.kind === 'account'
        ? db.accounts.find(a => a.profile.id === session.accountId)
        : undefined;
    if (!account)
      throw new Error('Login or sign up to use this demo account feature.');
    return account;
  }
  private checkPassword(value: string) {
    if (!passwordRules(value).every(Boolean))
      throw new Error(
        'Use 8–128 characters with uppercase, a number and a special character.',
      );
  }
  private async credential(password: string) {
    this.checkPassword(password);
    const salt = `champion-demo:${localId()}`;
    return {
      algorithm: 'pbkdf2-sha256' as const,
      iterations: DEMO_PASSWORD_ITERATIONS as typeof DEMO_PASSWORD_ITERATIONS,
      salt,
      digest: await this.hasher.hash(password, salt),
    };
  }
  async hydrate(legacyAccess: DemoAccess = null): Promise<DemoAccess> {
    return this.serial(async () => {
      const raw = await this.load();
      // Old v1 access flags had no registered identity. Preserve guest only.
      if (!this.hasStoredDatabase) {
        if (legacyAccess === 'guest') raw.session = { kind: 'guest' };
        await this.commit(raw);
      } else this.publish(raw);
      return raw.session?.kind === 'account'
        ? 'demo'
        : raw.session?.kind === 'guest'
        ? 'guest'
        : null;
    });
  }
  async signUp(name: string, email: string, password: string, phone: string) {
    const parsed = profileInputSchema.safeParse({ name, email, phone });
    if (!parsed.success)
      throw new Error(
        'Enter a name (2–80 characters), valid email and phone (7–15 digits).',
      );
    await this.edit(async db => {
      if (db.accounts.some(a => a.profile.email === parsed.data.email))
        throw new Error(
          'This email is already registered on this device. Please login.',
        );
      if (db.accounts.length >= 100)
        throw new Error(
          'Demo account limit reached. Clear unused demo data in Settings.',
        );
      const credential = await this.credential(password);
      const id = localId();
      db.accounts.push({
        profile: {
          ...parsed.data,
          id,
          createdAt: new Date(this.now()).toISOString(),
        },
        credential,
        savedProjects: [],
        quotations: [],
        notifications: [],
        notificationsEnabled: true,
      });
      db.session = { kind: 'account', accountId: id };
    });
    this.clear();
  }
  async login(email: string, password: string) {
    if (!validEmail(email) || password.length > 128)
      throw new Error('Enter a valid email and password.');
    await this.edit(async db => {
      const account = db.accounts.find(
        a => a.profile.email === normalizeEmail(email),
      );
      if (
        !account ||
        !(await this.hasher.verify(
          password,
          account.credential.salt,
          account.credential.digest,
          account.credential.iterations,
        ))
      )
        throw new Error(
          'Email or password is incorrect. Register a demo account on this device first.',
        );
      db.session = { kind: 'account', accountId: account.profile.id };
    });
    this.clear();
  }
  async setAccess(mode: DemoAccess) {
    await this.edit(db => {
      if (mode === 'demo') this.account(db);
      else db.session = mode === 'guest' ? { kind: 'guest' } : null;
    });
    this.clear();
  }
  async requestReset(email: string): Promise<DemoChallenge> {
    return this.serial(async () => {
      const db = await this.load();
      const account = db.accounts.find(
        a => a.profile.email === normalizeEmail(email),
      );
      if (!account)
        throw new Error(
          'No demo account is registered with this email on this device.',
        );
      const code = String(Math.floor(Math.random() * 900000) + 100000);
      this.challenge = {
        id: localId(),
        accountId: account.profile.id,
        code,
        expiresAt: this.now() + 300000,
        verified: false,
        attempts: 0,
      };
      const { id, expiresAt } = this.challenge;
      return { id, expiresAt, code };
    });
  }
  private activeChallenge(id: string) {
    if (
      !this.challenge ||
      this.challenge.id !== id ||
      this.now() >= this.challenge.expiresAt
    )
      throw new Error('Demo code expired. Request a new code.');
    return this.challenge;
  }
  async verifyCode(id: string, code: string) {
    await this.serial(async () => {
      const c = this.activeChallenge(id);
      if (c.attempts >= 5) {
        this.clear();
        throw new Error('Too many attempts. Request a new demo code.');
      }
      c.attempts++;
      if (c.code !== code) {
        if (c.attempts >= 5) this.clear();
        throw new Error('Incorrect demo code. Use the code displayed above.');
      }
      c.verified = true;
    });
  }
  async resetPassword(id: string, password: string) {
    await this.edit(async db => {
      const c = this.activeChallenge(id);
      if (!c.verified) throw new Error('Verify the demo code first.');
      const account = db.accounts.find(a => a.profile.id === c.accountId);
      if (!account) throw new Error('Demo account is no longer available.');
      account.credential = await this.credential(password);
      if (
        db.session?.kind === 'account' &&
        db.session.accountId === account.profile.id
      )
        db.session = null;
    });
    this.clear();
  }
  async updateProfile(input: ProfileInput) {
    const parsed = profileInputSchema.safeParse(input);
    if (!parsed.success)
      throw new Error(
        'Enter a name (2–80 characters), valid email and phone (7–15 digits).',
      );
    await this.editAccount(db => {
      const a = this.account(db);
      if (
        db.accounts.some(
          other =>
            other.profile.id !== a.profile.id &&
            other.profile.email === parsed.data.email,
        )
      )
        throw new Error('This email belongs to another demo account.');
      a.profile = { ...a.profile, ...parsed.data };
    });
    this.clear();
  }
  async changePassword(current: string, next: string) {
    await this.editAccount(async db => {
      const a = this.account(db);
      if (
        current.length > 128 ||
        !(await this.hasher.verify(
          current,
          a.credential.salt,
          a.credential.digest,
          a.credential.iterations,
        ))
      )
        throw new Error('Current password is incorrect.');
      a.credential = await this.credential(next);
    });
    this.clear();
  }
  async toggleSavedProject(id: string) {
    await this.editAccount(db => {
      const a = this.account(db);
      if (a.savedProjects.includes(id))
        a.savedProjects = a.savedProjects.filter(p => p !== id);
      else {
        if (!projectFixtures.some(p => p.id === id))
          throw new Error('This project is no longer available.');
        a.savedProjects.push(id);
      }
    });
  }
  async saveQuotation(input: QuoteInput, requestId: string) {
    const parsed = quoteInputSchema.safeParse(input);
    if (!parsed.success)
      throw new Error(
        'Complete name, email, phone, service and a message of 5–3000 characters.',
      );
    if (!solutionFixtures.some(s => s.id === input.serviceId))
      throw new Error('Select an available service.');
    if (input.projectId && !projectFixtures.some(p => p.id === input.projectId))
      throw new Error('This project is no longer available.');
    return this.editAccount(db => {
      const a = this.account(db);
      const existing = a.quotations.find(q => q.id === requestId);
      if (existing) return existing;
      if (a.quotations.length >= 500)
        throw new Error('Local quotation limit reached.');
      const quote = {
        ...parsed.data,
        id: requestId,
        reference: `DEMO-${new Date(this.now()).getUTCFullYear()}-${String(
          a.quotations.length + 1,
        ).padStart(4, '0')}`,
        createdAt: new Date(this.now()).toISOString(),
        status: 'Local demo • Not submitted' as const,
      };
      a.quotations.unshift(quote);
      if (a.notificationsEnabled) {
        a.notifications.unshift({
          id: localId(),
          title: 'Demo quotation saved',
          body: `${quote.reference} is saved on this device only. Nothing was sent to Champion Group.`,
          createdAt: quote.createdAt,
          read: false,
          quoteId: quote.id,
        });
        a.notifications = a.notifications.slice(0, 500);
      }
      return quote;
    });
  }
  async setNotificationsEnabled(enabled: boolean) {
    await this.editAccount(db => {
      this.account(db).notificationsEnabled = enabled;
    });
  }
  async markNotificationRead(id: string) {
    await this.editAccount(db => {
      const item = this.account(db).notifications.find(n => n.id === id);
      if (item) item.read = true;
    });
  }
  async clearDemoData() {
    await this.serial(async () => {
      try {
        await this.storage.setItem(
          DEMO_DATABASE_KEY,
          JSON.stringify(freshDatabase()),
        );
      } catch {
        throw new Error('Demo data could not be cleared. Please retry.');
      }
      this.publish(freshDatabase());
      this.clear();
    });
  }
  clear() {
    this.challenge = null;
  }
}
