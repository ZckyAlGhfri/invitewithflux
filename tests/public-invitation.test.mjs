import test from 'node:test';
import assert from 'node:assert/strict';

import { toPublicInvitation } from '../src/lib/public-invitation.js';

function sourceRecord(overrides = {}) {
  return {
    id: 'secret-database-id',
    edit_token: 'secret-edit-token',
    onboarding_token: 'secret-onboarding-token',
    slug: 'demo-invitation',
    tier: 'basic',
    theme: 'modern',
    nama_wanita: 'Alya',
    nama_pria: 'Bima',
    bank_accounts: [{ bank_name: 'Bank', account_number: '123', account_name: 'Alya', private_note: 'secret' }],
    galleries: [{ image_url: 'one.jpg', position: 0, private_note: 'secret' }],
    house_rules: JSON.stringify([{ icon: 'clock', text: 'Datang tepat waktu', private_note: 'secret' }]),
    love_story: JSON.stringify([{ year: '2024', title: 'Pertama bertemu', text: 'Cerita', private_note: 'secret' }]),
    ...overrides,
  };
}

test('public DTO never includes database IDs or access tokens', () => {
  const dto = toPublicInvitation(sourceRecord());
  const serialized = JSON.stringify(dto);

  assert.equal(Object.hasOwn(dto, 'id'), false);
  assert.equal(Object.hasOwn(dto, 'edit_token'), false);
  assert.equal(Object.hasOwn(dto, 'onboarding_token'), false);
  assert.equal(serialized.includes('secret-edit-token'), false);
  assert.equal(serialized.includes('secret-onboarding-token'), false);
});

test('Basic public DTO strips paid data and capabilities', () => {
  const dto = toPublicInvitation(sourceRecord());

  assert.equal(dto.theme, 'luxury');
  assert.deepEqual(dto.bank_accounts, []);
  assert.deepEqual(dto.galleries, []);
  assert.deepEqual(dto.house_rules, []);
  assert.deepEqual(dto.love_story, []);
  assert.equal(dto.capabilities.rsvp, false);
  assert.equal(dto.capabilities.selfEdit, false);
});

test('Exclusive public content is bounded and field-allowlisted', () => {
  const stories = Array.from({ length: 12 }, (_, index) => ({
    year: String(index),
    title: `Story ${index}`,
    text: 'Text',
    private_note: 'secret',
  }));
  const dto = toPublicInvitation(sourceRecord({
    tier: 'exclusive',
    theme: 'modern',
    love_story: JSON.stringify(stories),
    house_rules: [{ icon: 'clock', text: 'Rule', private_note: 'secret' }],
  }));

  assert.equal(dto.theme, 'modern');
  assert.equal(dto.love_story.length, 10);
  assert.deepEqual(Object.keys(dto.love_story[0]), ['year', 'title', 'text']);
  assert.deepEqual(Object.keys(dto.house_rules[0]), ['icon', 'text']);
  assert.equal(dto.capabilities.rsvp, true);
  assert.equal(JSON.stringify(dto).includes('private_note'), false);
});
