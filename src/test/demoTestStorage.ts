/// <reference types="node" />
import { createHash } from 'crypto';
import {
  LocalDemoRepository,
  type DemoStorage,
} from '../features/account/data/LocalDemoRepository';
import type { PasswordHasher } from '../features/account/data/passwordHasher';
// Fast injected hasher for repository/UI behavior tests ONLY. Production uses PBKDF2.
const digest = (password: string, salt: string) =>
  createHash('sha256')
    .update(salt + '|' + password)
    .digest('hex');
export const fastTestHasher: PasswordHasher = {
  hash: async (p, s) => digest(p, s),
  verify: async (p, s, d) => digest(p, s) === d,
};
export function createDemoTestStorage(values = new Map<string, string>()) {
  const storage: DemoStorage = {
    getItem: jest.fn(async key => values.get(key) ?? null),
    setItem: jest.fn(async (key, value) => {
      values.set(key, value);
    }),
    removeItem: jest.fn(async key => {
      values.delete(key);
    }),
  };
  return {
    storage,
    values,
    repo: new LocalDemoRepository(storage, fastTestHasher),
  };
}
