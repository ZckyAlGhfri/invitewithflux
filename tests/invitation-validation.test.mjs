import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeInvitationPayload } from '../src/lib/invitation-validation.js';

function validPayload(overrides = {}) {
  return {
    theme: 'luxury',
    themeColor: 'gold',
    namaWanita: ' Alya ',
    namaLengkapWanita: 'Alya Putri',
    ayahWanita: 'Ayah Alya',
    ibuWanita: 'Ibu Alya',
    namaPria: 'Bima',
    namaLengkapPria: 'Bima Putra',
    ayahPria: 'Ayah Bima',
    ibuPria: 'Ibu Bima',
    tanggalAkad: '2027-02-20',
    waktuAkad: '08:30',
    tempatAkad: 'Gedung Pernikahan',
    mapLinkAkad: 'https://maps.google.com/example',
    tanggalResepsi: '2027-02-20',
    waktuResepsi: '11:00',
    tempatResepsi: 'Gedung Pernikahan',
    mapLinkResepsi: 'https://maps.google.com/example',
    fotoWanita: 'https://res.cloudinary.com/demo/image/upload/woman.jpg',
    fotoPria: 'https://res.cloudinary.com/demo/image/upload/man.jpg',
    fotoSampul: 'https://res.cloudinary.com/demo/image/upload/cover.jpg',
    fotoGaleri: ['https://res.cloudinary.com/demo/image/upload/gallery.jpg'],
    alamatKadoFisik: '',
    musicUrl: '/music/example.mp3',
    quotes: 'Kutipan',
    houseRules: [{ icon: 'clock', text: 'Datang tepat waktu' }],
    videoPrewedding: 'https://www.youtube.com/watch?v=abcdefghijk',
    loveStory: [{ year: '2024', title: 'Pertama bertemu', text: 'Cerita' }],
    bankAccounts: [{ bankName: 'Bank', accountNumber: '123', accountName: 'Alya' }],
    ...overrides,
  };
}

test('invitation payload is field-allowlisted and normalized', () => {
  const normalized = normalizeInvitationPayload(validPayload({ unexpectedSecret: 'secret' }));

  assert.equal(normalized.namaWanita, 'Alya');
  assert.equal(normalized.musicUrl, '/music/example.mp3');
  assert.equal(normalized.mapLinkAkad, 'https://maps.google.com/example');
  assert.equal(Object.hasOwn(normalized, 'unexpectedSecret'), false);
});

test('unsafe or credentialed URLs are rejected', () => {
  assert.throws(
    () => normalizeInvitationPayload(validPayload({ mapLinkAkad: 'javascript:alert(1)' })),
    /URL HTTPS/u,
  );
  assert.throws(
    () => normalizeInvitationPayload(validPayload({ fotoSampul: 'https://user:pass@example.com/image.jpg' })),
    /URL HTTPS/u,
  );
});

test('video URL is restricted to YouTube', () => {
  assert.throws(
    () => normalizeInvitationPayload(validPayload({ videoPrewedding: 'https://example.com/watch?v=abcdefghijk' })),
    /YouTube/u,
  );
});

test('impossible dates and invalid times are rejected', () => {
  assert.throws(
    () => normalizeInvitationPayload(validPayload({ tanggalAkad: '2027-02-30' })),
    /Tanggal akad tidak valid/u,
  );
  assert.throws(
    () => normalizeInvitationPayload(validPayload({ waktuAkad: '29:00' })),
    /Waktu akad tidak valid/u,
  );
});

test('nested content is bounded and stripped to known fields', () => {
  const normalized = normalizeInvitationPayload(validPayload({
    houseRules: [{ icon: 'unknown', text: 'Rule', private: 'secret' }],
    loveStory: [{ year: '2024', title: 'Title', text: 'Text', private: 'secret' }],
    bankAccounts: [{ bankName: 'Bank', accountNumber: '123', accountName: 'Name', private: 'secret' }],
  }));

  assert.deepEqual(normalized.houseRules[0], { icon: 'info', text: 'Rule' });
  assert.deepEqual(Object.keys(normalized.loveStory[0]), ['year', 'title', 'text']);
  assert.deepEqual(Object.keys(normalized.bankAccounts[0]), ['bankName', 'accountNumber', 'accountName']);
});
