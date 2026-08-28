export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const MIME_BY_FORMAT = Object.freeze({
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
});

function startsWith(bytes, signature) {
  return signature.every((value, index) => bytes[index] === value);
}

export function detectImageFormat(bytes) {
  if (!(bytes instanceof Uint8Array)) return null;
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return 'jpeg';
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'png';
  if (
    startsWith(bytes, [0x52, 0x49, 0x46, 0x46])
    && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  ) return 'webp';
  return null;
}

export async function validateImageFile(file) {
  if (!file || typeof file.arrayBuffer !== 'function' || file.size === 0) {
    throw new Error('Tidak ada file yang dipilih.');
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error('Ukuran gambar melebihi batas 5 MB.');
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const format = detectImageFormat(new Uint8Array(buffer.subarray(0, 16)));
  if (!format) throw new Error('Isi file bukan gambar JPEG, PNG, atau WebP yang valid.');

  const expectedMime = MIME_BY_FORMAT[format];
  if (file.type && file.type !== expectedMime) {
    throw new Error('Tipe file tidak sesuai dengan isi gambar.');
  }

  return { buffer, format, mime: expectedMime };
}
