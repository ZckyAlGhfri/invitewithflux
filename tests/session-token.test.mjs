import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ADMIN_SESSION_TTL_SECONDS,
  createAdminSessionToken,
  verifyAdminSessionToken,
} from '../src/lib/auth/session-token.js';

process.env.ADMIN_SESSION_SECRET = 'test-only-session-secret-with-at-least-32-characters';

test('admin session token is signed and valid for the configured lifetime', async () => {
  const token = await createAdminSessionToken({ now: 1_000 });
  const payload = await verifyAdminSessionToken(token, { now: 1_001 });

  assert.equal(payload.role, 'admin');
  assert.equal(payload.issuedAt, 1_000);
  assert.equal(payload.expiresAt, 1_000 + ADMIN_SESSION_TTL_SECONDS);
});

test('tampered admin session token is rejected', async () => {
  const token = await createAdminSessionToken({ now: 1_000 });
  const tampered = `${token.startsWith('a') ? 'b' : 'a'}${token.slice(1)}`;

  assert.equal(await verifyAdminSessionToken(tampered, { now: 1_001 }), null);
});

test('expired admin session token is rejected', async () => {
  const token = await createAdminSessionToken({ now: 1_000, ttlSeconds: 10 });

  assert.equal(await verifyAdminSessionToken(token, { now: 1_010 }), null);
});

test('short session secret is rejected', async () => {
  const original = process.env.ADMIN_SESSION_SECRET;
  process.env.ADMIN_SESSION_SECRET = 'too-short';
  await assert.rejects(createAdminSessionToken(), /minimal 32 karakter/u);
  process.env.ADMIN_SESSION_SECRET = original;
});
