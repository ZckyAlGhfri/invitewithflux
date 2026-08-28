import {
  getTierPolicy,
  normalizeTheme,
  normalizeThemeColor,
  normalizeTier,
} from './tier-policy.js';

export const PUBLIC_INVITATION_SELECT = `
  slug,
  status,
  is_locked,
  tier,
  theme,
  theme_color,
  nama_wanita,
  nama_lengkap_wanita,
  nama_ayah_wanita,
  nama_ibu_wanita,
  nama_pria,
  nama_lengkap_pria,
  nama_ayah_pria,
  nama_ibu_pria,
  tanggal_akad,
  waktu_akad,
  tempat_akad,
  map_link_akad,
  tanggal_resepsi,
  waktu_resepsi,
  tempat_resepsi,
  map_link_resepsi,
  foto_wanita,
  foto_pria,
  foto_sampul,
  alamat_kado_fisik,
  music_url,
  quotes,
  house_rules,
  video_prewedding,
  love_story,
  bank_accounts(bank_name, account_number, account_name),
  galleries(image_url, position)
`;

export const PUBLIC_METADATA_SELECT = `
  slug,
  status,
  is_locked,
  tier,
  nama_wanita,
  nama_pria,
  tanggal_akad,
  foto_sampul
`;

function boundedRelation(value, limit, fields) {
  if (!Array.isArray(value) || limit === 0) return [];
  return value.slice(0, limit).map((item) =>
    Object.fromEntries(fields.map((field) => [field, item?.[field] ?? null])),
  );
}

function parseArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function boundedContent(value, limit, fields) {
  return parseArray(value).slice(0, limit).map((item) =>
    Object.fromEntries(fields.map(([field, maxLength]) => [
      field,
      String(item?.[field] ?? '').trim().slice(0, maxLength),
    ])),
  );
}

export function toPublicInvitation(record, options = {}) {
  const tier = normalizeTier(options.tierOverride || record?.tier);
  const policy = getTierPolicy(tier);
  const theme = normalizeTheme(record?.theme, tier);

  return {
    slug: record?.slug ?? '',
    tier,
    theme,
    theme_color: normalizeThemeColor(theme, record?.theme_color),
    nama_wanita: record?.nama_wanita ?? '',
    nama_lengkap_wanita: record?.nama_lengkap_wanita ?? '',
    nama_ayah_wanita: record?.nama_ayah_wanita ?? '',
    nama_ibu_wanita: record?.nama_ibu_wanita ?? '',
    nama_pria: record?.nama_pria ?? '',
    nama_lengkap_pria: record?.nama_lengkap_pria ?? '',
    nama_ayah_pria: record?.nama_ayah_pria ?? '',
    nama_ibu_pria: record?.nama_ibu_pria ?? '',
    tanggal_akad: record?.tanggal_akad ?? null,
    waktu_akad: record?.waktu_akad ?? '',
    tempat_akad: record?.tempat_akad ?? '',
    map_link_akad: record?.map_link_akad ?? '',
    tanggal_resepsi: record?.tanggal_resepsi ?? null,
    waktu_resepsi: record?.waktu_resepsi ?? '',
    tempat_resepsi: record?.tempat_resepsi ?? '',
    map_link_resepsi: record?.map_link_resepsi ?? '',
    foto_wanita: record?.foto_wanita ?? '',
    foto_pria: record?.foto_pria ?? '',
    foto_sampul: record?.foto_sampul ?? '',
    music_url: record?.music_url ?? '',
    quotes: record?.quotes ?? '',
    alamat_kado_fisik: policy.physicalGiftAddress
      ? record?.alamat_kado_fisik ?? ''
      : '',
    house_rules: boundedContent(record?.house_rules, policy.houseRulesLimit, [
      ['icon', 24],
      ['text', 300],
    ]),
    video_prewedding: policy.video ? record?.video_prewedding ?? null : null,
    love_story: boundedContent(record?.love_story, policy.loveStoryLimit, [
      ['year', 20],
      ['title', 100],
      ['text', 800],
    ]),
    bank_accounts: boundedRelation(
      record?.bank_accounts,
      policy.bankAccountLimit,
      ['bank_name', 'account_number', 'account_name'],
    ),
    galleries: boundedRelation(
      record?.galleries,
      policy.galleryLimit,
      ['image_url', 'position'],
    ),
    capabilities: {
      rsvp: policy.rsvp,
      personalizedGuest: policy.personalizedGuest,
      galleryLimit: policy.galleryLimit,
      selfEdit: policy.selfEdit,
      exportGuestbook: policy.exportGuestbook,
    },
  };
}
