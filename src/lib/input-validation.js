const RECORD_ID_PATTERN = /^(?:\d+|[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/iu;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{16,256}$/u;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

export function normalizeRecordId(value) {
  const id = String(value ?? '').trim();
  if (!RECORD_ID_PATTERN.test(id)) throw new Error('ID data tidak valid.');
  return id;
}

export function normalizeOpaqueToken(value) {
  const token = String(value ?? '').trim();
  if (!TOKEN_PATTERN.test(token)) throw new Error('Token akses tidak valid.');
  return token;
}

export function normalizeSlug(value) {
  const slug = String(value ?? '').toLowerCase().trim();
  if (!SLUG_PATTERN.test(slug) || slug.length > 120) {
    throw new Error('Slug undangan tidak valid.');
  }
  return slug;
}

function boundedText(value, field, min, max) {
  const text = String(value ?? '').trim();
  if (text.length < min || text.length > max) {
    throw new Error(`${field} harus berisi ${min}-${max} karakter.`);
  }
  return text;
}

export function validateRSVPForm(formData) {
  const attendance = String(formData.get('kehadiran') ?? '').trim();
  const allowedAttendance = ['Hadir', 'Tidak Hadir', 'Masih Ragu'];
  if (!allowedAttendance.includes(attendance)) {
    throw new Error('Pilihan kehadiran tidak valid.');
  }

  return {
    nama: boundedText(formData.get('nama'), 'Nama', 2, 80),
    kehadiran: attendance,
    pesan: boundedText(formData.get('pesan'), 'Pesan', 1, 500),
  };
}

export function sanitizeDashboardSearch(value) {
  return String(value ?? '')
    .trim()
    .slice(0, 80)
    .replace(/[,%().]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}
