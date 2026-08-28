import test from 'node:test';
import assert from 'node:assert/strict';

import {
  MAX_IMAGE_BYTES,
  detectImageFormat,
  validateImageFile,
} from '../src/lib/image-validation.js';

function fakeFile(bytes, type, size = bytes.length) {
  const data = Uint8Array.from(bytes);
  return {
    size,
    type,
    async arrayBuffer() {
      return data.buffer;
    },
  };
}

test('image format detection checks file signatures', () => {
  assert.equal(detectImageFormat(Uint8Array.from([0xff, 0xd8, 0xff, 0x00])), 'jpeg');
  assert.equal(detectImageFormat(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), 'png');
  assert.equal(detectImageFormat(Uint8Array.from([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50])), 'webp');
  assert.equal(detectImageFormat(Uint8Array.from([1, 2, 3, 4])), null);
});

test('valid PNG file is accepted', async () => {
  const file = fakeFile([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0], 'image/png');
  const result = await validateImageFile(file);

  assert.equal(result.format, 'png');
  assert.equal(result.mime, 'image/png');
});

test('spoofed MIME type is rejected', async () => {
  const file = fakeFile([0xff, 0xd8, 0xff, 0x00], 'image/png');
  await assert.rejects(validateImageFile(file), /tidak sesuai/u);
});

test('oversized image is rejected before upload', async () => {
  const file = fakeFile([0xff, 0xd8, 0xff, 0x00], 'image/jpeg', MAX_IMAGE_BYTES + 1);
  await assert.rejects(validateImageFile(file), /melebihi batas/u);
});
