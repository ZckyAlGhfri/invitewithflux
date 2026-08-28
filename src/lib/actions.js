'use server';

import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { createAdminSession, deleteAdminSession, requireAdmin } from '@/lib/auth/admin';
import { verifyAdminPassword } from '@/lib/auth/password';
import { deleteCloudinaryImage } from '@/lib/cloudinary-admin';
import {
  normalizeOpaqueToken,
  normalizeRecordId,
  normalizeSlug,
  sanitizeDashboardSearch,
  validateRSVPForm,
} from '@/lib/input-validation';
import { normalizeInvitationPayload } from '@/lib/invitation-validation';
import { getSupabaseAdmin } from '@/lib/supabase';
import { enforceTierPayload, getTierPolicy, normalizeTier } from '@/lib/tier-policy';

function database() {
  return getSupabaseAdmin();
}

function extractPublicId(url) {
  if (typeof url !== 'string') return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(fluxwedding\/[A-Za-z0-9_-]+)(?:\.[A-Za-z0-9]+)?(?:\?.*)?$/u);
  return match?.[1] ?? null;
}

async function cleanupCloudinaryUrls(urls) {
  const publicIds = [...new Set(urls.map(extractPublicId).filter(Boolean))];
  if (publicIds.length === 0) return;
  const results = await Promise.all(publicIds.map(deleteCloudinaryImage));
  const failures = results.filter((result) => !result.success);
  if (failures.length > 0) console.error('Cloudinary cleanup gagal:', failures);
}

function createSecureSlug(namaWanita, namaPria) {
  const slugPart = (value, fallback) => String(value || fallback)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '')
    .slice(0, 40) || fallback;
  return `${slugPart(namaWanita, 'wanita')}-${slugPart(namaPria, 'pria')}-${randomUUID().slice(0, 8)}`;
}

function serializeArray(value) {
  return Array.isArray(value) && value.length > 0 ? JSON.stringify(value) : null;
}

function invitationValues(payload, options = {}) {
  const values = {
    nama_wanita: payload.namaWanita,
    nama_lengkap_wanita: payload.namaLengkapWanita,
    nama_ayah_wanita: payload.ayahWanita,
    nama_ibu_wanita: payload.ibuWanita,
    nama_pria: payload.namaPria,
    nama_lengkap_pria: payload.namaLengkapPria,
    nama_ayah_pria: payload.ayahPria,
    nama_ibu_pria: payload.ibuPria,
    tanggal_akad: payload.tanggalAkad || null,
    waktu_akad: payload.waktuAkad,
    tempat_akad: payload.tempatAkad,
    map_link_akad: payload.mapLinkAkad,
    tanggal_resepsi: payload.tanggalResepsi || null,
    waktu_resepsi: payload.waktuResepsi,
    tempat_resepsi: payload.tempatResepsi,
    map_link_resepsi: payload.mapLinkResepsi,
    foto_wanita: payload.fotoWanita,
    foto_pria: payload.fotoPria,
    foto_sampul: payload.fotoSampul,
    alamat_kado_fisik: payload.alamatKadoFisik,
    music_url: payload.musicUrl,
    quotes: payload.quotes,
    house_rules: serializeArray(payload.houseRules),
    love_story: serializeArray(payload.loveStory),
    updated_at: new Date().toISOString(),
  };

  if (options.includePresentation) {
    values.theme = payload.theme;
    values.theme_color = payload.themeColor || 'gold';
    values.video_prewedding = payload.videoPrewedding || null;
  }
  return values;
}

async function replaceRelations(invitationId, payload, policy) {
  const db = database();
  const { error: deleteBanksError } = await db.from('bank_accounts')
    .delete()
    .eq('invitation_id', invitationId);
  if (deleteBanksError) throw new Error('Gagal memperbarui rekening.');

  if (policy.bankAccountLimit > 0) {
    const banks = (payload.bankAccounts || [])
      .filter((bank) => bank?.bankName && bank?.accountNumber)
      .slice(0, policy.bankAccountLimit)
      .map((bank) => ({
        invitation_id: invitationId,
        bank_name: String(bank.bankName).trim(),
        account_number: String(bank.accountNumber).trim(),
        account_name: String(bank.accountName || '').trim(),
      }));
    if (banks.length > 0) {
      const { error } = await db.from('bank_accounts').insert(banks);
      if (error) throw new Error('Gagal menyimpan rekening.');
    }
  }

  const { error: deleteGalleriesError } = await db.from('galleries')
    .delete()
    .eq('invitation_id', invitationId);
  if (deleteGalleriesError) throw new Error('Gagal memperbarui galeri.');

  const galleries = (payload.fotoGaleri || [])
    .filter((url) => typeof url === 'string' && url.trim())
    .slice(0, policy.galleryLimit)
    .map((url, position) => ({ invitation_id: invitationId, image_url: url, position }));
  if (galleries.length > 0) {
    const { error } = await db.from('galleries').insert(galleries);
    if (error) throw new Error('Gagal menyimpan galeri.');
  }
}

