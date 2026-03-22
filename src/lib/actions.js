'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getDashboardStats() {
  const { data, error } = await supabase.from('invitations').select('status, is_locked');
  if (error) return { total: 0, onboarding: 0, published: 0, locked: 0 };
  
  return {
    total: data.length,
    onboarding: data.filter(d => d.status === 'onboarding').length,
    published: data.filter(d => d.status === 'published' && !d.is_locked).length,
    locked: data.filter(d => d.is_locked).length,
  };
}

// 1. Fungsi Ambil Data Dashboard
// --- FUNGSI DASHBOARD (DIPERBARUI DENGAN SORTING) ---
export async function getDashboardData(searchQuery = '', page = 1, limit = 5, sort = 'newest') {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('invitations').select('*', { count: 'exact' });

  // Filter Search (Mencakup Nama, Slug, dan Tier)
  if (searchQuery) {
    query = query.or(`nama_wanita.ilike.%${searchQuery}%,nama_pria.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%,tier.ilike.%${searchQuery}%`);
  }

  // Logika Sorting
  switch (sort) {
    case 'oldest': query = query.order('created_at', { ascending: true }); break;
    case 'updated_new': query = query.order('updated_at', { ascending: false }); break;
    case 'updated_old': query = query.order('updated_at', { ascending: true }); break;
    case 'name_asc': query = query.order('nama_wanita', { ascending: true }); break;
    case 'name_desc': query = query.order('nama_wanita', { ascending: false }); break;
    case 'tier_asc': query = query.order('tier', { ascending: true }); break; // basic -> exclusive -> premium
    case 'tier_desc': query = query.order('tier', { ascending: false }); break;
    case 'newest': 
    default: query = query.order('created_at', { ascending: false }); break;
  }

  const { data, count, error } = await query.range(from, to);
  if (error) return { data: [], totalPages: 0, totalItems: 0 };
  
  return { data, totalPages: Math.ceil((count || 0) / limit), totalItems: count };
}

// 2. Fungsi Buat Tiket Klien Baru dengan Parameter TIER
export async function createTicket(formData) {
  
  // Tangkap pilihan dropdown dari Dashboard (name="tier")
  const tierPilihan = formData.get('tier') || 'basic';

  const { data, error } = await supabase
    .from('invitations')
    // Simpan status dan tier pilihan tersebut ke database
    .insert([{ status: 'onboarding', tier: tierPilihan }]) 
    .select()
    .single();

  if (error) {
    console.error('Error create ticket:', error);
    throw new Error('Gagal membuat tiket');
  }

  // Auto-refresh halaman dashboard dari server!
  revalidatePath('/dashboard'); 
  return data;
}

// 3. Fungsi Utility: Slug Generator Anti-Tabrakan
export async function generateSecureSlug(namaWanita, namaPria) {
  // Jika nama kosong (di-skip), beri nama default agar URL tetap cantik
  const baseW = namaWanita ? namaWanita.toLowerCase().trim() : 'wanita';
  const baseP = namaPria ? namaPria.toLowerCase().trim() : 'pria';
  const baseSlug = `${baseW}-${baseP}`.replace(/\s+/g, '-');
  const randomChars = Math.random().toString(36).substring(2, 6); 
  return `${baseSlug}-${randomChars}`;
}

export async function submitOnboardingData(token, formData) {
  // 1. Cek token valid dan ambil ID serta Tier-nya
  const { data: invite, error: checkError } = await supabase
    .from('invitations')
    .select('id, tier')
    .eq('onboard_token', token)
    .single();

  if (checkError || !invite) throw new Error('Tiket tidak valid atau sudah kadaluarsa.');

  // 2. Generate Secure Slug
  const secureSlug = await generateSecureSlug(formData.namaWanita, formData.namaPria);

  // 3. Update tabel utama (invitations)
  const { error: updateError } = await supabase
    .from('invitations')
    .update({
      nama_wanita: formData.namaWanita, nama_lengkap_wanita: formData.namaLengkapWanita,
      nama_ayah_wanita: formData.ayahWanita, nama_ibu_wanita: formData.ibuWanita,
      nama_pria: formData.namaPria, nama_lengkap_pria: formData.namaLengkapPria,
      nama_ayah_pria: formData.ayahPria, nama_ibu_pria: formData.ibuPria,

      tanggal_akad: formData.tanggalAkad || null, 
      waktu_akad: formData.waktuAkad,
      tempat_akad: formData.tempatAkad, 
      map_link_akad: formData.mapLinkAkad, 
      
      tanggal_resepsi: formData.tanggalResepsi || null, 
      waktu_resepsi: formData.waktuResepsi,
      tempat_resepsi: formData.tempatResepsi, 
      map_link_resepsi: formData.mapLinkResepsi, 

      foto_wanita: formData.fotoWanita, foto_pria: formData.fotoPria, foto_sampul: formData.fotoSampul,
      alamat_kado_fisik: formData.alamatKadoFisik, music_url: formData.musicUrl,
      quotes: formData.quotes, house_rules: formData.houseRules,
      love_story: formData.loveStory && formData.loveStory.length > 0 ? JSON.stringify(formData.loveStory) : null,
      slug: secureSlug, status: 'published', onboard_token: null 
    })
    .eq('id', invite.id);

  if (updateError) throw new Error('Gagal menyimpan data utama.');

  const isPremiumOrAbove = invite.tier === 'premium' || invite.tier === 'exclusive';
  
  // 4. Proses Kado Digital (Bank Accounts)
  if (isPremiumOrAbove && formData.bankAccounts && formData.bankAccounts.length > 0) {
    const banksToInsert = formData.bankAccounts
      .filter(bank => bank.bankName && bank.accountNumber) 
      .map((bank) => ({
        invitation_id: invite.id, bank_name: bank.bankName, account_number: bank.accountNumber, account_name: bank.accountName
      }));

    if (banksToInsert.length > 0) {
      await supabase.from('bank_accounts').insert(banksToInsert);
    }
  }

  // 5. PROSES GALERI DINAMIS (BULK INSERT ke tabel galleries)
  if (isPremiumOrAbove && formData.fotoGaleri && formData.fotoGaleri.length > 0) {
    const validPhotos = formData.fotoGaleri.filter(url => typeof url === 'string' && url.trim() !== '');
    const galleriesToInsert = validPhotos.map((url, index) => ({
      invitation_id: invite.id,
      image_url: url,
      position: index 
    }));
    
    if (galleriesToInsert.length > 0) {
      await supabase.from('galleries').insert(galleriesToInsert);
    }
  }

  return secureSlug;
}

