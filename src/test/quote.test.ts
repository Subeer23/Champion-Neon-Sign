import {
  emptyQuoteForm,
  validateQuote,
  validateQuoteStep,
} from '../features/quote/domain/Quote';
import { createDemoTestStorage, fastTestHasher } from './demoTestStorage';
import {
  LocalDemoRepository,
  DEMO_DATABASE_KEY,
} from '../features/account/data/LocalDemoRepository';
import { guestQuoteHandoff } from '../features/quote/state/guestQuoteHandoff';
const form = {
  ...emptyQuoteForm,
  solutionId: 'signage',
  title: 'Shopfront',
  description: 'A new illuminated sign',
  location: 'Dubai',
  name: 'Demo Visitor',
  email: 'demo@example.com',
  phone: '+971500000000',
};
const register = (repo: LocalDemoRepository, email = form.email) =>
  repo.signUp(form.name, email, 'Sample123!', form.phone);
it('validates each step, optional dates and contact methods', () => {
  expect(validateQuote(form)).toBeNull();
  expect(validateQuoteStep(emptyQuoteForm, 0)).toMatch(/solution/);
  expect(validateQuoteStep(emptyQuoteForm, 1)).toMatch(/title/);
  expect(validateQuoteStep(emptyQuoteForm, 2)).toMatch(/name/);
  expect(validateQuote({ ...form, completionDate: '2027-02-30' })).toMatch(
    /date/,
  );
  expect(validateQuote({ ...form, phone: 'abc' })).toMatch(/phone/);
  expect(validateQuote({ ...form, contactMethod: 'Fax' })).toMatch(/contact/);
});
it('persists incomplete drafts and restores form and step after restart using account keys', async () => {
  const { repo, storage, values } = createDemoTestStorage();
  await register(repo);
  const partial = { ...emptyQuoteForm, name: 'D', phone: '+97', email: 'dem' };
  const draft = await repo.saveQuoteDraft(partial, 'draft-1', 2);
  expect(draft.status).toBe('Draft');
  const restored = new LocalDemoRepository(storage, fastTestHasher);
  await restored.hydrate();
  expect(restored.getSnapshot().quotations[0]).toMatchObject({
    id: 'draft-1',
    form: partial,
    step: 2,
  });
  expect(
    [...values.keys()].some(key =>
      key.startsWith(
        `champion-quotes:v1:account:${repo.getSnapshot().profile!.id}:`,
      ),
    ),
  ).toBe(true);
});
it('submits a draft once under concurrent taps and preserves history, details and unique references after deletion', async () => {
  const { repo } = createDemoTestStorage();
  await register(repo);
  await repo.saveQuoteDraft(form, 'one', 1);
  const [first, second] = await Promise.all([
    repo.submitQuote(form, 'one'),
    repo.submitQuote(form, 'one'),
  ]);
  expect(first.reference).toBe(second.reference);
  expect(repo.getSnapshot().quotations).toHaveLength(1);
  expect(first).toMatchObject({ status: 'Submitted (Demo)', form, step: 3 });
  await repo.cancelQuotation('one');
  expect(repo.getSnapshot().quotations[0]!.status).toBe('Cancelled (Demo)');
  await repo.deleteQuotation('one');
  expect(repo.getSnapshot().quotations).toHaveLength(0);
  expect((await repo.submitQuote(form, 'two')).reference).not.toBe(
    first.reference,
  );
});
it('isolates drafts, history, edits and deletions between accounts', async () => {
  const { repo } = createDemoTestStorage();
  await register(repo);
  await repo.saveQuoteDraft(form, 'private', 1);
  await register(repo, 'second@example.com');
  expect(repo.getSnapshot().quotations).toEqual([]);
  await repo.deleteQuotation('private');
  await repo.login(form.email, 'Sample123!');
  expect(repo.getSnapshot().quotations[0]!.id).toBe('private');
});
it('retains the committed draft when the account document or database pointer write fails', async () => {
  const { repo, storage } = createDemoTestStorage();
  await register(repo);
  await repo.saveQuoteDraft(form, 'one', 1);
  const original = storage.setItem;
  storage.setItem = jest.fn(async (key, value) => {
    if (key === DEMO_DATABASE_KEY) throw new Error('disk full');
    await original(key, value);
  });
  await expect(repo.submitQuote(form, 'one')).rejects.toThrow(/saved/);
  const restarted = new LocalDemoRepository(storage, fastTestHasher);
  await restarted.hydrate();
  expect(restarted.getSnapshot().quotations[0]!.status).toBe('Draft');
});
it('rejects damaged account documents and guest account submissions', async () => {
  const { repo, storage, values } = createDemoTestStorage();
  await expect(repo.submitQuote(form, 'one')).rejects.toThrow(/Login/);
  await register(repo);
  await repo.submitQuote(form, 'one');
  const database = JSON.parse(values.get(DEMO_DATABASE_KEY)!);
  values.set(database.accounts[0].quoteKey, '{broken');
  await expect(
    new LocalDemoRepository(storage, fastTestHasher).hydrate(),
  ).rejects.toThrow(/damaged/);
});
it('preserves guest fields and step across authentication and clears the handoff after adoption', async () => {
  await guestQuoteHandoff.save({ form, step: 3 });
  const handoff = await guestQuoteHandoff.restore();
  expect(handoff).toMatchObject({ form, step: 3 });
  const { repo } = createDemoTestStorage();
  await register(repo);
  await repo.saveQuoteDraft(handoff!.form, handoff!.id, handoff!.step);
  await guestQuoteHandoff.clear();
  expect(await guestQuoteHandoff.restore()).toBeNull();
  expect(repo.getSnapshot().quotations[0]).toMatchObject({ form, step: 3 });
});
it('reports storage read failures without clearing stored account data', async () => {
  const { repo, storage, values } = createDemoTestStorage();
  await register(repo);
  await repo.saveQuoteDraft(form, 'read-failure', 1);
  const before = new Map(values);
  storage.getItem = jest.fn(async () => {
    throw new Error('unavailable');
  });
  await expect(
    new LocalDemoRepository(storage, fastTestHasher).hydrate(),
  ).rejects.toThrow(/read/);
  expect(values).toEqual(before);
});
it('preserves the previous account document when staging a quotation fails', async () => {
  const { repo, storage } = createDemoTestStorage();
  await register(repo);
  await repo.saveQuoteDraft(form, 'write-failure', 1);
  const original = storage.setItem;
  storage.setItem = jest.fn(async (key, value) => {
    if (key.startsWith('champion-quotes:')) throw new Error('disk full');
    await original(key, value);
  });
  await expect(repo.submitQuote(form, 'write-failure')).rejects.toThrow(
    /saved/,
  );
  const restored = new LocalDemoRepository(storage, fastTestHasher);
  await restored.hydrate();
  expect(restored.getSnapshot().quotations[0]?.status).toBe('Draft');
});
it('binds an adopted guest handoff to its first account even if cleanup fails', async () => {
  await guestQuoteHandoff.save({ form, step: 2 });
  await guestQuoteHandoff.claim('account-a');
  expect(await guestQuoteHandoff.restore('account-a')).toMatchObject({ form });
  expect(await guestQuoteHandoff.restore('account-b')).toBeNull();
  expect(await guestQuoteHandoff.restore()).toBeNull();
  await expect(guestQuoteHandoff.claim('account-b')).rejects.toThrow(
    /another account/,
  );
  await guestQuoteHandoff.clear();
});
it('does not write or notify subscribers when re-saving an unchanged draft', async () => {
  const { repo, storage } = createDemoTestStorage();
  await register(repo);
  await repo.saveQuoteDraft(form, 'unchanged', 1);
  const before = repo.getSnapshot();
  const listener = jest.fn();
  const unsubscribe = repo.subscribe(listener);
  jest.mocked(storage.setItem).mockClear();
  await repo.saveQuoteDraft({ ...form }, 'unchanged', 1);
  expect(storage.setItem).not.toHaveBeenCalled();
  expect(repo.getSnapshot()).toBe(before);
  expect(listener).not.toHaveBeenCalled();
  unsubscribe();
});
it('duplicate submissions do not write, notify or create another local notification', async () => {
  const { repo, storage } = createDemoTestStorage();
  await register(repo);
  await repo.submitQuote(form, 'idempotent');
  const before = repo.getSnapshot();
  const listener = jest.fn();
  repo.subscribe(listener);
  jest.mocked(storage.setItem).mockClear();
  await Promise.all([
    repo.submitQuote(form, 'idempotent'),
    repo.submitQuote(form, 'idempotent'),
  ]);
  expect(storage.setItem).not.toHaveBeenCalled();
  expect(repo.getSnapshot()).toBe(before);
  expect(listener).not.toHaveBeenCalled();
  expect(repo.getSnapshot().notifications).toHaveLength(1);
});
it('retains unchanged snapshot fields and writes only metadata for a contact-profile update', async () => {
  const { repo, storage } = createDemoTestStorage();
  await register(repo);
  await repo.saveQuoteDraft(form, 'profile-update', 1);
  const before = repo.getSnapshot();
  jest.mocked(storage.setItem).mockClear();
  await repo.updateProfile({ ...before.profile!, name: 'Updated Visitor' });
  const after = repo.getSnapshot();
  expect(after.profile?.name).toBe('Updated Visitor');
  expect(after.quotations).toBe(before.quotations);
  expect(after.notifications).toBe(before.notifications);
  expect(storage.setItem).toHaveBeenCalledTimes(1);
  expect(storage.setItem).toHaveBeenCalledWith(
    DEMO_DATABASE_KEY,
    expect.any(String),
  );
});
it('keeps profile identity stable while a changed quotation is saved', async () => {
  const { repo } = createDemoTestStorage();
  await register(repo);
  const profile = repo.getSnapshot().profile;
  await repo.saveQuoteDraft(form, 'new-draft', 1);
  expect(repo.getSnapshot().profile).toBe(profile);
});
