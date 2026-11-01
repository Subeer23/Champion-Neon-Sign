/// <reference types="node" />
import { pbkdf2Sync } from 'crypto';
import {
  passwordHasher,
  encodeUtf8,
} from '../features/account/data/passwordHasher';
it('matches standard PBKDF2-SHA256 at the stored 600000 work factor, including Unicode passwords', async () => {
  jest.useRealTimers();
  const password = 'Demo🔐Passé123!',
    salt = 'champion-demo:independent-test-salt';
  const expected = pbkdf2Sync(password, salt, 600000, 32, 'sha256').toString(
    'hex',
  );
  let uiTicked = false;
  const pending = passwordHasher.hash(password, salt, 600000);
  await new Promise<void>(resolve =>
    setTimeout(() => {
      uiTicked = true;
      resolve();
    }, 0),
  );
  expect(uiTicked).toBe(true);
  expect(await pending).toBe(expected);
  expect(await passwordHasher.verify('Wrong123!', salt, expected, 600000)).toBe(
    false,
  );
}, 30000);
it.each(['ASCII', 'عربي 🔐', '\uD800', 'é\u0000'])(
  'encodes UTF-8 correctly without native TextEncoder: %s',
  value => {
    expect(Array.from(encodeUtf8(value))).toEqual(
      Array.from(Buffer.from(value, 'utf8')),
    );
  },
);

it('uses the bounded demo work factor and verifies new credentials', async () => {
  jest.useRealTimers();
  const digest = await passwordHasher.hash('DemoPass123!', 'demo-test-salt');
  expect(digest).toBe(
    pbkdf2Sync('DemoPass123!', 'demo-test-salt', 10000, 32, 'sha256').toString(
      'hex',
    ),
  );
  expect(
    await passwordHasher.verify('DemoPass123!', 'demo-test-salt', digest),
  ).toBe(true);
  expect(
    await passwordHasher.verify('Wrong123!', 'demo-test-salt', digest),
  ).toBe(false);
});
