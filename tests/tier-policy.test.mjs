import test from 'node:test';
import assert from 'node:assert/strict';

import {
  enforceTierPayload,
  getTierPolicy,
  normalizeThemeColor,
  normalizeTheme,
  normalizeTier,
} from '../src/lib/tier-policy.js';

test('unknown tier falls back to Basic', () => {
  assert.equal(normalizeTier('unknown'), 'basic');
  assert.equal(normalizeTier(null), 'basic');
  assert.equal(getTierPolicy('unknown').rsvp, false);
});

test('theme is constrained by tier', () => {
  assert.equal(normalizeTheme('modern', 'basic'), 'luxury');
  assert.equal(normalizeTheme('classic', 'premium'), 'classic');
  assert.equal(normalizeTheme('modern', 'exclusive'), 'modern');
  assert.equal(normalizeThemeColor('luxury', 'rose-gold'), 'rose-gold');
  assert.equal(normalizeThemeColor('luxury', 'javascript:alert(1)'), 'gold');
});

test('Basic payload cannot smuggle paid features', () => {
  const payload = enforceTierPayload({
    theme: 'modern',
    fotoGaleri: ['one.jpg'],
    bankAccounts: [{ bankName: 'Bank' }],
    loveStory: [{ title: 'Story' }],
    houseRules: [{ text: 'Rule' }],
    videoPrewedding: 'video',
    alamatKadoFisik: 'address',
  }, 'basic');

  assert.equal(payload.theme, 'luxury');
  assert.equal(payload.themeColor, 'gold');
  assert.deepEqual(payload.fotoGaleri, []);
  assert.deepEqual(payload.bankAccounts, []);
  assert.deepEqual(payload.loveStory, []);
  assert.deepEqual(payload.houseRules, []);
  assert.equal(payload.videoPrewedding, null);
  assert.equal(payload.alamatKadoFisik, null);
});

test('Exclusive payload is bounded to its server limits', () => {
  const payload = enforceTierPayload({
    theme: 'modern',
    fotoGaleri: Array.from({ length: 12 }, (_, index) => `${index}.jpg`),
    bankAccounts: Array.from({ length: 7 }, (_, index) => ({ index })),
    loveStory: Array.from({ length: 12 }, (_, index) => ({ index })),
    houseRules: Array.from({ length: 12 }, (_, index) => ({ index })),
  }, 'exclusive');

  assert.equal(payload.theme, 'modern');
  assert.equal(payload.fotoGaleri.length, 10);
  assert.equal(payload.bankAccounts.length, 5);
  assert.equal(payload.loveStory.length, 10);
  assert.equal(payload.houseRules.length, 10);
});