// ==========================================
// FITUR BARU ADMIN
// ==========================================

// A. Fungsi Hapus Klien
export async function deleteTicket(id) {
  const { error } = await supabase.from('invitations').delete().eq('id', id);
  if (error) throw new Error('Gagal menghapus klien');
  revalidatePath('/dashboard');
}

// B. Fungsi Kunci/Buka Undangan (Nonaktifkan)
export async function toggleLock(id, currentStatus) {
  const { error } = await supabase.from('invitations').update({ is_locked: !currentStatus }).eq('id', id);
  if (error) throw new Error('Gagal mengubah status keamanan');
  revalidatePath('/dashboard');
}

// --- FUNGSI ADMIN UPDATE ---
export async function updateClientByAdmin(id, formData) {
  const { data: invite } = await supabase.from('invitations').select('slug, status').eq('id', id).single();
  
  let secureSlug = invite.slug;
  if (!secureSlug || invite.status === 'onboarding') {
    secureSlug = await generateSecureSlug(formData.namaWanita, formData.namaPria);
  }

  const newTier = formData.tier || 'basic';
  const isPremiumOrAbove = newTier === 'premium' || newTier === 'exclusive';

  // 1. UPDATE TABEL UTAMA (HAPUS foto_galeri dari sini!)
  const { error: updateError } = await supabase.from('invitations').update({
    tier: newTier, 
    nama_wanita: formData.namaWanita, nama_lengkap_wanita: formData.namaLengkapWanita,
    nama_ayah_wanita: formData.ayahWanita, nama_ibu_wanita: formData.ibuWanita,  
    nama_pria: formData.namaPria, nama_lengkap_pria: formData.namaLengkapPria,
    nama_ayah_pria: formData.ayahPria, nama_ibu_pria: formData.ibuPria,      
    tanggal_akad: formData.tanggalAkad || null, waktu_akad: formData.waktuAkad,
    tempat_akad: formData.tempatAkad, map_link_akad: formData.mapLinkAkad,
    tanggal_resepsi: formData.tanggalResepsi || null, waktu_resepsi: formData.waktuResepsi,
    tempat_resepsi: formData.tempatResepsi, map_link_resepsi: formData.mapLinkResepsi,
    foto_wanita: formData.fotoWanita, foto_pria: formData.fotoPria, foto_sampul: formData.fotoSampul,
    alamat_kado_fisik: isPremiumOrAbove ? formData.alamatKadoFisik : null,
    music_url: formData.musicUrl, quotes: formData.quotes, house_rules: formData.houseRules,
    love_story: formData.loveStory && formData.loveStory.length > 0 ? JSON.stringify(formData.loveStory) : null,
    slug: secureSlug, status: 'published', onboard_token: null 
  }).eq('id', id);

  if (updateError) throw new Error('Error DB: ' + updateError.message);

  // 2. UPDATE BANK ACCOUNTS
  await supabase.from('bank_accounts').delete().eq('invitation_id', id);
  if (isPremiumOrAbove && formData.bankAccounts?.length > 0) {
    const banks = formData.bankAccounts.filter(b => b.bankName && b.accountNumber).map(b => ({
      invitation_id: id, bank_name: b.bankName, account_number: b.accountNumber, account_name: b.accountName
    }));
    if (banks.length > 0) await supabase.from('bank_accounts').insert(banks);
  }

  // 3. UPDATE GALLERIES (BULK INSERT)
  await supabase.from('galleries').delete().eq('invitation_id', id); // Sapu bersih galeri lama
  if (isPremiumOrAbove && formData.fotoGaleri?.length > 0) {
    const validPhotos = formData.fotoGaleri.filter(url => typeof url === 'string' && url.trim() !== '');
    const galleriesToInsert = validPhotos.map((url, index) => ({
      invitation_id: id,
      image_url: url,
      position: index // Urutan foto (1, 2, 3...)
    }));
    
    if (galleriesToInsert.length > 0) {
      await supabase.from('galleries').insert(galleriesToInsert);
    }
  }

  revalidatePath('/dashboard');
  return secureSlug;
}

