import { createAsyncStorage } from '@react-native-async-storage/async-storage';
import {
  localId,
  type DemoStorage,
} from '../../account/data/LocalDemoRepository';
import { z } from 'zod';
import { emptyQuoteForm, type QuoteFormData } from '../domain/Quote';
const key = 'champion-quotes:v1:guest-auth-handoff';
const schema = z.object({
  id: z.string().min(1),
  ownerId: z.string().optional(),
  form: z.record(z.string(), z.string().max(3000)),
  step: z.number().int().min(0).max(3),
});
export function createGuestQuoteHandoff(storage: DemoStorage) {
  let queue: Promise<unknown> = Promise.resolve();
  function serial<T>(work: () => Promise<T>): Promise<T> {
    const result = queue.then(work);
    queue = result.catch(() => undefined);
    return result;
  }
  async function read() {
    const raw = await storage.getItem(key);
    if (!raw) return null;
    try {
      return schema.parse(JSON.parse(raw));
    } catch {
      throw new Error('Guest draft could not be read. Please retry.');
    }
  }
  return {
    save(value: { form: QuoteFormData; step: number }) {
      return serial(async () => {
        await storage.setItem(key, JSON.stringify({ ...value, id: localId() }));
      });
    },
    restore(accountId?: string) {
      return serial(async () => {
        const value = await read();
        if (!value || (value.ownerId && value.ownerId !== accountId))
          return null;
        return {
          id: value.id,
          form: { ...emptyQuoteForm, ...value.form },
          step: value.step,
        };
      });
    },
    claim(accountId: string, expectedId?: string) {
      return serial(async () => {
        const value = await read();
        if (!value || (expectedId && value.id !== expectedId))
          throw new Error('Guest draft changed. Please retry.');
        if (value.ownerId && value.ownerId !== accountId)
          throw new Error('This draft belongs to another account.');
        if (value.ownerId !== accountId)
          await storage.setItem(
            key,
            JSON.stringify({ ...value, ownerId: accountId }),
          );
      });
    },
    clear(expectedId?: string) {
      return serial(async () => {
        // An older auth attempt must never remove a newer guest request.
        if (expectedId && (await read())?.id !== expectedId) return;
        await storage.removeItem(key);
      });
    },
  };
}
export const guestQuoteHandoff = createGuestQuoteHandoff(
  createAsyncStorage('champion-demo'),
);
