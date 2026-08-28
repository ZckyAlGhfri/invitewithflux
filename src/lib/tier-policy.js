const TIER_POLICIES = Object.freeze({
  basic: Object.freeze({
    tier: 'basic',
    activeDays: 90,
    themes: Object.freeze(['luxury']),
    galleryLimit: 0,
    bankAccountLimit: 0,
    loveStoryLimit: 0,
    houseRulesLimit: 0,
    rsvp: false,
    personalizedGuest: false,
    selfEdit: false,
    video: false,
    physicalGiftAddress: false,
    exportGuestbook: false,
  }),
  premium: Object.freeze({
    tier: 'premium',
    activeDays: 180,
    themes: Object.freeze(['luxury', 'classic']),
    galleryLimit: 5,
    bankAccountLimit: 5,
    loveStoryLimit: 0,
    houseRulesLimit: 0,
    rsvp: true,
    personalizedGuest: true,
    selfEdit: true,
    video: false,
    physicalGiftAddress: false,
    exportGuestbook: false,
  }),
  exclusive: Object.freeze({
    tier: 'exclusive',
    activeDays: 365,
    themes: Object.freeze(['luxury', 'classic', 'modern']),
    galleryLimit: 10,
    bankAccountLimit: 5,
    loveStoryLimit: 10,
    houseRulesLimit: 10,
    rsvp: true,
    personalizedGuest: true,
    selfEdit: true,
    video: true,
    physicalGiftAddress: true,
    exportGuestbook: true,
  }),
});

const THEME_COLORS = Object.freeze({
  luxury: Object.freeze(['gold', 'silver', 'rose-gold']),
  classic: Object.freeze(['emerald', 'sapphire', 'ruby', 'gold', 'monochrome']),
  modern: Object.freeze(['slate', 'indigo', 'rose', 'teal', 'amber']),
});

export function normalizeTier(value) {
  const tier = typeof value === 'string' ? value.toLowerCase().trim() : '';
  return Object.hasOwn(TIER_POLICIES, tier) ? tier : 'basic';
}

export function getTierPolicy(value) {
  return TIER_POLICIES[normalizeTier(value)];
}

export function normalizeTheme(theme, tier) {
  const policy = getTierPolicy(tier);
  const normalized = typeof theme === 'string' ? theme.toLowerCase().trim() : '';
  return policy.themes.includes(normalized) ? normalized : policy.themes[0];
}

export function normalizeThemeColor(themeValue, colorValue) {
  const theme = Object.hasOwn(THEME_COLORS, themeValue) ? themeValue : 'luxury';
  const color = typeof colorValue === 'string' ? colorValue.toLowerCase().trim() : '';
  return THEME_COLORS[theme].includes(color) ? color : THEME_COLORS[theme][0];
}

function boundedArray(value, limit) {
  if (!Array.isArray(value) || limit === 0) return [];
  return value.slice(0, limit);
}

export function enforceTierPayload(payload, tierValue) {
  const tier = normalizeTier(tierValue);
  const policy = getTierPolicy(tier);
  const theme = normalizeTheme(payload.theme, tier);

  return {
    ...payload,
    tier,
    theme,
    themeColor: normalizeThemeColor(theme, payload.themeColor),
    fotoGaleri: boundedArray(payload.fotoGaleri, policy.galleryLimit),
    bankAccounts: boundedArray(payload.bankAccounts, policy.bankAccountLimit),
    loveStory: boundedArray(payload.loveStory, policy.loveStoryLimit),
    houseRules: boundedArray(payload.houseRules, policy.houseRulesLimit),
    videoPrewedding: policy.video ? payload.videoPrewedding || null : null,
    alamatKadoFisik: policy.physicalGiftAddress
      ? payload.alamatKadoFisik || null
      : null,
  };
}

export const VALID_TIERS = Object.freeze(Object.keys(TIER_POLICIES));
