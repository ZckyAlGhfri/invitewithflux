import { notFound } from 'next/navigation';
import { normalizeOpaqueToken } from '@/lib/input-validation';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getTierPolicy } from '@/lib/tier-policy';
import EditClient from './EditClient';

export default async function MagicEditPage({ params }) {
  const unwrappedParams = await params;
  let token;
  try {
    token = normalizeOpaqueToken(unwrappedParams.token);
  } catch {
    notFound();
  }

  const { data, error } = await getSupabaseAdmin()
    .from('invitations')
    .select(`
      id, edit_token, tier, status, is_locked, theme, theme_color, slug,
      nama_wanita, nama_lengkap_wanita, nama_ayah_wanita, nama_ibu_wanita,
      nama_pria, nama_lengkap_pria, nama_ayah_pria, nama_ibu_pria,
      tanggal_akad, waktu_akad, tempat_akad, map_link_akad,
      tanggal_resepsi, waktu_resepsi, tempat_resepsi, map_link_resepsi,
      foto_wanita, foto_pria, foto_sampul, alamat_kado_fisik, music_url,
      quotes, house_rules, love_story,
      bank_accounts(bank_name, account_number, account_name),
      galleries(image_url, position),
      guestbook(id, nama, kehadiran, pesan, created_at)
    `)
    .eq('edit_token', token)
    .single();

  if (
    error
    || !data
    || data.status !== 'published'
    || data.is_locked
    || !getTierPolicy(data.tier).selfEdit
  ) notFound();

  return <EditClient initialData={data} />;
}
