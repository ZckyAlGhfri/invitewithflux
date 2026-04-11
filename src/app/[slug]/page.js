import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import InvitationClient from './InvitationClient';

// BOM PENGHANCUR CACHE NEXT.JS (WAJIB ADA)
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// SIHIR WHATSAPP PREVIEW (META TAGS) - UPGRADED!
export async function generateMetadata({ params, searchParams }) {
  const unwrappedParams = await params;
  const unwrappedSearchParams = await searchParams; // Ambil parameter URL
  const slug = unwrappedParams.slug;
  
  const { data, error } = await supabase.from('invitations').select('*').eq('slug', slug).single();

  if (error || !data) return { title: 'Undangan Digital - FluxWedding' };

  const tglAcara = new Date(data.tanggal_akad).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://invitewithflux.vercel.app';

  // LOGIKA TIER UNTUK WHATSAPP PREVIEW
  const isPremiumOrAbove = data.tier === 'premium' || data.tier === 'exclusive';
  // Hanya ambil nama tamu dari URL jika tier-nya Premium/Exclusive
  const namaTamu = isPremiumOrAbove && unwrappedSearchParams.to ? unwrappedSearchParams.to : null;

  // Judul dinamis WhatsApp!
  const metaTitle = namaTamu 
    ? `${data.nama_pria} & ${data.nama_wanita} - Special Invitation for ${namaTamu}` 
    : `The Wedding of ${data.nama_pria} & ${data.nama_wanita} | ${tglAcara}`;

  return {
    title: metaTitle,
    description: namaTamu 
      ? `Yth. ${namaTamu}, tanpa mengurangi rasa hormat, kami memohon doa restu & kehadiran Anda pada hari bahagia kami.` 
      : `Tanpa mengurangi rasa hormat, kami memohon doa restu & kehadiran Bapak/Ibu/Saudara/i pada hari bahagia kami.`,
    openGraph: {
      title: metaTitle,
      description: `Tanpa mengurangi rasa hormat, kami memohon doa restu & kehadiran Bapak/Ibu/Saudara/i di hari bahagia kami.`,
      url: `${baseUrl}/${slug}${namaTamu ? `?to=${encodeURIComponent(namaTamu)}` : ''}`,
      siteName: 'FluxWedding Invitation',
      images: [
        {
          url: data.foto_sampul || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
          width: 1200,
          height: 630,
          alt: `Cover Undangan ${data.nama_pria} & ${data.nama_wanita}`,
        },
      ],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: `Kami memohon doa restu & kehadiran Bapak/Ibu/Saudara/i di hari bahagia kami.`,
      images: [data.foto_sampul || 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200'],
    },
  };
}

// ==========================================
// RENDER SERVER & PENGAMBILAN DATA
// ==========================================
export default async function InvitationPage({ params, searchParams }) {
  const unwrappedParams = await params;
  const unwrappedSearchParams = await searchParams;
  const slug = unwrappedParams.slug;

  const { data, error } = await supabase
    .from('invitations')
    .select(`*, bank_accounts(*), galleries(*)`) 
    .eq('slug', slug)
    .single();

  if (error || !data || data.status !== 'published') {
    notFound();
  }

  // SIHIR DEMO: OVERRIDE WARNA & TIER DARI URL
  let finalData = { ...data };
  
  // LOGIKA DIPERKUAT: Cek isDemo dari URL ATAU nama slug mengandung kata demo
  const isDemoUrl = unwrappedSearchParams.isDemo === 'true' || slug.toLowerCase().includes('demo');

  if (isDemoUrl) {
    if (unwrappedSearchParams.color) {
      finalData.theme_color = unwrappedSearchParams.color; // Timpa warna
    }
    if (unwrappedSearchParams.tier) {
      finalData.tier = unwrappedSearchParams.tier; // Timpa tier
    }
  }

  const isPremiumOrAbove = finalData.tier === 'premium' || finalData.tier === 'exclusive';
  
  const tamu = isPremiumOrAbove && unwrappedSearchParams.to 
    ? unwrappedSearchParams.to 
    : 'Tamu Undangan';

  return <InvitationClient data={finalData} tamu={tamu} />;
}