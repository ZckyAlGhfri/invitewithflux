'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { updateClientByAdmin } from '@/lib/actions';
import { uploadImage } from '@/lib/cloudinary'; 
import MusicPreview from '@/components/MusicPreview';
import ImageUploader from '@/components/ImageUploader';
import Link from 'next/link';

export default function AdminEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  const [formData, setFormData] = useState({
    tier: 'basic', theme: 'luxury', themeColor: 'gold', fotoSampul: '', slug: '',
    namaWanita: '', namaLengkapWanita: '', ayahWanita: '', ibuWanita: '', fotoWanita: '', 
    namaPria: '', namaLengkapPria: '', ayahPria: '', ibuPria: '', fotoPria: '', 
    tanggalAkad: '', waktuAkad: '', tempatAkad: '', mapLinkAkad: '',
    tanggalResepsi: '', waktuResepsi: '', tempatResepsi: '', mapLinkResepsi: '',
    alamatKadoFisik: '', musicUrl: '/music/DieWithASmile.mp3',
    videoPrewedding: '', // <-- TAMBAHAN VIDEO
    bankAccounts: [{ bankName: '', accountNumber: '', accountName: '' }],
    fotoGaleri: [],
    quotes: '',
    houseRules: [],
    loveStory: []
  });

  const [jumlahFoto, setJumlahFoto] = useState(1);
  const maxFoto = formData.tier === 'exclusive' ? 10 : (formData.tier === 'premium' ? 5 : 0);
  const maxLoveStory = formData.tier === 'premium' ? 3 : 99; // Limitasi Love Story

  useEffect(() => {
    async function fetchData() {
      const { data: invite } = await supabase.from('invitations').select('*, bank_accounts(*), galleries(*)').eq('id', id).single();
      if (!invite) { alert("Data tidak ditemukan!"); router.push('/dashboard'); return; }

      let fetchedBanks = [];
      if (invite.tier !== 'basic' && invite.bank_accounts?.length > 0) {
        fetchedBanks = invite.bank_accounts.map(b => ({ bankName: b.bank_name, accountNumber: b.account_number, accountName: b.account_name }));
      }

      const initialGaleri = invite.galleries ? invite.galleries.sort((a, b) => a.position - b.position).map(g => g.image_url) : [];

      let parsedRules = [];
      if (invite.house_rules) {
        try { parsedRules = typeof invite.house_rules === 'string' ? JSON.parse(invite.house_rules) : invite.house_rules; } catch (e) {}
      }

      let parsedStory = [];
      if (invite.love_story) {
        try { parsedStory = typeof invite.love_story === 'string' ? JSON.parse(invite.love_story) : invite.love_story; } catch (e) {}
      }

      setFormData({
        tier: invite.tier || 'basic', theme: invite.theme || 'luxury', themeColor: invite.theme_color || 'gold',
        slug: invite.slug || '', fotoSampul: invite.foto_sampul || '',
        namaWanita: invite.nama_wanita || '', namaLengkapWanita: invite.nama_lengkap_wanita || '',
        ayahWanita: invite.nama_ayah_wanita || '', ibuWanita: invite.nama_ibu_wanita || '', fotoWanita: invite.foto_wanita || '',
        namaPria: invite.nama_pria || '', namaLengkapPria: invite.nama_lengkap_pria || '',
        ayahPria: invite.nama_ayah_pria || '', ibuPria: invite.nama_ibu_pria || '', fotoPria: invite.foto_pria || '',
        tanggalAkad: invite.tanggal_akad ? invite.tanggal_akad.split('T')[0] : '', waktuAkad: invite.waktu_akad || '', tempatAkad: invite.tempat_akad || '', mapLinkAkad: invite.map_link_akad || '',
        tanggalResepsi: invite.tanggal_resepsi ? invite.tanggal_resepsi.split('T')[0] : '', waktuResepsi: invite.waktu_resepsi || '', tempatResepsi: invite.tempat_resepsi || '', mapLinkResepsi: invite.map_link_resepsi || '',
        alamatKadoFisik: invite.alamat_kado_fisik || '', musicUrl: invite.music_url || '/music/DieWithASmile.mp3',
        videoPrewedding: invite.video_prewedding || '',
        bankAccounts: fetchedBanks.length > 0 ? fetchedBanks : [{ bankName: '', accountNumber: '', accountName: '' }],
        fotoGaleri: initialGaleri, quotes: invite.quotes || '', houseRules: parsedRules, loveStory: parsedStory
      });

      setJumlahFoto(initialGaleri.length > 0 ? initialGaleri.length : 1);
      setLoading(false);
    }
    fetchData();
  }, [id, router]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleBankChange = (index, field, value) => { const newBanks = [...formData.bankAccounts]; newBanks[index][field] = value; setFormData({ ...formData, bankAccounts: newBanks }); };
  const addBankAccount = () => setFormData({ ...formData, bankAccounts: [...formData.bankAccounts, { bankName: '', accountNumber: '', accountName: '' }] });
  const removeBankAccount = (index) => setFormData({ ...formData, bankAccounts: formData.bankAccounts.filter((_, i) => i !== index) });
  const handleUpdateGaleriArray = (index, url) => { const newGaleri = [...formData.fotoGaleri]; newGaleri[index] = url; setFormData({ ...formData, fotoGaleri: newGaleri }); };

  const handleHouseRuleChange = (index, field, value) => { const newRules = [...formData.houseRules]; newRules[index][field] = value; setFormData({ ...formData, houseRules: newRules }); };
  const addHouseRule = () => setFormData({ ...formData, houseRules: [...formData.houseRules, { icon: 'clock', text: '' }] });
  const removeHouseRule = (index) => setFormData({ ...formData, houseRules: formData.houseRules.filter((_, i) => i !== index) });
  const handleQuotePreset = (e) => { if(e.target.value) setFormData({ ...formData, quotes: e.target.value }); };

  const handleLoveStoryChange = (index, field, value) => { const newStory = [...(formData.loveStory || [])]; newStory[index][field] = value; setFormData({ ...formData, loveStory: newStory }); };
  const addLoveStory = () => {
    if (formData.loveStory.length >= maxLoveStory) return;
    setFormData({ ...formData, loveStory: [...(formData.loveStory || []), { year: '2020', title: 'Pertama Bertemu', text: '' }] });
  };
  const removeLoveStory = (index) => setFormData({ ...formData, loveStory: (formData.loveStory || []).filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalData = { ...formData };
      const uploadIfFile = async (item) => {
        if (item instanceof Blob || item instanceof File) {
          const fd = new FormData(); fd.append('file', item);
          const res = await uploadImage(fd);
          if (!res.success) throw new Error(res.error || "Gagal mengunggah foto");
          return res.url; 
        }
        return item; 
      };

      finalData.fotoSampul = await uploadIfFile(finalData.fotoSampul);
      finalData.fotoWanita = await uploadIfFile(finalData.fotoWanita);
      finalData.fotoPria = await uploadIfFile(finalData.fotoPria);
      if (finalData.fotoGaleri?.length > 0) {
        const validPhotos = finalData.fotoGaleri.filter(foto => foto);
        finalData.fotoGaleri = await Promise.all(validPhotos.map(foto => uploadIfFile(foto)));
      }

      await updateClientByAdmin(id, finalData);
      router.push('/dashboard'); 
    } catch (err) { alert('Gagal menyimpan data: ' + err.message); setIsSubmitting(false); }
  };

  const isPremiumOrAbove = formData.tier === 'premium' || formData.tier === 'exclusive';
  const tabs = [{ id: 1, label: 'Cover' }, { id: 2, label: 'Mempelai' }, { id: 3, label: 'Galeri' }, { id: 4, label: 'Acara' }, { id: 5, label: 'Kado' }, { id: 6, label: 'Musik' }, { id: 7, label: 'Personalisasi' }];
  
  if (loading)
    return
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-400">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
      Menyiapkan Ruang Operasi...
    </div>;
  
  const colorOptionsByTheme = {
    luxury: [ { id: 'gold', name: '💛 Gold' }, { id: 'silver', name: '🩶 Silver' }, { id: 'rose-gold', name: '🩷 Rose Gold' } ],
    classic: [ { id: 'emerald', name: '🌿 Emerald' }, { id: 'sapphire', name: '💎 Sapphire' }, { id: 'ruby', name: '🍷 Ruby' }, { id: 'gold', name: '👑 Gold' }, { id: 'monochrome', name: '🏛️ Monochrome' } ],
    modern: [ { id: 'slate', name: '🌑 Slate' }, { id: 'indigo', name: '⚡ Indigo' }, { id: 'rose', name: '🌺 Neon Rose' }, { id: 'teal', name: '🌊 Teal' }, { id: 'amber', name: '🔥 Amber' } ]
  };

  const handleThemeChangeAdmin = (e) => {
    const newTheme = e.target.value;
    const defaultColor = colorOptionsByTheme[newTheme][0].id;
    setFormData({ ...formData, theme: newTheme, themeColor: defaultColor });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans pb-32 flex justify-center selection:bg-amber-200">
      <div className="max-w-4xl w-full">
        
       {/* HEADER & KENDALI */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all text-slate-500"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg></Link>
            <div><h1 className="text-2xl font-bold text-slate-900">Admin Data Entry</h1><p className="text-slate-500 text-sm">Mode bypass keamanan untuk revisi data.</p></div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-wrap">
            <div className="flex items-center justify-between sm:justify-start gap-3 bg-slate-50 p-2 sm:px-4 rounded-2xl border border-slate-100 flex-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Paket:</span>
              <select name="tier" value={formData.tier} onChange={handleChange} className="bg-white text-slate-900 px-3 py-2 rounded-xl border border-slate-200 outline-none font-bold text-xs sm:text-sm cursor-pointer focus:ring-2 focus:ring-amber-400 transition-all w-full sm:w-auto">
                <option value="basic">⭐ Basic</option>
                <option value="premium">🌟 Premium</option>
                <option value="exclusive">👑 Exclusive</option>
              </select>
            </div>
            <div className="flex items-center justify-between sm:justify-start gap-3 bg-slate-50 p-2 sm:px-4 rounded-2xl border border-slate-100 flex-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Tema:</span>
              <select name="theme" value={formData.theme} onChange={handleThemeChangeAdmin} className="bg-white text-slate-900 px-3 py-2 rounded-xl border border-slate-200 outline-none font-bold text-xs sm:text-sm cursor-pointer focus:ring-2 focus:ring-amber-400 transition-all w-full sm:w-auto">
                <option value="luxury">✨ Luxury</option>
                <option value="classic">🏛️ Classic</option>
                <option value="modern">🚀 Modern</option>
              </select>
            </div>
           <div className="flex items-center justify-between sm:justify-start gap-3 bg-slate-50 p-2 sm:px-4 rounded-2xl border border-slate-100 flex-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Warna:</span>
              <select name="themeColor" value={formData.themeColor} onChange={handleChange} className="bg-white text-slate-900 px-3 py-2 rounded-xl border border-slate-200 outline-none font-bold text-xs sm:text-sm cursor-pointer focus:ring-2 focus:ring-amber-400 transition-all w-full sm:w-auto">
                {(colorOptionsByTheme[formData.theme] || colorOptionsByTheme.luxury).map(color => (
                  <option key={color.id} value={color.id}>{color.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-8 bg-amber-50 border border-amber-200 p-6 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 w-2 h-full bg-amber-400"></div>
          <div><h2 className="text-sm font-bold text-slate-800 flex items-center gap-2"><span className="text-xl">🔗</span> Link Undangan (Slug)</h2><p className="text-xs text-slate-500 mt-1">Ubah nama tautan undangan klien.</p></div>
          <div className="flex items-center w-full md:w-auto bg-white rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-amber-400 transition-all"><span className="bg-slate-50 px-4 py-3 text-xs font-bold text-slate-400 border-r border-slate-200 select-none hidden sm:block">fluxwedding.id/</span><input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="nama-pasangan" className="px-4 py-3 outline-none text-sm font-bold text-slate-800 w-full md:w-48 lowercase" /></div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-slate-100 px-6 pt-6 scrollbar-hide bg-slate-50/50">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`px-6 py-4 text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-all relative ${ activeTab === tab.id ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600' }`}>
                {tab.label}
                {activeTab === tab.id && ( <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-t-full shadow-[0_-2px_10px_rgba(245,158,11,0.5)]"></div> )}
              </button>
            ))}
          </div>

          <div className="p-8 md:p-12 bg-white min-h-[500px]">
            {/* TABS 1, 2, 4, 5, 6 SAMA SEPERTI SEBELUMNYA */}
            {activeTab === 1 && (<div className="space-y-6 animate-[fadeIn_0.3s_ease-out]"><div className="border-b border-slate-100 pb-4 mb-6"><h2 className="text-xl font-bold text-slate-800">Foto Sampul Depan</h2></div><ImageUploader label="Upload Foto (Crop 9:16 Portrait)" aspectRatio={9/16} currentImage={formData.fotoSampul} onUploadSuccess={(url) => setFormData({...formData, fotoSampul: url})} /></div>)}
            
            {activeTab === 2 && (
              <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">
                <div><div className="border-b border-slate-100 pb-4 mb-6"><h2 className="text-xl font-bold text-slate-800 flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm">1</span> Mempelai Wanita</h2></div><div className="mb-8"><ImageUploader label="Foto Avatar Wanita (Crop 3:4)" currentImage={formData.fotoWanita} onUploadSuccess={(url) => setFormData({...formData, fotoWanita: url})} /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-5"><input type="text" name="namaWanita" value={formData.namaWanita} onChange={handleChange} placeholder="Nama Panggilan" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transition-colors" /><input type="text" name="namaLengkapWanita" value={formData.namaLengkapWanita} onChange={handleChange} placeholder="Nama Lengkap & Gelar" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transition-colors" /><input type="text" name="ayahWanita" value={formData.ayahWanita} onChange={handleChange} placeholder="Nama Ayah" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transition-colors" /><input type="text" name="ibuWanita" value={formData.ibuWanita} onChange={handleChange} placeholder="Nama Ibu" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transition-colors" /></div></div>
                <div><div className="border-b border-slate-100 pb-4 mb-6"><h2 className="text-xl font-bold text-slate-800 flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</span> Mempelai Pria</h2></div><div className="mb-8"><ImageUploader label="Foto Avatar Pria (Crop 3:4)" currentImage={formData.fotoPria} onUploadSuccess={(url) => setFormData({...formData, fotoPria: url})} /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-5"><input type="text" name="namaPria" value={formData.namaPria} onChange={handleChange} placeholder="Nama Panggilan" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transition-colors" /><input type="text" name="namaLengkapPria" value={formData.namaLengkapPria} onChange={handleChange} placeholder="Nama Lengkap & Gelar" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transition-colors" /><input type="text" name="ayahPria" value={formData.ayahPria} onChange={handleChange} placeholder="Nama Ayah" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transition-colors" /><input type="text" name="ibuPria" value={formData.ibuPria} onChange={handleChange} placeholder="Nama Ibu" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transition-colors" /></div></div>
              </div>
            )}

            {/* TAB 3: GALERI & VIDEO */}
            {activeTab === 3 && (
              <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                {formData.tier === 'basic' ? (
                  <div className="text-center py-20"><div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔒</div><h2 className="text-xl font-bold text-slate-800 mb-2">Fitur Terkunci</h2><p className="text-slate-500">Galeri foto hanya tersedia untuk paket Premium dan Exclusive.</p></div>
                ) : (
                  <>
                    <div className="border-b border-slate-100 pb-4">
                      <h2 className="text-xl font-bold text-slate-800">Visualisasi Kebahagiaan</h2>
                    </div>
                    
                    {/* VIDEO PREWEDDING KHUSUS EXCLUSIVE */}
                    {formData.tier === 'exclusive' && (
                      <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200 mb-8">
                         <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><span className="text-xl">🎬</span> Video Pre-Wedding (YouTube)</h3>
                         <p className="text-xs text-slate-500 mb-4">Paste link video YouTube Pre-Wedding (Bisa pakai link biasa atau Short/Bisa di-unlisted).</p>
                         <input 
                           type="url" 
                           name="videoPrewedding" 
                           value={formData.videoPrewedding} 
                           onChange={handleChange} 
                           placeholder="https://youtu.be/xxxxxxx" 
                           className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-sm" 
                         />
                      </div>
                    )}

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div><h3 className="font-bold text-slate-800">Jumlah Slot Foto</h3><p className="text-xs text-slate-500 mt-1">Batas maksimal: {maxFoto} foto</p></div>
                      <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm"><button type="button" onClick={() => setJumlahFoto(Math.max(1, jumlahFoto - 1))} className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-lg">-</button><span className="w-8 text-center font-bold text-slate-800 text-lg">{jumlahFoto}</span><button type="button" onClick={() => setJumlahFoto(Math.min(maxFoto, jumlahFoto + 1))} className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-lg">+</button></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Array.from({ length: jumlahFoto }).map((_, index) => (
                        <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group"><div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-4 border-white z-10">{index + 1}</div><ImageUploader label={`Foto Galeri ${index + 1}`} currentImage={formData.fotoGaleri ? formData.fotoGaleri[index] : null} onUploadSuccess={(url) => handleUpdateGaleriArray(index, url)} /></div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 4: ACARA */}
            {activeTab === 4 && (
              <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                <div className="border-b border-slate-100 pb-4 mb-6"><h2 className="text-xl font-bold text-slate-800">Jadwal & Lokasi</h2></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200"><h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">💍 Akad Nikah</h3><input type="date" name="tanggalAkad" value={formData.tanggalAkad} onChange={handleChange} className="w-full px-4 py-3 mb-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400" /><input type="time" name="waktuAkad" value={formData.waktuAkad} onChange={handleChange} className="w-full px-4 py-3 mb-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400" /><input type="text" name="tempatAkad" value={formData.tempatAkad} onChange={handleChange} placeholder="Nama Tempat/Gedung" className="w-full px-4 py-3 mb-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400" /><input type="url" name="mapLinkAkad" value={formData.mapLinkAkad} onChange={handleChange} placeholder="Link Google Maps (URL)" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-blue-600 outline-none focus:border-amber-400 text-sm" /></div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200"><h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">🎉 Resepsi</h3><input type="date" name="tanggalResepsi" value={formData.tanggalResepsi} onChange={handleChange} className="w-full px-4 py-3 mb-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400" /><input type="time" name="waktuResepsi" value={formData.waktuResepsi} onChange={handleChange} className="w-full px-4 py-3 mb-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400" /><input type="text" name="tempatResepsi" value={formData.tempatResepsi} onChange={handleChange} placeholder="Nama Tempat/Gedung" className="w-full px-4 py-3 mb-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400" /><input type="url" name="mapLinkResepsi" value={formData.mapLinkResepsi} onChange={handleChange} placeholder="Link Google Maps (URL)" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-blue-600 outline-none focus:border-amber-400 text-sm" /></div>
                </div>
              </div>
            )}

            {/* TAB 5: KADO */}
            {activeTab === 5 && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                {!isPremiumOrAbove ? (
                  <div className="text-center py-20"><div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔒</div><h2 className="text-xl font-bold text-slate-800 mb-2">Fitur Terkunci</h2></div>
                ) : (
                  <>
                    <div className="border-b border-slate-100 pb-4 mb-6"><h2 className="text-xl font-bold text-slate-800">Rekening & Kado Digital</h2></div>
                    {formData.bankAccounts.map((bank, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-4 items-start mb-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 relative group"><div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4"><input type="text" placeholder="Bank (BCA/DANA)" value={bank.bankName} onChange={(e) => handleBankChange(index, 'bankName', e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-sm" /><input type="text" placeholder="Nomor Rekening" value={bank.accountNumber} onChange={(e) => handleBankChange(index, 'accountNumber', e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-sm" /><input type="text" placeholder="Atas Nama" value={bank.accountName} onChange={(e) => handleBankChange(index, 'accountName', e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-sm" /></div>{formData.bankAccounts.length > 1 && (<button type="button" onClick={() => removeBankAccount(index)} className="p-3 bg-white border border-slate-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors w-full md:w-auto">Hapus</button>)}</div>
                    ))}
                    <button type="button" onClick={addBankAccount} className="mt-2 text-sm font-bold text-amber-600 bg-amber-50 px-6 py-3 rounded-xl hover:bg-amber-100 border border-amber-200 transition-colors">+ Tambah Rekening Lain</button>
                    {formData.tier === 'exclusive' && (
                      <div className="mt-10 pt-8 border-t border-slate-200"><h3 className="font-bold text-slate-800 mb-4">Alamat Kirim Kado Fisik (Khusus Exclusive)</h3><textarea name="alamatKadoFisik" value={formData.alamatKadoFisik} onChange={handleChange} placeholder="Tuliskan alamat lengkap pengiriman kado..." rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:bg-white text-sm transition-colors"></textarea></div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* TAB 6: MUSIK */}
            {activeTab === 6 && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 mb-6">Musik Pengiring</h2>
                <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl">
                  <label className="font-bold text-slate-700 block mb-3">Pilih Lagu Romantis</label>
                  <select name="musicUrl" value={formData.musicUrl} onChange={handleChange} className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl outline-none text-slate-800 font-bold focus:ring-2 focus:ring-amber-400 mb-6 cursor-pointer">
                    <option value="/music/DieWithASmile.mp3">Die With A Smile - Lady Gaga & Bruno Mars</option>
                    <option value="/music/AThousandYears.mp3">A Thousand Years - Christina Perri</option>
                    <option value="/music/LaguPernikahanKita.mp3">Lagu Pernikahan Kita - Tiara Andini</option>
                    <option value="/music/TeruntukMia.mp3">Teruntuk Mia - Nuh</option>
                    <option value="/music/UntilIFoundYou.mp3">Until I Found You - Stephen Sanchez</option>
                    <option value="/music/chrisye-untukmu.mp3">Untukmu - Chrisye</option>
                  </select>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <MusicPreview url={formData.musicUrl} />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: PERSONALISASI (LOVE STORY LIMITASI) */}
            {activeTab === 7 && (
              <div className="space-y-10 animate-[fadeIn_0.3s_ease-out]">
                
                {/* KARTU 1 & 2 QUOTES + TATA TERTIB (Diringkas di sini) */}
                <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden"><div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div><div className="border-b border-slate-200 pb-4 mb-6"><h2 className="text-xl font-bold text-slate-800 flex items-center gap-3"><span className="text-2xl">📖</span> Kutipan Romantis</h2></div><select onChange={handleQuotePreset} className="w-full px-5 py-4 mb-5 bg-white text-slate-700 border border-slate-200 rounded-xl outline-none font-bold text-sm cursor-pointer hover:border-amber-400 shadow-sm transition-colors"><option value="">💡 Pilih Kutipan Otomatis (Opsional)...</option><optgroup label="Berdasarkan Agama"><option value={`بَارَكَ اللهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ\n\nSemoga Allah memberkahimu di waktu bahagia dan memberkahimu di waktu susah, serta semoga Allah menghimpun kalian berdua dalam kebaikan. (HR. Abu Dawud, Tirmidzi, dan Ahmad).`}>Islami: Doa Nabi Muhammad SAW</option><option value={`وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةًۗ اِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ\n\nDi antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir. (QS. Ar-Rum: 21)`}>Islami: QS. Ar-Rum: 21</option><option value="Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia. (Matius 19:6)">Kristiani: Matius 19:6</option><option value="Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan. (Kolose 3:14)">Kristiani: Kolose 3:14</option></optgroup><optgroup label="Universal & Puitis"><option value="Cinta tidak berupa tatapan satu sama lain, tetapi memandang ke luar bersama ke arah yang sama. (Antoine de Saint-Exupéry)">Puitis: Memandang Bersama</option><option value="Dua jiwa namun satu pikiran, dua hati namun satu detak. (John Keats)">Puitis: Dua Jiwa Satu Detak</option><option value="Aku memilihmu. Dan aku akan memilihmu terus menerus, tanpa henti, tanpa ragu, dalam setiap detak jantungku.">Puitis: Aku Memilihmu</option></optgroup></select><textarea name="quotes" value={formData.quotes} onChange={handleChange} placeholder="Ketik kata-kata puitis di sini..." rows="4" className="w-full p-5 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all text-sm leading-relaxed shadow-inner"></textarea></div>

                <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden"><div className="absolute top-0 left-0 w-1.5 h-full bg-slate-800"></div><div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><div><h2 className="text-xl font-bold text-slate-800 flex items-center gap-3"><span className="text-2xl">📋</span> Tata Tertib Acara</h2></div><button type="button" onClick={addHouseRule} className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-600 transition-colors shadow-lg active:scale-95 whitespace-nowrap">+ Tambah Aturan</button></div>{formData.houseRules.length === 0 ? (<div className="text-center py-10 bg-white border border-slate-200 border-dashed rounded-2xl text-slate-400 text-sm font-medium">Belum ada tata tertib yang ditambahkan.</div>) : (<div className="space-y-4">{formData.houseRules.map((rule, index) => (<div key={index} className="flex flex-col md:flex-row gap-3 items-start md:items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm group hover:border-amber-300 transition-colors"><select value={rule.icon} onChange={(e) => handleHouseRuleChange(index, 'icon', e.target.value)} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer text-sm font-bold text-slate-700 w-full md:w-48 focus:border-amber-400"><option value="clock">🕒 Waktu / Jadwal</option><option value="dress">👗 Pakaian / Dresscode</option><option value="kids">🚸 Larangan / Batasan</option><option value="camera">📸 Kamera / Gadget</option><option value="gift">🎁 Kado / Amplop</option><option value="food">🍽️ Makanan / Minuman</option><option value="warning">⚠️ Perhatian Khusus</option><option value="info">ℹ️ Informasi Umum</option><option value="love">🤍 Harapan / Doa</option></select><input type="text" value={rule.text} onChange={(e) => handleHouseRuleChange(index, 'text', e.target.value)} placeholder="Tuliskan aturan detail di sini..." className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-400 focus:bg-white transition-colors text-sm" /><button type="button" onClick={() => removeHouseRule(index)} className="p-3.5 text-red-500 hover:text-white bg-red-50 border border-red-100 rounded-lg hover:bg-red-500 w-full md:w-auto font-bold text-xs uppercase tracking-widest transition-colors">Hapus</button></div>))}</div>)}</div>

                {/* KARTU 3: LOVE STORY (Dengan Limitasi) */}
                <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden mt-8">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-400"></div>
                  <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                        <span className="text-2xl">💌</span> Perjalanan Cinta
                      </h2>
                      {formData.tier === 'premium' && (
                        <p className="text-xs text-amber-600 mt-2 font-bold">Maksimal {maxLoveStory} cerita untuk paket Premium.</p>
                      )}
                    </div>
                    {formData.loveStory?.length < maxLoveStory && (
                      <button type="button" onClick={addLoveStory} className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-600 transition-colors shadow-lg active:scale-95 whitespace-nowrap">
                        + Tambah Cerita
                      </button>
                    )}
                  </div>

                  {formData.tier === 'basic' && (
                     <div className="mb-6 text-center py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-bold uppercase tracking-widest">
                       ⚠️ Peringatan Admin: Paket saat ini Basic. Fitur Love Story dimatikan pada undangan.
                     </div>
                  )}

                  {formData.loveStory?.length === 0 ? (
                    <div className="text-center py-10 bg-white border border-slate-200 border-dashed rounded-2xl text-slate-400 text-sm font-medium">
                      Belum ada cerita yang ditambahkan.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.loveStory?.map((story, index) => (
                        <div key={index} className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm relative group">
                          <div className="absolute -left-2 -top-2 w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">{index + 1}</div>
                          <div className="flex flex-col sm:flex-row gap-3 mb-3">
                            <input type="text" value={story.year} onChange={(e) => handleLoveStoryChange(index, 'year', e.target.value)} placeholder="Tahun" className="w-full sm:w-1/3 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-400 text-xs font-bold text-amber-600" />
                            <input type="text" value={story.title} onChange={(e) => handleLoveStoryChange(index, 'title', e.target.value)} placeholder="Judul (Ex: Lamaran)" className="w-full sm:w-2/3 p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-400 text-sm font-bold text-slate-800" />
                          </div>
                          <textarea value={story.text} onChange={(e) => handleLoveStoryChange(index, 'text', e.target.value)} placeholder="Ceritakan kisah singkatnya..." rows="2" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-400 focus:bg-white transition-colors text-xs text-slate-600 mb-3"></textarea>
                          <button type="button" onClick={() => removeLoveStory(index)} className="text-red-500 hover:text-white bg-red-50 hover:bg-red-500 border border-red-100 p-2 rounded-lg w-full sm:w-auto font-bold text-[10px] uppercase tracking-widest transition-colors">Hapus</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sistem Upload Massal Aktif</span></div>
             <div className="flex gap-4 w-full sm:w-auto">
               <Link href="/dashboard" className="px-6 py-4 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors w-full sm:w-auto text-center">Batal</Link>
               <button type="submit" disabled={isSubmitting} className="px-8 py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-amber-600 shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 w-full sm:w-auto">
                 {isSubmitting ? ( <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>Mengunggah...</> ) : 'Simpan & Upload Semua'}
               </button>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
}