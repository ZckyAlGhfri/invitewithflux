'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { submitEditData } from '@/lib/actions';
import MusicPreview from '@/components/MusicPreview';
import ImageUploader from '@/components/ImageUploader'; // BARU: Import Uploader

export default function UserEditPage() {
  const params = useParams();
  const token = params.token;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [clientTier, setClientTier] = useState('basic');

  // BARU: Tambah field foto
  const [formData, setFormData] = useState({
    fotoSampul: '', fotoWanita: '', fotoPria: '',
    namaWanita: '', namaLengkapWanita: '', ayahWanita: '', ibuWanita: '',
    namaPria: '', namaLengkapPria: '', ayahPria: '', ibuPria: '',
    tanggalAkad: '', waktuAkad: '', tempatAkad: '', mapLinkAkad: '',
    tanggalResepsi: '', waktuResepsi: '', tempatResepsi: '', mapLinkResepsi: '',
    alamatKadoFisik: '', musicUrl: '',
    bankAccounts: [{ bankName: '', accountNumber: '', accountName: '' }]
  });

  useEffect(() => {
    async function fetchMyData() {
      if (!token) return;
      const { data: invite, error } = await supabase.from('invitations').select('*').eq('edit_token', token).single();
      
      if (error || !invite) {
        setErrorMsg('Link revisi tidak valid atau telah kadaluarsa.');
        setLoading(false);
        return;
      }
      if (invite.is_locked) {
        setIsLocked(true);
        setLoading(false);
        return;
      }

      setClientTier(invite.tier);
      let fetchedBanks = [];
      if (invite.tier !== 'basic') {
        const { data: banks } = await supabase.from('bank_accounts').select('*').eq('invitation_id', invite.id);
        if (banks && banks.length > 0) fetchedBanks = banks.map(b => ({ bankName: b.bank_name, accountNumber: b.account_number, accountName: b.account_name }));
      }

      // BARU: Populate data foto dari DB
      setFormData({
        fotoSampul: invite.foto_sampul || '', fotoWanita: invite.foto_wanita || '', fotoPria: invite.foto_pria || '',
        namaWanita: invite.nama_wanita || '', namaLengkapWanita: invite.nama_lengkap_wanita || '', ayahWanita: invite.nama_ayah_wanita || '', ibuWanita: invite.nama_ibu_wanita || '',
        namaPria: invite.nama_pria || '', namaLengkapPria: invite.nama_lengkap_pria || '', ayahPria: invite.nama_ayah_pria || '', ibuPria: invite.nama_ibu_pria || '',
        tanggalAkad: invite.tanggal_akad || '', waktuAkad: invite.waktu_akad || '', tempatAkad: invite.tempat_akad || '', mapLinkAkad: invite.map_link_akad || '',
        tanggalResepsi: invite.tanggal_resepsi || '', waktuResepsi: invite.waktu_resepsi || '', tempatResepsi: invite.tempat_resepsi || '', mapLinkResepsi: invite.map_link_resepsi || '',
        alamatKadoFisik: invite.alamat_kado_fisik || '', musicUrl: invite.music_url || '/music/DieWithASmile.mp3',
        bankAccounts: fetchedBanks.length > 0 ? fetchedBanks : [{ bankName: '', accountNumber: '', accountName: '' }]
      });
      setLoading(false);
    }
    fetchMyData();
  }, [token]);

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
      await submitEditData(token, formData);
      setSuccess(true);
    } catch (err) {
      alert('Gagal menyimpan data revisi: ' + err.message);
    }
    setIsSubmitting(false);
  };

  const isPremiumOrAbove = clientTier === 'premium' || clientTier === 'exclusive';

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-serif italic text-slate-500">Membuka brankas data...</div>;
  if (errorMsg) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">{errorMsg}</div>;
  if (isLocked) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
      <h1 className="text-3xl font-serif italic text-slate-900 mb-4">Akses Revisi Ditutup</h1>
      <p className="text-slate-500 max-w-md">Masa tayang atau akses edit untuk undangan Anda telah dikunci oleh Admin.</p>
    </div>
  );

  if (success) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-6">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
      <h1 className="text-3xl font-serif italic text-slate-900 mb-4">Revisi Berhasil Disimpan!</h1>
      <p className="text-slate-500 mb-8 max-w-md">Perubahan Anda telah diperbarui secara otomatis di undangan digital.</p>
      <button onClick={() => setSuccess(false)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">Kembali Edit</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 py-12 md:p-12 font-sans pb-32">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-purple-600 mb-2 block">Magic Edit System</span>
          <h1 className="text-4xl font-serif italic text-slate-900">Revisi Undangan</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100">
             <h2 className="text-xl font-bold text-slate-800 mb-6">Foto Sampul Depan</h2>
             <ImageUploader label="Upload Foto Background Utama" imageUrl={formData.fotoSampul} onUploadSuccess={(url) => setFormData({...formData, fotoSampul: url})} />
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Informasi Mempelai Wanita</h2>
            <div className="mb-6">
               <ImageUploader label="Foto Avatar Wanita" imageUrl={formData.fotoWanita} onUploadSuccess={(url) => setFormData({...formData, fotoWanita: url})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" name="namaWanita" required value={formData.namaWanita} onChange={handleChange} placeholder="Nama Panggilan" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              <input type="text" name="namaLengkapWanita" required value={formData.namaLengkapWanita} onChange={handleChange} placeholder="Nama Lengkap & Gelar" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              <input type="text" name="ayahWanita" required value={formData.ayahWanita} onChange={handleChange} placeholder="Nama Ayah" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              <input type="text" name="ibuWanita" required value={formData.ibuWanita} onChange={handleChange} placeholder="Nama Ibu" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Informasi Mempelai Pria</h2>
            <div className="mb-6">
               <ImageUploader label="Foto Avatar Pria" imageUrl={formData.fotoPria} onUploadSuccess={(url) => setFormData({...formData, fotoPria: url})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" name="namaPria" required value={formData.namaPria} onChange={handleChange} placeholder="Nama Panggilan" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              <input type="text" name="namaLengkapPria" required value={formData.namaLengkapPria} onChange={handleChange} placeholder="Nama Lengkap & Gelar" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              <input type="text" name="ayahPria" required value={formData.ayahPria} onChange={handleChange} placeholder="Nama Ayah" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              <input type="text" name="ibuPria" required value={formData.ibuPria} onChange={handleChange} placeholder="Nama Ibu" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Jadwal, Lokasi & Musik</h2>
            
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 mb-6">
              <h3 className="font-bold text-slate-700 mb-4">Akad Nikah</h3>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <input type="date" name="tanggalAkad" required value={formData.tanggalAkad} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl" />
                <input type="time" name="waktuAkad" required value={formData.waktuAkad} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl" />
              </div>
              <input type="text" name="tempatAkad" required value={formData.tempatAkad} onChange={handleChange} placeholder="Nama Tempat/Gedung" className="w-full px-4 py-3 mb-3 bg-white border border-slate-200 rounded-xl" />
              <input type="url" name="mapLinkAkad" value={formData.mapLinkAkad} onChange={handleChange} placeholder="Link Google Maps" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-blue-600 text-sm" />
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4">Resepsi</h3>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <input type="date" name="tanggalResepsi" required value={formData.tanggalResepsi} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl" />
                <input type="time" name="waktuResepsi" required value={formData.waktuResepsi} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl" />
              </div>
              <input type="text" name="tempatResepsi" required value={formData.tempatResepsi} onChange={handleChange} placeholder="Nama Tempat/Gedung" className="w-full px-4 py-3 mb-3 bg-white border border-slate-200 rounded-xl" />
              <input type="url" name="mapLinkResepsi" value={formData.mapLinkResepsi} onChange={handleChange} placeholder="Link Google Maps" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-blue-600 text-sm" />
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <label className="font-bold text-slate-700 block mb-3">Musik Pengiring Undangan</label>
              <select name="musicUrl" value={formData.musicUrl} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700">
                <option value="/music/DieWithASmile.mp3">Die With A Smile</option>
                <option value="/music/AThousandYears.mp3">A Thousand Years</option>
                <option value="/music/LaguPernikahanKita.mp3">Lagu Pernikahan Kita</option>
                <option value="/music/TeruntukMia.mp3">Teruntuk Mia</option>
              </select>
              <MusicPreview url={formData.musicUrl} />
            </div>
          </div>

          {isPremiumOrAbove && (
            <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Kado Digital</h2>
              {formData.bankAccounts.map((bank, index) => (
                <div key={index} className="flex gap-4 items-start mb-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex-1 space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-3">
                    <input type="text" placeholder="Bank" value={bank.bankName} onChange={(e) => handleBankChange(index, 'bankName', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                    <input type="text" placeholder="Nomor Rekening" value={bank.accountNumber} onChange={(e) => handleBankChange(index, 'accountNumber', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                    <input type="text" placeholder="Atas Nama" value={bank.accountName} onChange={(e) => handleBankChange(index, 'accountName', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                  </div>
                  {formData.bankAccounts.length > 1 && (
                    <button type="button" onClick={() => removeBankAccount(index)} className="p-2 bg-red-100 text-red-500 rounded-lg">✕</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addBankAccount} className="mt-2 text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-lg">+ Tambah Rekening</button>

              {clientTier === 'exclusive' && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <label className="font-bold text-slate-700 block mb-2">Alamat Kado Fisik</label>
                  <textarea name="alamatKadoFisik" value={formData.alamatKadoFisik} onChange={handleChange} rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"></textarea>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center mt-10">
            <button type="submit" disabled={isSubmitting} className="w-full max-w-sm px-10 py-4 rounded-full font-bold uppercase tracking-widest text-white bg-slate-900 hover:bg-purple-600 shadow-xl transition-all disabled:opacity-50">
              {isSubmitting ? 'Menyimpan...' : 'Simpan Revisi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}