// --- FUNGSI SUBMIT MAGIC EDIT KLIEN ---
export async function updateClientByToken(token, formData) {
  const { data: invite, error } = await supabase.from('invitations').select('id, tier, is_locked').eq('edit_token', token).single();
  if (error || !invite) throw new Error('Token tidak valid.');
  if (invite.is_locked) throw new Error('Akses Ditolak: Undangan ini telah dikunci oleh Admin.');

  const isPremiumOrAbove = invite.tier === 'premium' || invite.tier === 'exclusive';

  // 1. UPDATE TABEL UTAMA (HAPUS foto_galeri dari sini!)
  await supabase.from('invitations').update({
    nama_wanita: formData.namaWanita, nama_lengkap_wanita: formData.namaLengkapWanita, 
    nama_ayah_wanita: formData.ayahWanita, nama_ibu_wanita: formData.ibuWanita,  
    nama_pria: formData.namaPria, nama_lengkap_pria: formData.namaLengkapPria, 
    nama_ayah_pria: formData.ayahPria, nama_ibu_pria: formData.ibuPria,      
    tanggal_akad: formData.tanggalAkad || null, waktu_akad: formData.waktuAkad, tempat_akad: formData.tempatAkad, map_link_akad: formData.mapLinkAkad,
    tanggal_resepsi: formData.tanggalResepsi || null, waktu_resepsi: formData.waktuResepsi, tempat_resepsi: formData.tempatResepsi, map_link_resepsi: formData.mapLinkResepsi,
    foto_wanita: formData.fotoWanita, foto_pria: formData.fotoPria, foto_sampul: formData.fotoSampul,
    alamat_kado_fisik: isPremiumOrAbove ? formData.alamatKadoFisik : null, 
    music_url: formData.musicUrl, quotes: formData.quotes, house_rules: formData.houseRules,
    love_story: formData.loveStory && formData.loveStory.length > 0 ? JSON.stringify(formData.loveStory) : null,
    updated_at: new Date().toISOString()
  }).eq('id', invite.id);

  // 2. UPDATE BANK ACCOUNTS
  await supabase.from('bank_accounts').delete().eq('invitation_id', invite.id);
  if (isPremiumOrAbove && formData.bankAccounts?.length > 0) {
    const banks = formData.bankAccounts.filter(b => b.bankName).map(b => ({
      invitation_id: invite.id, bank_name: b.bankName, account_number: b.accountNumber, account_name: b.accountName
    }));
    if (banks.length > 0) await supabase.from('bank_accounts').insert(banks);
  }

  // 3. UPDATE GALLERIES (BULK INSERT)
  await supabase.from('galleries').delete().eq('invitation_id', invite.id); // Sapu bersih galeri lama
  if (isPremiumOrAbove && formData.fotoGaleri?.length > 0) {
    const validPhotos = formData.fotoGaleri.filter(url => typeof url === 'string' && url.trim() !== '');
    const galleriesToInsert = validPhotos.map((url, index) => ({
      invitation_id: invite.id,
      image_url: url,
      position: index // Urutan foto
    }));
    
    if (galleriesToInsert.length > 0) {
      await supabase.from('galleries').insert(galleriesToInsert);
    }
  }
}

// ==========================================
// FITUR BUKU TAMU & RSVP (GUESTBOOK)
// ==========================================

// 1. Fungsi untuk Klien (Tamu) mengirim ucapan & RSVP
export async function submitRSVP(invitationId, formData) {
  const { error } = await supabase.from('guestbook').insert([{
    invitation_id: invitationId,
    nama: formData.get('nama'),
    kehadiran: formData.get('kehadiran'),
    pesan: formData.get('pesan')
  }]);

  if (error) throw new Error('Gagal mengirim pesan: ' + error.message);
  
  // Refresh otomatis data di halaman undangan yang bersangkutan
  revalidatePath('/[slug]', 'page'); 
}

// 2. Fungsi untuk mengambil daftar ucapan
export async function getGuestbook(invitationId) {
  const { data, error } = await supabase
    .from('guestbook')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('created_at', { ascending: false }); // Yang terbaru di atas
    
  if (error) {
    console.error('Gagal mengambil buku tamu:', error);
    return [];
  }
  return data;
}

// Fungsi untuk Klien menghapus ucapan/spam dari Dasbor mereka
export async function deleteRSVP(guestbookId) {
  const { error } = await supabase.from('guestbook').delete().eq('id', guestbookId);
  if (error) throw new Error('Gagal menghapus pesan: ' + error.message);
  revalidatePath('/[slug]', 'page'); 
}