async function loadRsvpInvitation(slugValue) {
  const slug = normalizeSlug(slugValue);
  const { data, error } = await database().from('invitations')
    .select('id, slug, status, is_locked, tier')
    .eq('slug', slug)
    .single();
  if (error || !data || data.status !== 'published' || data.is_locked) {
    throw new Error('Undangan tidak tersedia.');
  }
  if (!getTierPolicy(data.tier).rsvp) {
    throw new Error('Paket undangan ini tidak menyediakan RSVP.');
  }
  return data;
}

export async function getDashboardStats() {
  await requireAdmin();
  const { data, error } = await database().from('invitations').select('status, is_locked');
  if (error) return { total: 0, onboarding: 0, published: 0, locked: 0 };
  return {
    total: data.length,
    onboarding: data.filter((item) => item.status === 'onboarding').length,
    published: data.filter((item) => item.status === 'published' && !item.is_locked).length,
    locked: data.filter((item) => item.is_locked).length,
  };
}

export async function getDashboardData(searchQuery = '', page = 1, limit = 5, sort = 'newest') {
  await requireAdmin();
  const safePage = Math.max(1, Math.min(10_000, Number(page) || 1));
  const safeLimit = Math.max(1, Math.min(50, Number(limit) || 5));
  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;
  const search = sanitizeDashboardSearch(searchQuery);
  let query = database().from('invitations').select('*', { count: 'exact' });

  if (search) {
    query = query.or(`nama_wanita.ilike.%${search}%,nama_pria.ilike.%${search}%,slug.ilike.%${search}%,tier.ilike.%${search}%`);
  }

  const sorting = {
    oldest: ['created_at', true],
    updated_new: ['updated_at', false],
    updated_old: ['updated_at', true],
    name_asc: ['nama_wanita', true],
    name_desc: ['nama_wanita', false],
    tier_asc: ['tier', true],
    tier_desc: ['tier', false],
    newest: ['created_at', false],
  };
  const [column, ascending] = sorting[sort] || sorting.newest;
  const { data, count, error } = await query.order(column, { ascending }).range(from, to);
  if (error) return { data: [], totalPages: 0, totalItems: 0 };
  return {
    data,
    totalPages: Math.ceil((count || 0) / safeLimit),
    totalItems: count || 0,
  };
}

export async function getAdminInvitation(idValue) {
  await requireAdmin();
  const id = normalizeRecordId(idValue);
  const { data, error } = await database().from('invitations')
    .select('*, bank_accounts(*), galleries(*)')
    .eq('id', id)
    .single();
  if (error || !data) throw new Error('Data undangan tidak ditemukan.');
  return data;
}

export async function createTicket(formData) {
  await requireAdmin();
  const tier = normalizeTier(formData.get('tier'));
  const { data, error } = await database().from('invitations').insert([{
    status: 'onboarding',
    tier,
    is_locked: false,
    onboard_token: randomUUID(),
    edit_token: randomUUID(),
  }]).select().single();
  if (error) throw new Error('Gagal membuat tiket.');
  revalidatePath('/dashboard');
  return data;
}

export async function getOnboardingContext(tokenValue) {
  const token = normalizeOpaqueToken(tokenValue);
  const { data, error } = await database().from('invitations')
    .select('tier, status, is_locked')
    .eq('onboard_token', token)
    .single();
  if (error || !data || data.status !== 'onboarding' || data.is_locked) {
    throw new Error('Tiket onboarding tidak valid atau sudah digunakan.');
  }
  return { tier: normalizeTier(data.tier) };
}

export async function submitOnboardingData(tokenValue, formData) {
  const token = normalizeOpaqueToken(tokenValue);
  const db = database();
  const { data: claimed, error: claimError } = await db.from('invitations')
    .update({ status: 'processing', onboard_token: null, updated_at: new Date().toISOString() })
    .eq('onboard_token', token)
    .eq('status', 'onboarding')
    .eq('is_locked', false)
    .select('id, tier')
    .single();
  if (claimError || !claimed) throw new Error('Tiket tidak valid atau sudah digunakan.');

  const payload = enforceTierPayload(normalizeInvitationPayload(formData), claimed.tier);
  const slug = createSecureSlug(payload.namaWanita, payload.namaPria);
  const { error: updateError } = await db.from('invitations').update({
    ...invitationValues(payload, { includePresentation: true }),
    slug,
  }).eq('id', claimed.id).eq('status', 'processing');
  if (updateError) throw new Error('Gagal menyimpan data utama. Hubungi admin untuk pemulihan tiket.');

  await replaceRelations(claimed.id, payload, getTierPolicy(claimed.tier));
  const { error: publishError } = await db.from('invitations')
    .update({ status: 'published', updated_at: new Date().toISOString() })
    .eq('id', claimed.id)
    .eq('status', 'processing');
  if (publishError) throw new Error('Data tersimpan, tetapi undangan belum dapat dipublikasikan.');
  return slug;
}

