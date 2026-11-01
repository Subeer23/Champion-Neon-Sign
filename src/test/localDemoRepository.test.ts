import {
  LocalDemoRepository,
  DEMO_DATABASE_KEY,
} from '../features/account/data/LocalDemoRepository';
import { createDemoTestStorage, fastTestHasher } from './demoTestStorage';
import { projectFixtures } from '../mocks/fixtures/projects';
const email = 'demo@example.com',
  password = 'Sample123!',
  phone = '+971500000000';
const quote = {
  name: 'Demo Visitor',
  email,
  phone,
  serviceId: 'signage',
  message: 'A sample signage installation.',
};
const register = (repo: LocalDemoRepository, address = email) =>
  repo.signUp('Demo Visitor', address, password, phone);

describe('persistent local demo accounts', () => {
  it('persists signup, normalized identity and salted credentials without plaintext passwords', async () => {
    const { repo, storage, values } = createDemoTestStorage();
    await register(repo, ' DEMO@EXAMPLE.COM ');
    expect(repo.getSnapshot().profile).toMatchObject({
      name: 'Demo Visitor',
      email,
      phone,
    });
    const raw = values.get(DEMO_DATABASE_KEY)!;
    expect(raw).not.toContain(password);
    expect(raw).toContain('pbkdf2-sha256');
    expect(JSON.parse(raw).accounts[0].credential.iterations).toBe(10000);
    const restored = new LocalDemoRepository(storage, fastTestHasher);
    expect(await restored.hydrate()).toBe('demo');
    expect(restored.getSnapshot().profile?.email).toBe(email);
    await restored.setAccess(null);
    expect(restored.getSnapshot().profile).toBeNull();
    const again = new LocalDemoRepository(storage, fastTestHasher);
    expect(await again.hydrate()).toBeNull();
    await expect(again.login(email, 'wrong')).rejects.toThrow('incorrect');
    await again.login(email, password);
    expect(again.getSnapshot().profile?.email).toBe(email);
  });
  it('passes legacy credential work factors to password verification', async () => {
    const { repo, storage, values } = createDemoTestStorage();
    await register(repo);
    const database = JSON.parse(values.get(DEMO_DATABASE_KEY)!);
    database.accounts[0].credential.iterations = 600000;
    values.set(DEMO_DATABASE_KEY, JSON.stringify(database));
    const verify = jest.fn(fastTestHasher.verify);
    const restored = new LocalDemoRepository(storage, {
      ...fastTestHasher,
      verify,
    });
    await restored.login(email, password);
    expect(verify).toHaveBeenCalledWith(
      password,
      expect.any(String),
      expect.any(String),
      600000,
    );
  });
  it('prevents duplicate emails including concurrent signup and rejects invalid fields', async () => {
    const { repo } = createDemoTestStorage();
    await expect(repo.signUp('', 'bad', 'weak', 'abc')).rejects.toThrow();
    await expect(repo.signUp('Demo', email, 'weak', phone)).rejects.toThrow();
    await expect(repo.signUp('Demo', email, password, 'abc')).rejects.toThrow();
    const results = await Promise.allSettled([
      register(repo),
      register(repo, 'DEMO@EXAMPLE.COM'),
    ]);
    expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1);
    expect(results.filter(r => r.status === 'rejected')).toHaveLength(1);
    await expect(repo.login('unknown@example.com', password)).rejects.toThrow(
      'incorrect',
    );
  });
  it('edits profile and avatar immediately, restores changes and uses the new email at login', async () => {
    const { repo, storage } = createDemoTestStorage();
    await register(repo);
    const listener = jest.fn();
    const off = repo.subscribe(listener);
    await repo.updateProfile({
      name: 'Updated Demo',
      email: 'NEW@example.com',
      phone: '+971 55 000 0000',
      avatar: 'white',
    });
    expect(listener).toHaveBeenCalled();
    off();
    const restored = new LocalDemoRepository(storage, fastTestHasher);
    await restored.hydrate();
    expect(restored.getSnapshot().profile).toMatchObject({
      name: 'Updated Demo',
      email: 'new@example.com',
      phone: '+971550000000',
      avatar: 'white',
    });
    await restored.setAccess(null);
    await expect(restored.login(email, password)).rejects.toThrow();
    await restored.login('new@example.com', password);
  });
  it('verifies old passwords, changes credentials and persists a fresh salt', async () => {
    const { repo, storage, values } = createDemoTestStorage();
    await register(repo);
    const oldSalt = JSON.parse(values.get(DEMO_DATABASE_KEY)!).accounts[0]
      .credential.salt;
    await expect(
      repo.changePassword('incorrect', 'Updated456!'),
    ).rejects.toThrow('Current');
    await expect(repo.changePassword(password, 'weak')).rejects.toThrow();
    await repo.changePassword(password, 'Updated456!');
    expect(
      JSON.parse(values.get(DEMO_DATABASE_KEY)!).accounts[0].credential.salt,
    ).not.toBe(oldSalt);
    expect(values.get(DEMO_DATABASE_KEY)).not.toContain('Updated456!');
    const restored = new LocalDemoRepository(storage, fastTestHasher);
    await restored.hydrate();
    await restored.setAccess(null);
    await expect(restored.login(email, password)).rejects.toThrow();
    await restored.login(email, 'Updated456!');
  });
  it('resets only registered accounts with verified unexpired codes and rejects replay', async () => {
    const { repo } = createDemoTestStorage();
    await register(repo);
    await repo.setAccess(null);
    await expect(repo.requestReset('unknown@example.com')).rejects.toThrow(
      'No demo account',
    );
    const c = await repo.requestReset(email);
    expect(c.code).toMatch(/^\d{6}$/);
    await expect(repo.resetPassword(c.id, 'Reset456!')).rejects.toThrow(
      'Verify',
    );
    await expect(repo.verifyCode(c.id, '000000')).rejects.toThrow('Incorrect');
    await repo.verifyCode(c.id, c.code);
    await expect(repo.resetPassword(c.id, 'weak')).rejects.toThrow();
    await repo.resetPassword(c.id, 'Reset456!');
    await expect(repo.resetPassword(c.id, 'Again789!')).rejects.toThrow(
      'expired',
    );
    await expect(repo.login(email, password)).rejects.toThrow();
    await repo.login(email, 'Reset456!');
  });
  it('expires codes, invalidates resend and caps attempts', async () => {
    const { repo } = createDemoTestStorage();
    await register(repo);
    const old = await repo.requestReset(email),
      current = await repo.requestReset(email);
    await expect(repo.verifyCode(old.id, old.code)).rejects.toThrow('expired');
    jest.advanceTimersByTime(300000);
    await expect(repo.verifyCode(current.id, current.code)).rejects.toThrow(
      'expired',
    );
    const c = await repo.requestReset(email);
    for (let i = 0; i < 5; i++)
      await expect(repo.verifyCode(c.id, '000000')).rejects.toThrow();
    await expect(repo.verifyCode(c.id, c.code)).rejects.toThrow();
  });
  it('isolates saves, drafts, preferences and notifications by immutable account ID', async () => {
    const { repo, storage } = createDemoTestStorage();
    await register(repo);
    const a = repo.getSnapshot().profile!.id;
    await repo.toggleSavedProject(projectFixtures[0]!.id);
    await Promise.all([
      repo.saveQuotation(quote, 'draft-1'),
      repo.saveQuotation(quote, 'draft-1'),
    ]);
    expect(repo.getSnapshot().quotations).toHaveLength(1);
    expect(repo.getSnapshot().notifications).toHaveLength(1);
    const n = repo.getSnapshot().notifications[0]!;
    await repo.markNotificationRead(n.id);
    await repo.setNotificationsEnabled(false);
    await repo.saveQuotation(quote, 'draft-2');
    expect(repo.getSnapshot().notifications).toHaveLength(1);
    await repo.setAccess(null);
    await register(repo, 'second@example.com');
    expect(repo.getSnapshot()).toMatchObject({
      savedProjects: [],
      quotations: [],
      notifications: [],
      notificationsEnabled: true,
    });
    await expect(
      repo.updateProfile({ name: 'Second Demo', email, phone }),
    ).rejects.toThrow('another');
    await repo.setAccess('guest');
    await expect(
      repo.toggleSavedProject(projectFixtures[0]!.id),
    ).rejects.toThrow('Login');
    await expect(repo.saveQuotation(quote, 'guest')).rejects.toThrow('Login');
    await repo.login(email, password);
    expect(repo.getSnapshot().profile?.id).toBe(a);
    expect(repo.getSnapshot().savedProjects).toHaveLength(1);
    expect(repo.getSnapshot().quotations).toHaveLength(2);
    expect(repo.getSnapshot().notifications[0]?.read).toBe(true);
    const restored = new LocalDemoRepository(storage, fastTestHasher);
    await restored.hydrate();
    expect(restored.getSnapshot().notificationsEnabled).toBe(false);
    await restored.toggleSavedProject(projectFixtures[0]!.id);
    expect(restored.getSnapshot().savedProjects).toHaveLength(0);
  });
  it('removes stale saved IDs without breaking the rest of an account', async () => {
    const { repo, storage, values } = createDemoTestStorage();
    await register(repo);
    const db = JSON.parse(values.get(DEMO_DATABASE_KEY)!);
    db.accounts[0].savedProjects = ['removed-project'];
    values.set(DEMO_DATABASE_KEY, JSON.stringify(db));
    const restored = new LocalDemoRepository(storage, fastTestHasher);
    await restored.hydrate();
    await restored.toggleSavedProject('removed-project');
    expect(restored.getSnapshot().savedProjects).toEqual([]);
    await expect(restored.toggleSavedProject('not-real')).rejects.toThrow(
      'no longer',
    );
  });
  it('does not publish failed writes and permits retry, including logout', async () => {
    const { repo, storage } = createDemoTestStorage();
    await register(repo);
    const previous = repo.getSnapshot();
    jest.mocked(storage.setItem).mockRejectedValueOnce(new Error('disk full'));
    await expect(
      repo.updateProfile({ name: 'Changed', email, phone }),
    ).rejects.toThrow('saved');
    expect(repo.getSnapshot()).toBe(previous);
    await repo.updateProfile({ name: 'Changed', email, phone });
    expect(repo.getSnapshot().profile?.name).toBe('Changed');
    jest.mocked(storage.setItem).mockRejectedValueOnce(new Error('disk full'));
    await expect(repo.setAccess(null)).rejects.toThrow();
    expect(repo.getSnapshot().profile).not.toBeNull();
    await repo.setAccess(null);
    expect(repo.getSnapshot().profile).toBeNull();
  });
  it('fails safely on read errors, malformed JSON and unknown versions without overwriting them', async () => {
    const { repo, storage, values } = createDemoTestStorage();
    jest
      .mocked(storage.getItem)
      .mockRejectedValueOnce(new Error('unavailable'));
    await expect(repo.hydrate()).rejects.toThrow('read');
    for (const raw of [
      '{broken',
      '{"version":999,"accounts":[],"session":null}',
    ]) {
      values.set(DEMO_DATABASE_KEY, raw);
      await expect(repo.hydrate()).rejects.toThrow('damaged');
      expect(values.get(DEMO_DATABASE_KEY)).toBe(raw);
    }
    await repo.clearDemoData();
    expect(await repo.hydrate()).toBeNull();
  });
  it('migrates legacy guest access once, rejects legacy fake login and preserves onboarding storage', async () => {
    const { repo, storage, values } = createDemoTestStorage();
    values.set('onboarding-completed-v1', 'true');
    expect(await repo.hydrate('guest')).toBe('guest');
    await repo.setAccess(null);
    expect(
      await new LocalDemoRepository(storage, fastTestHasher).hydrate('guest'),
    ).toBeNull();
    await register(repo);
    await repo.clearDemoData();
    expect(values.get('onboarding-completed-v1')).toBe('true');
    expect(
      await new LocalDemoRepository(storage, fastTestHasher).hydrate('demo'),
    ).toBeNull();
    await expect(repo.login(email, password)).rejects.toThrow();
  });
});
