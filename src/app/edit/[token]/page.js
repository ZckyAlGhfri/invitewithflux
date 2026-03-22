import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import EditClient from './EditClient';

export default async function MagicEditPage({ params }) {
  const unwrappedParams = await params;
  const token = unwrappedParams.token;

  // TARIK RELASI: Tambahkan guestbook(*) agar buku tamu ikut ter-fetch!
  const { data, error } = await supabase
    .from('invitations')
    .select('*, bank_accounts(*), galleries(*), guestbook(*)') 
    .eq('edit_token', token)
    .single();

  if (error || !data) {
    notFound(); 
  }

  return <EditClient initialData={data} />;
}