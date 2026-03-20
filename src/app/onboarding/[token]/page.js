'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { submitOnboardingData } from '@/lib/actions';
import MusicPreview from '@/components/MusicPreview';
import ImageUploader from '@/components/ImageUploader'; // BARU: Import Uploader

export default function OnboardingPage() {
  const params = useParams();
  const token = params.token;

  const [step, setStep] = useState(1);
  const [isValidating, setIsValidating] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalSlug, setFinalSlug] = useState(null);
  const [clientTier, setClientTier] = useState('basic');

  // BARU: Tambahkan state fotoSampul, fotoWanita, fotoPria
  const [formData, setFormData] = useState({
    fotoSampul: '',
    namaWanita: '', namaLengkapWanita: '', ayahWanita: '', ibuWanita: '', fotoWanita: '',
    namaPria: '', namaLengkapPria: '', ayahPria: '', ibuPria: '', fotoPria: '',
    tanggalAkad: '', waktuAkad: '', tempatAkad: '', mapLinkAkad: '',
    tanggalResepsi: '', waktuResepsi: '', tempatResepsi: '', mapLinkResepsi: '',
    alamatKadoFisik: '', musicUrl: '/music/DieWithASmile.mp3', // Default musik pengiring
    bankAccounts: [{ bankName: '', accountNumber: '', accountName: '' }]
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleBankChange = (index, field, value) => {
    const newBanks = [...formData.bankAccounts];
    newBanks[index][field] = value;
    setFormData({ ...formData, bankAccounts: newBanks });
  };
  const addBankAccount = () => setFormData({ ...formData, bankAccounts: [...formData.bankAccounts, { bankName: '', accountNumber: '', accountName: '' }] });
  const removeBankAccount = (index) => setFormData({ ...formData, bankAccounts: formData.bankAccounts.filter((_, i) => i !== index) });

  useEffect(() => {
    async function validateToken() {
      if (!token) return;
      const { data, error } = await supabase.from('invitations').select('id, tier').eq('onboard_token', token).single();
      if (error || !data) {
        setErrorMsg('Tiket Pendaftaran tidak valid atau sudah kadaluarsa.');
      } else {
        setClientTier(data.tier || 'basic');
      }
      setIsValidating(false);
    }
    validateToken();
  }, [token]);

  const isPremiumOrAbove = clientTier === 'premium' || clientTier === 'exclusive';
  const totalSteps = isPremiumOrAbove ? 4 : 3;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedSlug = await submitOnboardingData(token, formData);
      setFinalSlug(generatedSlug);
    } catch (err) {
      alert('Gagal menyimpan data: ' + err.message);
    }
    setIsSubmitting(false);
  };

  if (isValidating) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Membuka formulir aman...</div>;
  if (errorMsg) return <div className="min-h-screen flex items-center justify-center text-red-500">{errorMsg}</div>;

  if (finalSlug) {
    // Ambil domain secara otomatis langsung dari browser
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h1 className="text-3xl font-serif italic text-slate-900 mb-4">Undangan Berhasil Dibuat!</h1>
        <p className="text-slate-500 mb-8">URL unik undangan Anda adalah:</p>
        <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-200 text-slate-700 font-bold tracking-wide flex items-center justify-center gap-2">
          {/* URL Dinamis */}
          <span className="text-slate-400">{baseUrl}/</span>
          <span className="text-amber-600">{finalSlug}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex py-12 px-4 justify-center">
      <div className="bg-white max-w-2xl w-full p-8 md:p-12 rounded-[2rem] shadow-xl border border-slate-100 h-fit">
        
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-purple-600 mb-2 block">Langkah {step} dari {totalSteps}</span>
          <h1 className="text-3xl font-serif italic text-slate-900">
            {step === 1 && "Mempelai Wanita"}
            {step === 2 && "Mempelai Pria"}
            {step === 3 && "Detail Acara & Foto Sampul"}
            {step === 4 && "Fasilitas Tambahan"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="mb-6">
                <ImageUploader label="Foto Avatar Wanita" imageUrl={formData.fotoWanita} onUploadSuccess={(url) => setFormData({...formData, fotoWanita: url})} />
              </div>
              <input type="text" name="namaWanita" required value={formData.namaWanita} onChange={handleChange} placeholder="Nama Panggilan Wanita" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400" />
              <input type="text" name="namaLengkapWanita" required value={formData.namaLengkapWanita} onChange={handleChange} placeholder="Nama Lengkap & Gelar" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="ayahWanita" required value={formData.ayahWanita} onChange={handleChange} placeholder="Nama Ayah" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400" />
                <input type="text" name="ibuWanita" required value={formData.ibuWanita} onChange={handleChange} placeholder="Nama Ibu" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="mb-6">
                <ImageUploader label="Foto Avatar Pria" imageUrl={formData.fotoPria} onUploadSuccess={(url) => setFormData({...formData, fotoPria: url})} />
              </div>
              <input type="text" name="namaPria" required value={formData.namaPria} onChange={handleChange} placeholder="Nama Panggilan Pria" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400" />
              <input type="text" name="namaLengkapPria" required value={formData.namaLengkapPria} onChange={handleChange} placeholder="Nama Lengkap & Gelar" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="ayahPria" required value={formData.ayahPria} onChange={handleChange} placeholder="Nama Ayah" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400" />
                <input type="text" name="ibuPria" required value={formData.ibuPria} onChange={handleChange} placeholder="Nama Ibu" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-fade-in">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                 <ImageUploader label="Foto Sampul Depan (Pre-Wedding)" imageUrl={formData.fotoSampul} onUploadSuccess={(url) => setFormData({...formData, fotoSampul: url})} />
              </div>

              {/* Blok Akad & Resepsi */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Akad Nikah</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input type="date" name="tanggalAkad" required value={formData.tanggalAkad} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" />
                  <input type="time" name="waktuAkad" required value={formData.waktuAkad} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" />
                </div>
                <input type="text" name="tempatAkad" required value={formData.tempatAkad} onChange={handleChange} placeholder="Nama Tempat/Gedung" className="w-full px-4 py-3 mb-4 bg-white border border-slate-200 rounded-xl outline-none" />
                <input type="url" name="mapLinkAkad" value={formData.mapLinkAkad} onChange={handleChange} placeholder="Link Google Maps" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm text-blue-600" />
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Resepsi</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input type="date" name="tanggalResepsi" required value={formData.tanggalResepsi} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" />
                  <input type="time" name="waktuResepsi" required value={formData.waktuResepsi} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none" />
                </div>
                <input type="text" name="tempatResepsi" required value={formData.tempatResepsi} onChange={handleChange} placeholder="Nama Tempat/Gedung" className="w-full px-4 py-3 mb-4 bg-white border border-slate-200 rounded-xl outline-none" />
                <input type="url" name="mapLinkResepsi" value={formData.mapLinkResepsi} onChange={handleChange} placeholder="Link Google Maps" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm text-blue-600" />
              </div>

              <div>
                <h3 className="font-bold text-slate-800 mb-3 px-1">Pilih Lagu Pengiring</h3>
                <select name="musicUrl" value={formData.musicUrl} onChange={handleChange} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-400 outline-none text-slate-700">
                  <option value="/music/DieWithASmile.mp3">Die With A Smile</option>
                  <option value="/music/AThousandYears.mp3">A Thousand Years</option>
                  <option value="/music/LaguPernikahanKita.mp3">Lagu Pernikahan Kita</option>
                  <option value="/music/TeruntukMia.mp3">Teruntuk Mia</option>
                </select>
                <MusicPreview url={formData.musicUrl} />
              </div>
            </div>
          )}

          {step === 4 && isPremiumOrAbove && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h3 className="font-bold text-slate-800 mb-1">Rekening Kado Digital</h3>
                <p className="text-xs text-slate-500 mb-4">Tambahkan rekening bank atau E-Wallet (DANA, OVO, dll).</p>
                {formData.bankAccounts.map((bank, index) => (
                  <div key={index} className="flex gap-2 items-start mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100 relative">
                    <div className="flex-1 space-y-3">
                      <input type="text" placeholder="Nama Bank (BCA / DANA / Mandiri)" value={bank.bankName} onChange={(e) => handleBankChange(index, 'bankName', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-400" />
                      <input type="text" placeholder="Nomor Rekening" value={bank.accountNumber} onChange={(e) => handleBankChange(index, 'accountNumber', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-400" />
                      <input type="text" placeholder="Atas Nama" value={bank.accountName} onChange={(e) => handleBankChange(index, 'accountName', e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-400" />
                    </div>
                    {formData.bankAccounts.length > 1 && (
                      <button type="button" onClick={() => removeBankAccount(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg font-bold">✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addBankAccount} className="text-sm font-bold text-purple-600 hover:text-purple-800">+ Tambah Rekening Lain</button>
              </div>

              {clientTier === 'exclusive' && (
                <div className="pt-6 border-t border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-1">Alamat Kirim Kado Fisik</h3>
                  <textarea name="alamatKadoFisik" value={formData.alamatKadoFisik} onChange={handleChange} placeholder="Tuliskan alamat lengkap pengiriman paket/kado" rows="3" className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm text-slate-700 focus:ring-2 focus:ring-purple-400"></textarea>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-6 border-t border-slate-100">
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-4 rounded-2xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all w-1/3">Kembali</button>
            )}
            <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold tracking-widest uppercase text-sm hover:bg-slate-800 shadow-lg">
              {isSubmitting ? 'Memproses...' : step < totalSteps ? 'Lanjut' : 'Selesai & Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}