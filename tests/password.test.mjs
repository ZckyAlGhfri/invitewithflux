import test from 'node:test';
import assert from 'node:assert/strict';

import { hashAdminPassword, verifyAdminPassword } from '../src/lib/auth/password.js';

test('admin password is stored as a salted scrypt hash', async () => {
  const hash = await hashAdminPassword('correct-horse-battery-staple');

  assert.match(hash, /^scrypt\$/u);
  assert.equal(hash.includes('correct-horse-battery-staple'), false);
  assert.equal(await verifyAdminPassword('correct-horse-battery-staple', hash), true);
  assert.equal(await verifyAdminPassword('wrong-password', hash), false);
});

test('short admin password is rejected', async () => {
  await assert.rejects(hashAdminPassword('short'), /minimal 12 karakter/u);
});
