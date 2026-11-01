/* eslint-disable no-bitwise -- UTF-8 encoding and fixed-length digest comparison. */
import { hmac } from '@noble/hashes/hmac';
import { sha256 } from '@noble/hashes/sha256';
import { bytesToHex } from '@noble/hashes/utils';
// Hermes installations may not expose TextEncoder. Encode explicitly; no polyfill/native module.
export function encodeUtf8(value: string): Uint8Array {
  const bytes: number[] = [];
  for (const character of value) {
    let cp = character.codePointAt(0)!;
    if (cp >= 0xd800 && cp <= 0xdfff) cp = 0xfffd;
    if (cp < 0x80) bytes.push(cp);
    else if (cp < 0x800) bytes.push(0xc0 | (cp >> 6), 0x80 | (cp & 63));
    else if (cp < 0x10000)
      bytes.push(0xe0 | (cp >> 12), 0x80 | ((cp >> 6) & 63), 0x80 | (cp & 63));
    else
      bytes.push(
        0xf0 | (cp >> 18),
        0x80 | ((cp >> 12) & 63),
        0x80 | ((cp >> 6) & 63),
        0x80 | (cp & 63),
      );
  }
  return Uint8Array.from(bytes);
}
export interface PasswordHasher {
  hash(password: string, salt: string, rounds?: number): Promise<string>;
  verify(
    password: string,
    salt: string,
    digest: string,
    rounds?: number,
  ): Promise<boolean>;
}
// Local demo only: bounded Hermes work, not a production credential policy.
export const DEMO_PASSWORD_ITERATIONS = 10000;
const yieldToUI = () => new Promise<void>(resolve => setTimeout(resolve, 0));
async function hash(
  password: string,
  salt: string,
  iterations = DEMO_PASSWORD_ITERATIONS,
) {
  if (iterations !== DEMO_PASSWORD_ITERATIONS && iterations !== 600000)
    throw new Error('Unsupported demo password format.');
  const bytes = encodeUtf8(password);
  const prf = hmac.create(sha256, bytes);
  const working = prf.clone();
  const u = new Uint8Array(32);
  const result = new Uint8Array(32);
  try {
    // PBKDF2's single 32-byte block, using noble's HMAC primitive.
    // Real event-loop yields let Hermes render loading/error/navigation feedback.
    await yieldToUI();
    working
      .update(encodeUtf8(salt))
      .update(new Uint8Array([0, 0, 0, 1]))
      .digestInto(u);
    result.set(u);
    for (let start = 1; start < iterations; start += 512) {
      const end = Math.min(iterations, start + 512);
      for (let i = start; i < end; i++) {
        prf._cloneInto(working).update(u).digestInto(u);
        for (let j = 0; j < 32; j++) result[j] = result[j]! ^ u[j]!;
      }
      await yieldToUI();
    }
    return bytesToHex(result);
  } finally {
    bytes.fill(0);
    u.fill(0);
    result.fill(0);
    prf.destroy();
    working.destroy();
  }
}
export const passwordHasher: PasswordHasher = {
  hash,
  async verify(password, salt, digest, rounds) {
    const actual = await hash(password, salt, rounds);
    let difference = actual.length ^ digest.length;
    for (let i = 0; i < actual.length; i++)
      difference |= actual.charCodeAt(i) ^ (digest.charCodeAt(i) || 0);
    return difference === 0;
  },
};
