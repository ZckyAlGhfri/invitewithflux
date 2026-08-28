import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeOpaqueToken,
  normalizeRecordId,
  normalizeSlug,
  sanitizeDashboardSearch,
  validateRSVPForm,
} from '../src/lib/input-validation.js';

test('record IDs accept integers and UUIDs but reject query fragments', () => {
  assert.equal(normalizeRecordId(123), '123');
  assert.equal(normalizeRecordId('550e8400-e29b-41d4-a716-446655440000'), '550e8400-e29b-41d4-a716-446655440000');
  assert.throws(() => normalizeRecordId('1,2'), /tidak valid/u);
});

test('opaque tokens and slugs use narrow character sets', () => {
  assert.equal(normalizeOpaqueToken('abcDEF_1234567890-xyz'), 'abcDEF_1234567890-xyz');
  assert.equal(normalizeSlug('  Alya-Bima  '), 'alya-bima');
  assert.throws(() => normalizeOpaqueToken('../secret'), /tidak valid/u);
  assert.throws(() => normalizeSlug('alya/bima'), /tidak valid/u);
});

test('dashboard search removes PostgREST filter syntax', () => {
  assert.equal(sanitizeDashboardSearch('  alya,(status.eq.deleted)  '), 'alya status eq deleted');
});

test('RSVP input is bounded and attendance is allowlisted', () => {
  const valid = new FormData();
  valid.set('nama', 'Alya');
  valid.set('kehadiran', 'Hadir');
  valid.set('pesan', 'Selamat berbahagia');
  assert.deepEqual(validateRSVPForm(valid), {
    nama: 'Alya',
    kehadiran: 'Hadir',
    pesan: 'Selamat berbahagia',
  });

  valid.set('kehadiran', 'Administrator');
  assert.throws(() => validateRSVPForm(valid), /kehadiran tidak valid/u);
});
