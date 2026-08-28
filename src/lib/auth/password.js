import 'server-only';

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;
const COST = 16384;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;

export async function hashAdminPassword(password) {
  if (typeof password !== 'string' || password.length < 12) {
    throw new Error('Password admin harus berisi minimal 12 karakter.');
  }
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH, {
    N: COST,
    r: BLOCK_SIZE,
    p: PARALLELIZATION,
    maxmem: 64 * 1024 * 1024,
  });
  return [
    'scrypt',
    COST,
    BLOCK_SIZE,
    PARALLELIZATION,
    salt.toString('base64url'),
    Buffer.from(derived).toString('base64url'),
  ].join('$');
}

export async function verifyAdminPassword(password, encodedHash) {
  try {
    const [algorithm, cost, blockSize, parallelization, saltValue, hashValue] =
      String(encodedHash).split('$');
    if (algorithm !== 'scrypt') return false;

    const expected = Buffer.from(hashValue, 'base64url');
    if (expected.length !== KEY_LENGTH) return false;
    const actual = await scrypt(password, Buffer.from(saltValue, 'base64url'), KEY_LENGTH, {
      N: Number(cost),
      r: Number(blockSize),
      p: Number(parallelization),
      maxmem: 64 * 1024 * 1024,
    });
    return timingSafeEqual(expected, Buffer.from(actual));
  } catch {
    return false;
  }
}
