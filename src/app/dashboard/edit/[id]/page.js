'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { updateClientByAdmin } from '@/lib/actions';
import MusicPreview from '@/components/MusicPreview';
import ImageUploader from '@/components/ImageUploader'; // BARU: Import Uploader
import Link from 'next/link';

export default function AdminEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tier: 'basic', 
    fotoSampul: '', // BARU
    namaWanita: '', namaLengkapWanita: '', ayahWanita: '', ibuWanita: '', fotoWanita: '', // BARU
    namaPria: '', namaLengkapPria: '', ayahPria: '', ibuPria: '', fotoPria: '', // BARU
    tanggalAkad: '', waktuAkad: '', tempatAkad: '', mapLinkAkad: '',
    tanggalResepsi: '', waktuResepsi: '', tempatResepsi: '', mapLinkResepsi: '',
    alamatKadoFisik: '', musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    bankAccounts: [{ bankName: '', accountNumber: '', accountName: '' }]
  });

  useEffect(() => {
    async function fetchData() {
      const { data: invite } = await supabase.from('invitations').select('*').eq('id', id).single();
      if (!invite) {
        alert("Data tidak ditemukan!");
        router.push('/dashboard');
        return;
      }

      let fetchedBanks = [];
      if (invite.tier !== 'basic') {
        const { data: banks } = await supabase.from('bank_accounts').select('*').eq('invitation_id', id);
        if (banks && banks.length > 0) {
          fetchedBanks = banks.map(b => ({ bankName: b.bank_name, accountNumber: b.account_number, accountName: b.account_name }));
        }
      }

      setFormData({
        tier: invite.tier || 'basic',
        fotoSampul: invite.foto_sampul || '',
        namaWanita: invite.nama_wanita || '', namaLengkapWanita: invite.nama_lengkap_wanita || '',
        ayahWanita: invite.nama_ayah_wanita || '', ibuWanita: invite.nama_ibu_wanita || '',
        fotoWanita: invite.foto_wanita || '',
        namaPria: invite.nama_pria || '', namaLengkapPria: invite.nama_lengkap_pria || '',
        ayahPria: invite.nama_ayah_pria || '', ibuPria: invite.nama_ibu_pria || '',
        fotoPria: invite.foto_pria || '',
        tanggalAkad: invite.tanggal_akad || '', waktuAkad: invite.waktu_akad || '',
        tempatAkad: invite.tempat_akad || '', mapLinkAkad: invite.map_link_akad || '',
        tanggalResepsi: invite.tanggal_resepsi || '', waktuResepsi: invite.waktu_resepsi || '',
        tempatResepsi: invite.tempat_resepsi || '', mapLinkResepsi: invite.map_link_resepsi || '',
        alamatKadoFisik: invite.alamat_kado_fisik || '',
        musicUrl: invite.music_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        bankAccounts: fetchedBanks.length > 0 ? fetchedBanks : [{ bankName: '', accountNumber: '', accountName: '' }]
      });
      setLoading(false);
    }
    fetchData();
  }, [id, router]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleBankChange = (index, field, value) => {
    const newBanks = [...formData.bankAccounts];
    newBanks[index][field] = value;
    setFormData({ ...formData, bankAccounts: newBanks });
  };
  const addBankAccount = () => setFormData({ ...formData, bankAccounts: [...formData.bankAccounts, { bankName: '', accountNumber: '', accountName: '' }] });
  const removeBankAccount = (index) => setFormData({ ...formData, bankAccounts: formData.bankAccounts.filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateClientByAdmin(id, formData);
      router.push('/dashboard'); 
    } catch (err) {
      alert('Gagal menyimpan data: ' + err.message);
      setIsSubmitting(false);
    }
  };

  const isPremiumOrAbove = formData.tier === 'premium' || formData.tier === 'exclusive';

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">Menyiapkan Ruang Operasi...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans pb-32">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Data Entry</h1>
              <p className="text-slate-500 text-sm">Mode bypass keamanan untuk revisi & upload foto.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Ubah Paket:</span>
            <select name="tier" value={formData.tier} onChange={handleChange} className="bg-white text-slate-900 px-4 py-2 rounded-xl border border-slate-200 outline-none font-bold text-sm cursor-pointer focus:ring-2 focus:ring-purple-400 transition-all">
              <option value="basic">⭐ Basic</option>
              <option value="premium">🌟 Premium</option>
              <option value="exclusive">👑 Exclusive</option>
            </select>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* FOTO SAMPUL UTAMA */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
             <h2 className="text-xl font-bold text-slate-800 mb-6">Foto Sampul Depan</h2>
             <ImageUploader 
                label="Upload Foto Background Utama (Pre-Wedding)" 
                imageUrl={formData.fotoSampul} 
                onUploadSuccess={(url) => setFormData({...formData, fotoSampul: url})} 
             />
          </div>

          {/* SECTION 1: MEMPELAI WANITA */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center text-sm">1</span> Mempelai Wanita</h2>
            
            <div className="mb-6">
              <ImageUploader 
                  label="Foto Avatar Wanita" 
                  imageUrl={formData.fotoWanita} 
                  onUploadSuccess={(url) => setFormData({...formData, fotoWanita: url})} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" name="namaWanita" required value={formData.namaWanita} onChange={handleChange} placeholder="Nama Panggilan" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              <input type="text" name="namaLengkapWanita" required value={formData.namaLengkapWanita} onChange={handleChange} placeholder="Nama Lengkap & Gelar" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              <input type="text" name="ayahWanita" required value={formData.ayahWanita} onChange={handleChange} placeholder="Nama Ayah" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              <input type="text" name="ibuWanita" required value={formData.ibuWanita} onChange={handleChange} placeholder="Nama Ibu" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
            </div>
          </div>

          {/* SECTION 2: MEMPELAI PRIA */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-sm">2</span> Mempelai Pria</h2>
            
            <div className="mb-6">
              <ImageUploader 
                  label="Foto Avatar Pria" 
                  imageUrl={formData.fotoPria} 
                  onUploadSuccess={(url) => setFormData({...formData, fotoPria: url})} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" name="namaPria" required value={formData.namaPria} onChange={handleChange} placeholder="Nama Panggilan" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              <input type="text" name="namaLengkapPria" required value={formData.namaLengkapPria} onChange={handleChange} placeholder="Nama Lengkap & Gelar" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              <input type="text" name="ayahPria" required value={formData.ayahPria} onChange={handleChange} placeholder="Nama Ayah" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              <input type="text" name="ibuPria" required value={formData.ibuPria} onChange={handleChange} placeholder="Nama Ibu" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
            </div>
          </div>

          {/* SECTION 3: JADWAL, LOKASI & MUSIK */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center text-sm">3</span> Rangkaian Acara & Musik</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-700 mb-4">Akad Nikah</h3>
                <input type="date" name="tanggalAkad" required value={formData.tanggalAkad} onChange={handleChange} className="w-full px-4 py-3 mb-3 bg-white border border-slate-200 rounded-xl" />
                <input type="time" name="waktuAkad" required value={formData.waktuAkad} onChange={handleChange} className="w-full px-4 py-3 mb-3 bg-white border border-slate-200 rounded-xl" />
                <input type="text" name="tempatAkad" required value={formData.tempatAkad} onChange={handleChange} placeholder="Nama Tempat/Gedung" className="w-full px-4 py-3 mb-3 bg-white border border-slate-200 rounded-xl" />
                <input type="url" name="mapLinkAkad" value={formData.mapLinkAkad} onChange={handleChange} placeholder="Link Google Maps (URL)" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-blue-600 text-sm" />
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-700 mb-4">Resepsi</h3>
                <input type="date" name="tanggalResepsi" required value={formData.tanggalResepsi} onChange={handleChange} className="w-full px-4 py-3 mb-3 bg-white border border-slate-200 rounded-xl" />
                <input type="time" name="waktuResepsi" required value={formData.waktuResepsi} onChange={handleChange} className="w-full px-4 py-3 mb-3 bg-white border border-slate-200 rounded-xl" />
                <input type="text" name="tempatResepsi" required value={formData.tempatResepsi} onChange={handleChange} placeholder="Nama Tempat/Gedung" className="w-full px-4 py-3 mb-3 bg-white border border-slate-200 rounded-xl" />
                <input type="url" name="mapLinkResepsi" value={formData.mapLinkResepsi} onChange={handleChange} placeholder="Link Google Maps (URL)" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-blue-600 text-sm" />
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <label className="font-bold text-slate-700 block mb-3">Musik Pengiring Undangan</label>
              <select name="musicUrl" value={formData.musicUrl} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-slate-700 font-medium focus:ring-2 focus:ring-purple-400">
                <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3">Romantic Piano (Default)</option>
                <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3">A Thousand Years - Instrumental</option>
                <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3">Beautiful In White</option>
              </select>
              <MusicPreview url={formData.musicUrl} />
            </div>
          </div>

          {/* SECTION 4: KADO DIGITAL */}
          {isPremiumOrAbove && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 animate-fade-in">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><span className="w-8 h-8 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-sm">4</span> Kado Digital</h2>
              
              {formData.bankAccounts.map((bank, index) => (
                <div key={index} className="flex gap-4 items-start mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="text" placeholder="Bank (BCA/DANA)" value={bank.bankName} onChange={(e) => handleBankChange(index, 'bankName', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                    <input type="text" placeholder="Nomor Rekening" value={bank.accountNumber} onChange={(e) => handleBankChange(index, 'accountNumber', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                    <input type="text" placeholder="Atas Nama" value={bank.accountName} onChange={(e) => handleBankChange(index, 'accountName', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                  </div>
                  {formData.bankAccounts.length > 1 && (
                    <button type="button" onClick={() => removeBankAccount(index)} className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors">✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addBankAccount} className="mt-2 text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100">+ Tambah Rekening</button>

              {formData.tier === 'exclusive' && (
                <div className="mt-6 pt-6 border-t border-slate-200 animate-fade-in">
                  <label className="font-bold text-slate-700 block mb-2">Alamat Kado Fisik</label>
                  <textarea name="alamatKadoFisik" value={formData.alamatKadoFisik} onChange={handleChange} placeholder="Jln. Mawar No. 123..." rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"></textarea>
                </div>
              )}
            </div>
          )}

          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 px-6 md:px-12 flex justify-end gap-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <Link href="/dashboard" className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Batal</Link>
            <button type="submit" disabled={isSubmitting} className="px-10 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-purple-600 shadow-xl transition-all disabled:opacity-50 flex items-center gap-2">
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan & Foto'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}