export async function deleteTicket(idValue) {
  await requireAdmin();
  const id = normalizeRecordId(idValue);
  const db = database();
  const [{ data: invitation }, { data: galleries }] = await Promise.all([
    db.from('invitations').select('foto_wanita, foto_pria, foto_sampul').eq('id', id).single(),
    db.from('galleries').select('image_url').eq('invitation_id', id),
  ]);
  const urls = [
    invitation?.foto_wanita,
    invitation?.foto_pria,
    invitation?.foto_sampul,
    ...(galleries || []).map((item) => item.image_url),
  ].filter(Boolean);

  const { error } = await db.from('invitations').delete().eq('id', id);
  if (error) throw new Error('Gagal menghapus klien.');
  await cleanupCloudinaryUrls(urls);
  revalidatePath('/dashboard');
}

export async function toggleLock(idValue) {
  await requireAdmin();
  const id = normalizeRecordId(idValue);
  const db = database();
  const { data, error: readError } = await db.from('invitations')
    .select('is_locked')
    .eq('id', id)
    .single();
  if (readError || !data) throw new Error('Undangan tidak ditemukan.');
  const { error } = await db.from('invitations')
    .update({ is_locked: !Boolean(data.is_locked), updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error('Gagal mengubah status keamanan.');
  revalidatePath('/dashboard');
}

export async function updateClientByAdmin(idValue, formData) {
  await requireAdmin();
  const id = normalizeRecordId(idValue);
  const db = database();
  const [{ data: invitation, error }, { data: oldGalleries }] = await Promise.all([
    db.from('invitations')
      .select('slug, foto_wanita, foto_pria, foto_sampul')
      .eq('id', id)
      .single(),
    db.from('galleries').select('image_url').eq('invitation_id', id),
  ]);
  if (error || !invitation) throw new Error('Undangan tidak ditemukan.');

  const tier = normalizeTier(formData.tier);
  const payload = enforceTierPayload(normalizeInvitationPayload(formData), tier);
  const slug = formData.slug?.trim()
    ? normalizeSlug(formData.slug)
    : invitation.slug || createSecureSlug(payload.namaWanita, payload.namaPria);
  if (slug !== invitation.slug) {
    const { data: existing } = await db.from('invitations').select('id').eq('slug', slug).maybeSingle();
    if (existing && String(existing.id) !== id) throw new Error(`Link /${slug} sudah digunakan.`);
  }

  const { error: updateError } = await db.from('invitations').update({
    ...invitationValues(payload, { includePresentation: true }),
    tier,
    slug,
    status: 'published',
    onboard_token: null,
  }).eq('id', id);
  if (updateError) throw new Error(`Gagal memperbarui undangan: ${updateError.message}`);
  await replaceRelations(id, payload, getTierPolicy(tier));

  const newGalleryUrls = payload.fotoGaleri || [];
  const urlsToDelete = [
    invitation.foto_wanita && invitation.foto_wanita !== payload.fotoWanita ? invitation.foto_wanita : null,
    invitation.foto_pria && invitation.foto_pria !== payload.fotoPria ? invitation.foto_pria : null,
    invitation.foto_sampul && invitation.foto_sampul !== payload.fotoSampul ? invitation.foto_sampul : null,
    ...(oldGalleries || [])
      .filter((item) => item.image_url && !newGalleryUrls.includes(item.image_url))
      .map((item) => item.image_url),
  ].filter(Boolean);
  await cleanupCloudinaryUrls(urlsToDelete);
  revalidatePath('/dashboard');
  revalidatePath(`/${slug}`);
  return slug;
}

export async function updateClientByToken(tokenValue, formData) {
  const token = normalizeOpaqueToken(tokenValue);
  const db = database();
  const { data: invitation, error } = await db.from('invitations')
    .select('id, slug, tier, status, is_locked, foto_wanita, foto_pria, foto_sampul')
    .eq('edit_token', token)
    .single();
  if (error || !invitation || invitation.status !== 'published' || invitation.is_locked) {
    throw new Error('Token tidak valid atau akses edit telah dicabut.');
  }
  const policy = getTierPolicy(invitation.tier);
  if (!policy.selfEdit) throw new Error('Paket ini tidak menyediakan edit mandiri.');

  const payload = enforceTierPayload(normalizeInvitationPayload(formData), invitation.tier);
  const { data: oldGalleries } = await db.from('galleries')
    .select('image_url')
    .eq('invitation_id', invitation.id);
  const { data: updated, error: updateError } = await db.from('invitations')
    .update(invitationValues(payload))
    .eq('id', invitation.id)
    .eq('edit_token', token)
    .eq('is_locked', false)
    .select('id')
    .single();
  if (updateError || !updated) throw new Error('Gagal memperbarui undangan.');
  await replaceRelations(invitation.id, payload, policy);

  const newGalleryUrls = payload.fotoGaleri || [];
  const urlsToDelete = [
    invitation.foto_wanita && invitation.foto_wanita !== payload.fotoWanita ? invitation.foto_wanita : null,
    invitation.foto_pria && invitation.foto_pria !== payload.fotoPria ? invitation.foto_pria : null,
    invitation.foto_sampul && invitation.foto_sampul !== payload.fotoSampul ? invitation.foto_sampul : null,
    ...(oldGalleries || [])
      .filter((item) => item.image_url && !newGalleryUrls.includes(item.image_url))
      .map((item) => item.image_url),
  ].filter(Boolean);
  await cleanupCloudinaryUrls(urlsToDelete);
  revalidatePath(`/${invitation.slug}`);
}

export async function submitRSVP(slugValue, formData) {
  const invitation = await loadRsvpInvitation(slugValue);
  const values = validateRSVPForm(formData);
  if (invitation.slug.startsWith('demo-')) {
    return {
      success: true,
      isDemo: true,
      data: { id: randomUUID(), ...values, created_at: new Date().toISOString() },
      message: 'Pesan tersampaikan dalam mode demo.',
    };
  }

  const { error } = await database().from('guestbook').insert([{
    invitation_id: invitation.id,
    ...values,
  }]);
  if (error) throw new Error('Gagal mengirim pesan.');
  revalidatePath(`/${invitation.slug}`);
  return { success: true, isDemo: false };
}

export async function getGuestbook(slugValue) {
  const invitation = await loadRsvpInvitation(slugValue);
  const { data, error } = await database().from('guestbook')
    .select('id, nama, kehadiran, pesan, created_at')
    .eq('invitation_id', invitation.id)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) return [];
  return data;
}

export async function deleteRSVP(guestbookIdValue, tokenValue) {
  const guestbookId = normalizeRecordId(guestbookIdValue);
  const token = normalizeOpaqueToken(tokenValue);
  const db = database();
  const { data: invitation, error } = await db.from('invitations')
    .select('id, slug, tier, status, is_locked')
    .eq('edit_token', token)
    .single();
  if (
    error
    || !invitation
    || invitation.status !== 'published'
    || invitation.is_locked
    || !getTierPolicy(invitation.tier).selfEdit
  ) throw new Error('Akses penghapusan tidak valid.');

  const { data: deleted, error: deleteError } = await db.from('guestbook')
    .delete()
    .eq('id', guestbookId)
    .eq('invitation_id', invitation.id)
    .select('id')
    .maybeSingle();
  if (deleteError || !deleted) throw new Error('Pesan tidak ditemukan pada undangan ini.');
  revalidatePath(`/${invitation.slug}`);
}

export async function getAdminProfile() {
  await requireAdmin();
  const { data, error } = await database().from('admin_settings')
    .select('display_name, email')
    .eq('id', 1)
    .single();
  if (error || !data) return null;
  return { ...data, username: process.env.ADMIN_USERNAME || '' };
}

export async function updateAdminProfile(formData) {
  await requireAdmin();
  const displayName = String(formData.get('displayName') || '').trim().slice(0, 80);
  const email = String(formData.get('email') || '').trim().slice(0, 254);
  if (!displayName || !/^\S+@\S+\.\S+$/u.test(email)) {
    throw new Error('Nama tampilan atau email tidak valid.');
  }
  const { error } = await database().from('admin_settings')
    .update({ display_name: displayName, email })
    .eq('id', 1);
  if (error) throw new Error('Gagal memperbarui profil admin.');
  return true;
}

export async function loginAdmin(username, password) {
  const configuredUsername = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!configuredUsername || !passwordHash || !process.env.ADMIN_SESSION_SECRET) {
    throw new Error('Konfigurasi login admin belum lengkap.');
  }

  const passwordValid = await verifyAdminPassword(String(password ?? ''), passwordHash);
  if (String(username ?? '') !== configuredUsername || !passwordValid) {
    throw new Error('Username atau password salah.');
  }
  await createAdminSession();
  return true;
}

export async function logoutAdmin() {
  await deleteAdminSession();
}
