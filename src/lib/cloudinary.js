'use server';

import { requireAdmin } from '@/lib/auth/admin';
import { uploadCloudinaryImage } from '@/lib/cloudinary-admin';
import { validateImageFile } from '@/lib/image-validation';
import { normalizeOpaqueToken, normalizeRecordId } from '@/lib/input-validation';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getTierPolicy } from '@/lib/tier-policy';

const VALID_PURPOSES = new Set(['cover', 'profile', 'gallery']);

async function authorizeUpload(access) {
  const kind = access?.kind;
  const purpose = VALID_PURPOSES.has(access?.purpose) ? access.purpose : null;
  if (!purpose) throw new Error('Tujuan upload tidak valid.');

  if (kind === 'admin') {
    await requireAdmin();
    if (!access.invitationId || purpose !== 'gallery') return;
    const db = getSupabaseAdmin();
    const { data } = await db.from('invitations')
      .select('tier')
      .eq('id', normalizeRecordId(access.invitationId))
      .single();
    if (!data || getTierPolicy(data.tier).galleryLimit === 0) {
      throw new Error('Paket undangan ini tidak menyediakan galeri.');
    }
    return;
  }

  if (kind !== 'onboarding' && kind !== 'edit') {
    throw new Error('Akses upload tidak valid.');
  }
  const db = getSupabaseAdmin();
  const token = normalizeOpaqueToken(access?.token);
  const tokenColumn = kind === 'onboarding' ? 'onboard_token' : 'edit_token';
  const { data } = await db.from('invitations')
    .select('tier, status, is_locked')
    .eq(tokenColumn, token)
    .single();
  if (!data || data.is_locked) throw new Error('Akses upload tidak valid atau telah dicabut.');
  if (kind === 'onboarding' && data.status !== 'onboarding') {
    throw new Error('Tiket onboarding sudah tidak aktif.');
  }
  if (kind === 'edit' && data.status !== 'published') {
    throw new Error('Akses edit belum aktif atau telah dicabut.');
  }

  const policy = getTierPolicy(data.tier);
  if (kind === 'edit' && !policy.selfEdit) {
    throw new Error('Paket ini tidak menyediakan edit mandiri.');
  }
  if (purpose === 'gallery' && policy.galleryLimit === 0) {
    throw new Error('Paket ini tidak menyediakan galeri.');
  }
}

export async function uploadImage(formData, access) {
  try {
    await authorizeUpload(access);
    const file = formData.get('file');
    const { buffer, mime } = await validateImageFile(file);
    const result = await uploadCloudinaryImage(buffer, mime);

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Upload Error:', error);
    return { success: false, error: error.message };
  }
}
