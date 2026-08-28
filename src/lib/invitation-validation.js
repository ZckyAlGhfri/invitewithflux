const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/u;
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/u;
const LOCAL_MEDIA_PATTERN = /^\/music\/[A-Za-z0-9][A-Za-z0-9._/-]*$/u;
const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be']);
const HOUSE_RULE_ICONS = new Set([
  'clock', 'dress', 'kids', 'camera', 'gift', 'food', 'warning', 'info', 'love',
]);

function boundedText(value, field, maxLength) {
  const text = String(value ?? '').replaceAll('\0', '').trim();
  if (text.length > maxLength) {
    throw new Error(`${field} melebihi batas ${maxLength} karakter.`);
  }
  return text;
}

function optionalDate(value, field) {
  const date = boundedText(value, field, 10);
  if (!date) return '';
  if (!DATE_PATTERN.test(date)) throw new Error(`${field} tidak valid.`);
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`${field} tidak valid.`);
  }
  return date;
}

function optionalTime(value, field) {
  const time = boundedText(value, field, 8);
  if (time && !TIME_PATTERN.test(time)) throw new Error(`${field} tidak valid.`);
  return time;
}

function optionalHttpsUrl(value, field, options = {}) {
  const raw = boundedText(value, field, 2_048);
  if (!raw) return '';
  if (options.allowLocalMedia && LOCAL_MEDIA_PATTERN.test(raw) && !raw.includes('..')) {
    return raw;
  }
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`${field} harus berupa URL HTTPS yang valid.`);
  }
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error(`${field} harus berupa URL HTTPS yang valid.`);
  }
  if (options.youtubeOnly && !YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) {
    throw new Error(`${field} harus berasal dari YouTube.`);
  }
  return url.toString();
}

function normalizeBanks(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 10).map((bank) => ({
    bankName: boundedText(bank?.bankName, 'Nama bank', 50),
    accountNumber: boundedText(bank?.accountNumber, 'Nomor rekening', 50),
    accountName: boundedText(bank?.accountName, 'Nama pemilik rekening', 100),
  }));
}

function normalizeGallery(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 20)
    .map((url) => optionalHttpsUrl(url, 'URL galeri'))
    .filter(Boolean);
}

function normalizeHouseRules(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 20).map((rule) => {
    const icon = boundedText(rule?.icon, 'Ikon tata tertib', 24);
    return {
      icon: HOUSE_RULE_ICONS.has(icon) ? icon : 'info',
      text: boundedText(rule?.text, 'Tata tertib', 300),
    };
  });
}

function normalizeLoveStory(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 20).map((story) => ({
    year: boundedText(story?.year, 'Tahun Love Story', 20),
    title: boundedText(story?.title, 'Judul Love Story', 100),
    text: boundedText(story?.text, 'Isi Love Story', 800),
  }));
}

export function normalizeInvitationPayload(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Data undangan tidak valid.');
  }

  return {
    theme: boundedText(value.theme, 'Tema', 20).toLowerCase(),
    themeColor: boundedText(value.themeColor, 'Warna tema', 20).toLowerCase(),
    namaWanita: boundedText(value.namaWanita, 'Nama panggilan wanita', 80),
    namaLengkapWanita: boundedText(value.namaLengkapWanita, 'Nama lengkap wanita', 160),
    ayahWanita: boundedText(value.ayahWanita, 'Nama ayah wanita', 120),
    ibuWanita: boundedText(value.ibuWanita, 'Nama ibu wanita', 120),
    namaPria: boundedText(value.namaPria, 'Nama panggilan pria', 80),
    namaLengkapPria: boundedText(value.namaLengkapPria, 'Nama lengkap pria', 160),
    ayahPria: boundedText(value.ayahPria, 'Nama ayah pria', 120),
    ibuPria: boundedText(value.ibuPria, 'Nama ibu pria', 120),
    tanggalAkad: optionalDate(value.tanggalAkad, 'Tanggal akad'),
    waktuAkad: optionalTime(value.waktuAkad, 'Waktu akad'),
    tempatAkad: boundedText(value.tempatAkad, 'Tempat akad', 240),
    mapLinkAkad: optionalHttpsUrl(value.mapLinkAkad, 'Link peta akad'),
    tanggalResepsi: optionalDate(value.tanggalResepsi, 'Tanggal resepsi'),
    waktuResepsi: optionalTime(value.waktuResepsi, 'Waktu resepsi'),
    tempatResepsi: boundedText(value.tempatResepsi, 'Tempat resepsi', 240),
    mapLinkResepsi: optionalHttpsUrl(value.mapLinkResepsi, 'Link peta resepsi'),
    fotoWanita: optionalHttpsUrl(value.fotoWanita, 'Foto wanita'),
    fotoPria: optionalHttpsUrl(value.fotoPria, 'Foto pria'),
    fotoSampul: optionalHttpsUrl(value.fotoSampul, 'Foto sampul'),
    fotoGaleri: normalizeGallery(value.fotoGaleri),
    alamatKadoFisik: boundedText(value.alamatKadoFisik, 'Alamat kado fisik', 600),
    musicUrl: optionalHttpsUrl(value.musicUrl, 'Musik', { allowLocalMedia: true }),
    quotes: boundedText(value.quotes, 'Kutipan', 2_000),
    houseRules: normalizeHouseRules(value.houseRules),
    videoPrewedding: optionalHttpsUrl(value.videoPrewedding, 'Video prewedding', { youtubeOnly: true }),
    loveStory: normalizeLoveStory(value.loveStory),
    bankAccounts: normalizeBanks(value.bankAccounts),
  };
}
