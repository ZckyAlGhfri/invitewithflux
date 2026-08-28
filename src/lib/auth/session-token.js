export const ADMIN_SESSION_COOKIE = 'flux_admin_session';
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 8;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET harus berisi minimal 32 karakter.');
  }
  return encoder.encode(secret);
}

function bytesToBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '');
}

function base64UrlToBytes(value) {
  const padded = value.replaceAll('-', '+').replaceAll('_', '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function getSigningKey(usage) {
  return crypto.subtle.importKey(
    'raw',
    getSecret(),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    [usage],
  );
}

export async function createAdminSessionToken(options = {}) {
  const issuedAt = options.now ?? Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + (options.ttlSeconds ?? ADMIN_SESSION_TTL_SECONDS);
  const payload = bytesToBase64Url(encoder.encode(JSON.stringify({
    version: 1,
    role: 'admin',
    issuedAt,
    expiresAt,
  })));
  const key = await getSigningKey('sign');
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return `${payload}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

export async function verifyAdminSessionToken(token, options = {}) {
  try {
    if (typeof token !== 'string') return null;
    const [payloadPart, signaturePart, extra] = token.split('.');
    if (!payloadPart || !signaturePart || extra) return null;

    const key = await getSigningKey('verify');
    const validSignature = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlToBytes(signaturePart),
      encoder.encode(payloadPart),
    );
    if (!validSignature) return null;

    const payload = JSON.parse(decoder.decode(base64UrlToBytes(payloadPart)));
    const now = options.now ?? Math.floor(Date.now() / 1000);
    if (
      payload?.version !== 1
      || payload?.role !== 'admin'
      || !Number.isInteger(payload?.issuedAt)
      || !Number.isInteger(payload?.expiresAt)
      || payload.expiresAt <= now
      || payload.issuedAt > now + 60
    ) return null;

    return payload;
  } catch {
    return null;
  }
}
