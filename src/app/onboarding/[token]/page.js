'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getOnboardingContext, submitOnboardingData } from '@/lib/actions';
import { uploadImage } from '@/lib/cloudinary'; 
import MusicPreview from '@/components/MusicPreview';
import ImageUploader from '@/components/ImageUploader';
import WhatsAppHelper from '@/components/WhatsAppHelper';

export default function OnboardingPage() {
  const params = useParams();
  const token = params.token;

  const [step, setStep] = useState(1);
  const [isValidating, setIsValidating] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalSlug, setFinalSlug] = useState(null);
  const [clientTier, setClientTier] = useState('basic');

  const [formData, setFormData] = useState({
    theme: 'luxury', themeColor: 'gold',
    fotoSampul: '', fotoWanita: '', fotoPria: '',
    namaWanita: '', namaLengkapWanita: '', ayahWanita: '', ibuWanita: '', 
    namaPria: '', namaLengkapPria: '', ayahPria: '', ibuPria: '', 
    tanggalAkad: '', waktuAkad: '', tempatAkad: '', mapLinkAkad: '',
    tanggalResepsi: '', waktuResepsi: '', tempatResepsi: '', mapLinkResepsi: '',
    alamatKadoFisik: '', musicUrl: '/music/DieWithASmile.mp3',
    videoPrewedding: '', // <-- TAMBAHAN VIDEO
    quotes: '', houseRules: [], loveStory: [],
    bankAccounts: [{ bankName: '', accountNumber: '', accountName: '' }],
    fotoGaleri: [] 
  });

  const themeOptions = [
    { id: 'luxury', name: 'Luxury Dark', minTier: 'basic', preview: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800', desc: 'Nuansa gelap elegan dengan aksen emas yang mewah.' },
    { id: 'classic', name: 'Royal Classic', minTier: 'premium', preview: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800', desc: 'Terang, formal, dan berwibawa khas gaya keraton.' },
    { id: 'modern', name: 'Urban Modern', minTier: 'exclusive', preview: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800', desc: 'Bold, minimalis, dan sangat kekinian untuk pasangan urban.' },
  ];

  const colorOptionsByTheme = {
    luxury: [
      { id: 'gold', name: 'Gold', icon: '🟡', bg: 'bg-amber-400' },
      { id: 'silver', name: 'Silver', icon: '⚪', bg: 'bg-slate-300' },
      { id: 'rose-gold', name: 'Rose Gold', icon: '🌸', bg: 'bg-rose-400' }
    ],
    classic: [
      { id: 'emerald', name: 'Emerald', icon: '🌿', bg: 'bg-emerald-600' },
      { id: 'sapphire', name: 'Sapphire', icon: '💎', bg: 'bg-blue-800' },
      { id: 'ruby', name: 'Ruby', icon: '🍷', bg: 'bg-rose-800' },
      { id: 'gold', name: 'Gold', icon: '👑', bg: 'bg-amber-500' },
      { id: 'monochrome', name: 'Monochrome', icon: '🏛️', bg: 'bg-stone-500' }
    ],
    modern: [
      { id: 'slate', name: 'Slate', icon: '🌑', bg: 'bg-slate-800' },
      { id: 'indigo', name: 'Indigo', icon: '⚡', bg: 'bg-indigo-500' },
      { id: 'rose', name: 'Neon Rose', icon: '🌺', bg: 'bg-rose-500' },
      { id: 'teal', name: 'Teal', icon: '🌊', bg: 'bg-teal-400' },
      { id: 'amber', name: 'Amber', icon: '🔥', bg: 'bg-amber-500' }
    ]
  };

  // Logika penggantian tema cerdas
  const handleThemeSelect = (selectedTheme) => {
    // Saat tema diganti, otomatis set warna ke opsi pertama dari tema tersebut
    const defaultColorForTheme = colorOptionsByTheme[selectedTheme][0].id;
    setFormData({ ...formData, theme: selectedTheme, themeColor: defaultColorForTheme });
  };

  const handleHouseRuleChange = (index, field, value) => { const newRules = [...formData.houseRules]; newRules[index][field] = value; setFormData({ ...formData, houseRules: newRules }); };
  const addHouseRule = () => setFormData({ ...formData, houseRules: [...formData.houseRules, { icon: 'clock', text: '' }] });
  const removeHouseRule = (index) => setFormData({ ...formData, houseRules: formData.houseRules.filter((_, i) => i !== index) });

  const maxLoveStory = clientTier === 'exclusive' ? 10 : 0;

  const handleLoveStoryChange = (index, field, value) => { const newStory = [...(formData.loveStory || [])]; newStory[index][field] = value; setFormData({ ...formData, loveStory: newStory }); };
  const addLoveStory = () => {
    if ((formData.loveStory || []).length >= maxLoveStory) return;
    setFormData({ ...formData, loveStory: [...(formData.loveStory || []), { year: '2020', title: 'Pertama Bertemu', text: '' }] });
  };
  const removeLoveStory = (index) => setFormData({ ...formData, loveStory: (formData.loveStory || []).filter((_, i) => i !== index) });
  const handleQuotePreset = (e) => { if(e.target.value) setFormData({ ...formData, quotes: e.target.value }); };

  const [skip, setSkip] = useState({ wanita: false, pria: false, akad: false, resepsi: false });

  const [jumlahFoto, setJumlahFoto] = useState(1);
  const maxFoto = clientTier === 'exclusive' ? 10 : (clientTier === 'premium' ? 5 : 0);
  const isPremiumOrAbove = clientTier === 'premium' || clientTier === 'exclusive';
  const totalSteps = isPremiumOrAbove ? 5 : 4; 

  useEffect(() => {
    async function validateToken() {
      if (!token) return;
      try {
        const data = await getOnboardingContext(token);
        setClientTier(data.tier || 'basic');
      } catch {
        setErrorMsg('Tiket Pendaftaran tidak valid atau sudah digunakan.');
      }
      setIsValidating(false);
    }
    validateToken();
  }, [token]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleBankChange = (index, field, value) => { const newBanks = [...formData.bankAccounts]; newBanks[index][field] = value; setFormData({ ...formData, bankAccounts: newBanks }); };
  const addBankAccount = () => setFormData({ ...formData, bankAccounts: [...formData.bankAccounts, { bankName: '', accountNumber: '', accountName: '' }] });
  const removeBankAccount = (index) => setFormData({ ...formData, bankAccounts: formData.bankAccounts.filter((_, i) => i !== index) });
  const handleUpdateGaleriArray = (index, url) => { const newGaleri = [...formData.fotoGaleri]; newGaleri[index] = url; setFormData({ ...formData, fotoGaleri: newGaleri }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < totalSteps) { setStep(step + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }

    setIsSubmitting(true);
    try {
      let finalData = { ...formData };
      if (skip.wanita) { finalData.namaWanita = ''; finalData.namaLengkapWanita = ''; finalData.ayahWanita = ''; finalData.ibuWanita = ''; finalData.fotoWanita = ''; }
      if (skip.pria) { finalData.namaPria = ''; finalData.namaLengkapPria = ''; finalData.ayahPria = ''; finalData.ibuPria = ''; finalData.fotoPria = ''; }
      if (skip.akad) { finalData.tanggalAkad = ''; finalData.waktuAkad = ''; finalData.tempatAkad = ''; finalData.mapLinkAkad = ''; }
      if (skip.resepsi) { finalData.tanggalResepsi = ''; finalData.waktuResepsi = ''; finalData.tempatResepsi = ''; finalData.mapLinkResepsi = ''; }

      const uploadIfFile = async (item, purpose) => {
        if (item instanceof Blob || item instanceof File) {
          const fd = new FormData(); fd.append('file', item);
          const res = await uploadImage(fd, { kind: 'onboarding', token, purpose });
          if (!res.success) throw new Error(res.error || "Gagal mengunggah foto");
          return res.url;
        }
        return item;
      };

      if (!skip.sampul) finalData.fotoSampul = await uploadIfFile(finalData.fotoSampul, 'cover');
      if (!skip.wanita) finalData.fotoWanita = await uploadIfFile(finalData.fotoWanita, 'profile');
      if (!skip.pria) finalData.fotoPria = await uploadIfFile(finalData.fotoPria, 'profile');

      if (finalData.fotoGaleri?.length > 0) {
        const validPhotos = finalData.fotoGaleri.filter(foto => foto);
        finalData.fotoGaleri = await Promise.all(validPhotos.map(foto => uploadIfFile(foto, 'gallery')));
      }

      const generatedSlug = await submitOnboardingData(token, finalData);
      setFinalSlug(generatedSlug);
    } catch (err) { alert('Waduh, gagal menyimpan data: ' + err.message); }
    setIsSubmitting(false);
  };

  if (isValidating) return <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-bold text-slate-400"><div className="w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>Memverifikasi Akses...</div>;
  if (errorMsg) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-red-500 font-bold p-6 text-center">{errorMsg}</div>;

  if (finalSlug) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 py-20 text-center selection:bg-amber-200">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-100"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
        <h1 className="text-4xl md:text-5xl font-serif italic text-slate-900 mb-4">Momen Bahagia Siap Dibagikan!</h1>
        <p className="text-slate-500 mb-10 max-w-md">Data Anda telah tersimpan. Gunakan tool di bawah untuk mulai mengundang tamu melalui WhatsApp.</p>
        <div className="bg-white px-8 py-5 rounded-2xl shadow-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-2 mb-6 w-full max-w-lg"><span className="text-slate-400 font-medium text-sm md:text-base break-all">{baseUrl}/<strong className="text-amber-600 text-lg">{finalSlug}</strong></span></div>
        <WhatsAppHelper slug={finalSlug} namaWanita={formData.namaWanita || "Wanita"} namaPria={formData.namaPria || "Pria"} />
        <div className="mt-10 flex gap-4"><a href={`/${finalSlug}`} className="px-10 py-4 bg-slate-900 text-white rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-amber-600 transition-colors active:scale-95 text-sm">Lihat Undangan</a></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex py-0 sm:py-12 px-0 sm:px-4 justify-center selection:bg-amber-200">
      <div className="bg-white max-w-3xl w-full p-6 sm:p-10 md:p-14 rounded-none sm:rounded-[2.5rem] sm:shadow-2xl border-0 sm:border border-slate-200 h-fit mb-24 sm:mb-0 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100"><div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }}></div></div>

        <div className="text-center mb-10 pt-4">
          <span className="inline-block px-4 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase rounded-full mb-4">Langkah {step} dari {totalSteps}</span>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-slate-900">{step === 1 && "Profil Mempelai"}{step === 2 && "Pilih Desain Undangan"}{step === 3 && "Visual & Musik"}{step === 4 && "Detail Acara"}{step === 5 && "Kado Digital"}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* STEP 1: MEMPELAI (SAMA SEPERTI SEBELUMNYA) */}
          {step === 1 && (
            <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-5 gap-3">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2.5"><span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs">1</span> Mempelai Wanita</h3>
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 w-fit hover:bg-slate-100 transition-colors"><input type="checkbox" checked={skip.wanita} onChange={(e) => setSkip({...skip, wanita: e.target.checked})} className="w-4 h-4 accent-amber-500 rounded cursor-pointer" /><span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">Lewati Bagian Ini</span></label>
                </div>
                <div className={`transition-all duration-300 ${skip.wanita ? 'opacity-40 grayscale-[50%] pointer-events-none' : ''}`}>
                  {skip.wanita && <p className="text-xs font-bold text-amber-600 mb-4 px-2">Data ini akan diisi dengan format sementara (dummy).</p>}
                  <div className="mb-6"><ImageUploader label="Foto Avatar Wanita (Crop 3:4)" currentImage={formData.fotoWanita} onUploadSuccess={(url) => setFormData({...formData, fotoWanita: url})} /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div><label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Panggilan</label><input type="text" name="namaWanita" required={!skip.wanita} disabled={skip.wanita} value={formData.namaWanita} onChange={handleChange} placeholder="Sarah" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:bg-white text-sm transition-colors disabled:bg-slate-100" /></div>
                    <div><label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Lengkap & Gelar</label><input type="text" name="namaLengkapWanita" required={!skip.wanita} disabled={skip.wanita} value={formData.namaLengkapWanita} onChange={handleChange} placeholder="Sarah Anderson, S.E." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:bg-white text-sm transition-colors disabled:bg-slate-100" /></div>
                    <div><label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Ayah</label><input type="text" name="ayahWanita" required={!skip.wanita} disabled={skip.wanita} value={formData.ayahWanita} onChange={handleChange} placeholder="Nama Ayah Mempelai Wanita" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:bg-white text-sm transition-colors disabled:bg-slate-100" /></div>
                    <div><label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Ibu</label><input type="text" name="ibuWanita" required={!skip.wanita} disabled={skip.wanita} value={formData.ibuWanita} onChange={handleChange} placeholder="Nama Ibu Mempelai Wanita" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:bg-white text-sm transition-colors disabled:bg-slate-100" /></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 mb-5 gap-3">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2.5"><span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span> Mempelai Pria</h3>
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 w-fit hover:bg-slate-100 transition-colors"><input type="checkbox" checked={skip.pria} onChange={(e) => setSkip({...skip, pria: e.target.checked})} className="w-4 h-4 accent-amber-500 rounded cursor-pointer" /><span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">Lewati Bagian Ini</span></label>
                </div>
                <div className={`transition-all duration-300 ${skip.pria ? 'opacity-40 grayscale-[50%] pointer-events-none' : ''}`}>
                  {skip.pria && <p className="text-xs font-bold text-amber-600 mb-4 px-2">Data ini akan diisi dengan format sementara (dummy).</p>}
                  <div className="mb-6"><ImageUploader label="Foto Avatar Pria (Crop 3:4)" currentImage={formData.fotoPria} onUploadSuccess={(url) => setFormData({...formData, fotoPria: url})} /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div><label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Panggilan</label><input type="text" name="namaPria" required={!skip.pria} disabled={skip.pria} value={formData.namaPria} onChange={handleChange} placeholder="Naufal" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:bg-white text-sm transition-colors disabled:bg-slate-100" /></div>
                    <div><label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Lengkap & Gelar</label><input type="text" name="namaLengkapPria" required={!skip.pria} disabled={skip.pria} value={formData.namaLengkapPria} onChange={handleChange} placeholder="Naufal Farrel, S.T." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:bg-white text-sm transition-colors disabled:bg-slate-100" /></div>
                    <div><label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Ayah</label><input type="text" name="ayahPria" required={!skip.pria} disabled={skip.pria} value={formData.ayahPria} onChange={handleChange} placeholder="Nama Ayah Mempelai Pria" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:bg-white text-sm transition-colors disabled:bg-slate-100" /></div>
                    <div><label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nama Ibu</label><input type="text" name="ibuPria" required={!skip.pria} disabled={skip.pria} value={formData.ibuPria} onChange={handleChange} placeholder="Nama Ibu Mempelai Pria" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:bg-white text-sm transition-colors disabled:bg-slate-100" /></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PILIH TEMA & WARNA */}
          {step === 2 && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <p className="text-center text-slate-500 text-sm mb-8">Pilih gaya visual yang paling mencerminkan kepribadian Anda dan pasangan.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                {themeOptions.map((theme) => {
                  const isLocked =
                    (theme.minTier === "premium" && clientTier === "basic") ||
                    (theme.minTier === "exclusive" && clientTier !== "exclusive");

                  const isSelected = formData.theme === theme.id;

                  return (
                    <div
                      key={theme.id}
                      onClick={() => !isLocked && handleThemeSelect(theme.id)}
                      className={`relative group cursor-pointer overflow-hidden rounded-[2rem] border-2 transition-all duration-500 ${
                        isSelected
                          ? "border-amber-500 ring-4 ring-amber-50"
                          : "border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      {/* Preview Image */}
                      <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                        <img
                          src={theme.preview}
                          alt={theme.name}
                          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                            isLocked ? "grayscale opacity-50" : ""
                          }`}
                        />

                        {/* Locked Overlay */}
                        {isLocked && (
                          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-3 border border-white/30">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="none"
                                stroke="white"
                                strokeWidth="2.5"
                              >
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                            </div>

                            <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-1">
                              Terkunci
                            </p>

                            <p className="text-white/70 text-[9px] leading-relaxed">
                              {theme.minTier === "premium"
                                ? "Tingkatkan ke paket Premium untuk menggunakan tema ini."
                                : "Gunakan paket Exclusive untuk gaya Modern yang ikonik."}
                            </p>
                          </div>
                        )}

                        {/* Selected Badge */}
                        {isSelected && (
                          <div className="absolute top-4 right-4 bg-amber-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Theme Info */}
                      <div className="p-6 bg-white">
                        <h4
                          className={`font-bold mb-1 ${
                            isLocked ? "text-slate-400" : "text-slate-900"
                          }`}
                        >
                          {theme.name}
                        </h4>

                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          {theme.desc}
                        </p>
                      </div>

                      {/* Upgrade Button */}
                      {isLocked && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[80%] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert("Hubungi Admin via WhatsApp untuk upgrade paket!");
                            }}
                            className="w-full py-2 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-xl"
                          >
                            Upgrade Paket Now
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {formData.theme && (
                <div className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-[2rem] animate-[fadeIn_0.4s_ease-out]">
                  <h3 className="font-bold text-slate-800 mb-6 text-center text-sm uppercase tracking-widest">
                    Pilih Nuansa Warna
                  </h3>

                  <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
                    {(colorOptionsByTheme[formData.theme] || colorOptionsByTheme.luxury).map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, themeColor: color.id })}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs transition-all ${
                          formData.themeColor === color.id
                            ? `bg-white shadow-md border-2 border-slate-800 text-slate-900 scale-105`
                            : `bg-white border border-slate-200 text-slate-500 hover:bg-slate-100`
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${color.bg}`}></span>
                        {color.name} {color.icon}
                      </button>
                    ))}
                  </div>

                  <div className="text-center pt-6 border-t border-slate-200">
                    <a
                      href={`/demo-${formData.theme}?color=${
                        formData.themeColor || "gold"
                      }&tier=${clientTier}&isDemo=true`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-amber-600 transition-colors shadow-xl active:scale-95 group"
                    >
                      <span className="group-hover:scale-125 transition-transform">👁️</span>
                      Lihat Preview Live
                    </a>

                    <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-[0.2em] font-medium max-w-xs mx-auto leading-relaxed">
                      Preview ini disesuaikan dengan paket{" "}
                      <strong className="text-amber-600">({clientTier})</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: VISUAL & MUSIK (Ada Video YouTube) */}
          {step === 3 && (
            <div className="space-y-10 animate-[fadeIn_0.3s_ease-out]">
              <div>
                <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5">
                  Foto Sampul Depan
                </h3>

                <div className="pt-6 border-t border-slate-100">
                  <select
                    onChange={handleQuotePreset}
                    className="w-full px-5 py-4 mb-5 bg-white text-slate-700 border border-slate-200 rounded-xl outline-none font-bold text-sm cursor-pointer hover:border-amber-400 shadow-sm transition-colors"
                  >
                    <option value="">💡 Pilih Kutipan Otomatis (Opsional)...</option>

                    <optgroup label="Berdasarkan Agama">
                      <option
                        value={`وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةًۗ اِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ

              Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir. (QS. Ar-Rum: 21)`}
                      >
                        Islami: QS. Ar-Rum: 21
                      </option>

                      <option
                        value={`بَارَكَ اللهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ

              Semoga Allah memberkahimu di waktu bahagia dan memberkahimu di waktu susah, serta semoga Allah menghimpun kalian berdua dalam kebaikan. (HR. Abu Dawud, Tirmidzi, dan Ahmad).`}
                      >
                        Islami: Doa Nabi Muhammad SAW
                      </option>

                      <option value="Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia. (Matius 19:6)">
                        Kristiani: Matius 19:6
                      </option>

                      <option value="Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan. (Kolose 3:14)">
                        Kristiani: Kolose 3:14
                      </option>
                    </optgroup>

                    <optgroup label="Universal & Puitis">
                      <option value="Cinta tidak berupa tatapan satu sama lain, tetapi memandang ke luar bersama ke arah yang sama. (Antoine de Saint-Exupéry)">
                        Puitis: Memandang Bersama
                      </option>

                      <option value="Dua jiwa namun satu pikiran, dua hati namun satu detak. (John Keats)">
                        Puitis: Dua Jiwa Satu Detak
                      </option>

                      <option value="Aku memilihmu. Dan aku akan memilihmu terus menerus, tanpa henti, tanpa ragu, dalam setiap detak jantungku.">
                        Puitis: Aku Memilihmu
                      </option>
                    </optgroup>
                  </select>

                  <textarea
                    name="quotes"
                    value={formData.quotes}
                    onChange={handleChange}
                    placeholder="Atau ketik kata-kata puitis Anda sendiri di sini..."
                    rows="4"
                    className="w-full p-5 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all text-sm leading-relaxed shadow-inner"
                  ></textarea>
                </div>

                <ImageUploader
                  label="Foto Background Utama (Crop Portrait 9:16)"
                  aspectRatio={9 / 16}
                  currentImage={formData.fotoSampul}
                  onUploadSuccess={(url) =>
                    setFormData({ ...formData, fotoSampul: url })
                  }
                />
              </div>

              {clientTier === "exclusive" && (
                <div>
                  <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5">
                    Video Pre-Wedding (Eksklusif)
                  </h3>

                  <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                    <label className="block text-[11px] font-bold text-amber-700 uppercase tracking-widest mb-2">
                      Link Video YouTube
                    </label>

                    <input
                      type="url"
                      name="videoPrewedding"
                      value={formData.videoPrewedding}
                      onChange={handleChange}
                      placeholder="Paste link YouTube (Ex: https://youtu.be/...)"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-sm transition-colors"
                    />

                    <p className="text-[10px] text-slate-500 mt-2">
                      Video akan disematkan secara elegan di bagian Galeri undangan Anda.
                    </p>
                  </div>
                </div>
              )}

              {isPremiumOrAbove && (
                <div>
                  <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5">
                    Galeri Foto Pre-Wedding
                  </h3>

                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h4 className="font-bold text-slate-700 text-sm">
                        Jumlah Foto Galeri
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Maksimal: {maxFoto} foto
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-fit">
                      <button
                        type="button"
                        onClick={() =>
                          setJumlahFoto(Math.max(1, jumlahFoto - 1))
                        }
                        className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        -
                      </button>

                      <span className="w-6 text-center font-bold text-slate-800">
                        {jumlahFoto}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setJumlahFoto(Math.min(maxFoto, jumlahFoto + 1))
                        }
                        className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {Array.from({ length: jumlahFoto }).map((_, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm relative group"
                      >
                        <div className="absolute -top-2 -left-2 w-6 h-6 bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white z-10">
                          {index + 1}
                        </div>

                        <ImageUploader
                          label={`Foto Galeri ${index + 1} (Crop 3:4)`}
                          currentImage={
                            formData.fotoGaleri
                              ? formData.fotoGaleri[index]
                              : null
                          }
                          onUploadSuccess={(url) =>
                            handleUpdateGaleriArray(index, url)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5">
                  Lagu Pengiring Romantis
                </h3>

                <select
                  name="musicUrl"
                  value={formData.musicUrl}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-amber-400 focus:bg-white outline-none text-slate-700 font-medium mb-4 text-sm sm:text-base"
                >
                  <option value="/music/DieWithASmile.mp3">
                    Die With A Smile - Lady Gaga & Bruno Mars
                  </option>

                  <option value="/music/AThousandYears.mp3">
                    A Thousand Years - Christina Perri
                  </option>

                  <option value="/music/LaguPernikahanKita.mp3">
                    Lagu Pernikahan Kita - Tiara Andini
                  </option>

                  <option value="/music/TeruntukMia.mp3">
                    Teruntuk Mia - Nuh
                  </option>

                  <option value="/music/UntilIFoundYou.mp3">
                    Until I Found You - Stephen Sanchez
                  </option>

                  <option value="/music/chrisye-untukmu.mp3">
                    Untukmu - Chrisye
                  </option>

                  <option value="/music/RiskItAll.mp3">
                    Risk It All - Bruno Mars
                  </option>
                </select>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <MusicPreview url={formData.musicUrl} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ACARA (SAMA SEPERTI SEBELUMNYA) */}
          {step === 4 && (
            <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">

              {/* Akad Nikah */}
              <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    💍 Akad Nikah
                  </h3>

                  <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 w-fit hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={skip.akad}
                      onChange={(e) =>
                        setSkip({ ...skip, akad: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Lewati Bagian Ini
                    </span>
                  </label>
                </div>

                <div
                  className={`space-y-4 transition-all duration-300 ${
                    skip.akad
                      ? "opacity-40 grayscale-[50%] pointer-events-none"
                      : ""
                  }`}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                        Tanggal
                      </label>

                      <input
                        type="date"
                        name="tanggalAkad"
                        required={!skip.akad}
                        disabled={skip.akad}
                        value={formData.tanggalAkad}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-sm disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                        Waktu WIB
                      </label>

                      <input
                        type="time"
                        name="waktuAkad"
                        required={!skip.akad}
                        disabled={skip.akad}
                        value={formData.waktuAkad}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-sm disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Tempat / Gedung
                    </label>

                    <input
                      type="text"
                      name="tempatAkad"
                      required={!skip.akad}
                      disabled={skip.akad}
                      value={formData.tempatAkad}
                      onChange={handleChange}
                      placeholder="Gedung Pernikahan Flux"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-sm disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Link Google Maps (URL)
                    </label>

                    <input
                      type="url"
                      name="mapLinkAkad"
                      disabled={skip.akad}
                      value={formData.mapLinkAkad}
                      onChange={handleChange}
                      placeholder="https://maps.google.com/..."
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-xs text-blue-600 disabled:bg-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Resepsi */}
              <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2">
                    🎉 Resepsi
                  </h3>

                  <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 w-fit hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={skip.resepsi}
                      onChange={(e) =>
                        setSkip({ ...skip, resepsi: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Lewati Bagian Ini
                    </span>
                  </label>
                </div>

                <div
                  className={`space-y-4 transition-all duration-300 ${
                    skip.resepsi
                      ? "opacity-40 grayscale-[50%] pointer-events-none"
                      : ""
                  }`}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                        Tanggal
                      </label>

                      <input
                        type="date"
                        name="tanggalResepsi"
                        required={!skip.resepsi}
                        disabled={skip.resepsi}
                        value={formData.tanggalResepsi}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-sm disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                        Waktu WIB
                      </label>

                      <input
                        type="time"
                        name="waktuResepsi"
                        required={!skip.resepsi}
                        disabled={skip.resepsi}
                        value={formData.waktuResepsi}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-sm disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Tempat / Gedung
                    </label>

                    <input
                      type="text"
                      name="tempatResepsi"
                      required={!skip.resepsi}
                      disabled={skip.resepsi}
                      value={formData.tempatResepsi}
                      onChange={handleChange}
                      placeholder="Gedung Pernikahan Flux"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-sm disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Link Google Maps (URL)
                    </label>

                    <input
                      type="url"
                      name="mapLinkResepsi"
                      disabled={skip.resepsi}
                      value={formData.mapLinkResepsi}
                      onChange={handleChange}
                      placeholder="https://maps.google.com/..."
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 text-xs text-blue-600 disabled:bg-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* House Rules */}
              <div className="pt-8 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-2">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">
                      Tata Tertib Acara (House Rules)
                    </h3>

                    <p className="text-xs text-slate-500">
                      Pilih ikon dan ketik aturan untuk tamu undangan Anda.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {formData.houseRules.map((rule, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 bg-slate-50 border border-slate-200 rounded-xl relative group"
                    >
                      <select
                        value={rule.icon}
                        onChange={(e) =>
                          handleHouseRuleChange(
                            index,
                            "icon",
                            e.target.value
                          )
                        }
                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer text-sm font-bold text-slate-700 w-full md:w-48 focus:border-amber-400"
                      >
                        <option value="clock">🕒 Waktu / Jadwal</option>
                        <option value="dress">👗 Pakaian / Dresscode</option>
                        <option value="kids">🚸 Larangan / Batasan</option>
                        <option value="camera">📸 Kamera / Gadget</option>
                        <option value="gift">🎁 Kado / Amplop</option>
                        <option value="food">🍽️ Makanan / Minuman</option>
                        <option value="warning">⚠️ Perhatian Khusus</option>
                        <option value="info">ℹ️ Informasi Umum</option>
                        <option value="love">🤍 Harapan / Doa</option>
                      </select>

                      <input
                        type="text"
                        value={rule.text}
                        onChange={(e) =>
                          handleHouseRuleChange(
                            index,
                            "text",
                            e.target.value
                          )
                        }
                        placeholder="Contoh: Mohon hadir tepat waktu..."
                        className="w-full p-3 bg-white border border-slate-200 rounded-lg outline-none focus:border-amber-400 text-sm"
                      />

                      <button
                        type="button"
                        onClick={() => removeHouseRule(index)}
                        className="p-3 text-red-400 hover:text-red-600 bg-white border border-slate-200 rounded-lg hover:bg-red-50 w-full sm:w-auto font-bold text-xs uppercase"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addHouseRule}
                  className="mt-4 px-5 py-2.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-600 shadow-lg active:scale-95"
                >
                  + Tambah Aturan
                </button>
              </div>

            </div>
          )}

         {/* STEP 5: KADO DIGITAL & LOVE STORY */}
          {step === 5 && isPremiumOrAbove && (
            <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
              <div>
                <h3 className="font-bold text-slate-800 mb-1">
                  Rekening Bank / E-Wallet
                </h3>

                <p className="text-xs text-slate-500 mb-5">
                  Fasilitas kado digital (Cashless) untuk tamu undangan. Kosongkan jika tidak ingin memakai.
                </p>

                {formData.bankAccounts.map((bank, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-4 items-start mb-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 relative group"
                  >
                    <div className="flex-1 w-full space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                          Nama Bank (BCA/DANA)
                        </label>

                        <input
                          type="text"
                          value={bank.bankName}
                          onChange={(e) => handleBankChange(index, 'bankName', e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                          Nomor Rekening
                        </label>

                        <input
                          type="text"
                          value={bank.accountNumber}
                          onChange={(e) => handleBankChange(index, 'accountNumber', e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                          Atas Nama
                        </label>

                        <input
                          type="text"
                          value={bank.accountName}
                          onChange={(e) => handleBankChange(index, 'accountName', e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {formData.bankAccounts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBankAccount(index)}
                        className="p-3 text-red-500 bg-white border border-slate-200 rounded-xl hover:bg-red-50 font-bold text-xs uppercase tracking-widest w-full sm:w-auto mt-2 sm:mt-6"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addBankAccount}
                  className="mt-2 text-sm font-bold text-amber-600 bg-amber-50 border border-amber-200 px-5 py-2.5 rounded-xl hover:bg-amber-100 transition-colors"
                >
                  + Tambah Rekening Lain
                </button>
              </div>

              {/* LOVE STORY DENGAN LIMITASI */}
              <div className="pt-10 mt-10 border-t border-slate-200">
                <div
                  className="
                    flex flex-col sm:flex-row
                    justify-between items-start sm:items-center
                    gap-4 mb-6
                  "
                >
                  <div>
                    <h3
                      className="
                        font-bold text-slate-800 mb-1
                        flex items-center gap-2
                      "
                    >
                      💌 Perjalanan Cinta
                    </h3>

                    <p className="text-xs text-slate-500">
                      Ceritakan momen bersejarah hubungan Anda.
                    </p>

                    {clientTier === 'exclusive' ? (
                      <p
                        className="
                          text-[10px] font-bold uppercase
                          tracking-widest text-amber-600 mt-2
                        "
                      >
                        Maksimal {maxLoveStory} Cerita (Paket Exclusive)
                      </p>
                    ) : (
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">
                        Tersedia pada Paket Exclusive
                      </p>
                    )}
                  </div>

                  {(formData.loveStory || []).length < maxLoveStory && (
                    <button
                      type="button"
                      onClick={addLoveStory}
                      className="
                        px-5 py-2.5
                        bg-slate-900 text-white
                        font-bold text-[10px] uppercase
                        tracking-widest rounded-xl
                        hover:bg-amber-600
                        transition-colors shadow-lg
                        active:scale-95
                        whitespace-nowrap
                      "
                    >
                      + Tambah Cerita
                    </button>
                  )}
                </div>

                {(formData.loveStory || []).length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 border border-slate-200 border-dashed rounded-2xl text-slate-400 text-xs font-medium">
                    {clientTier === 'exclusive'
                      ? 'Belum ada cerita yang ditambahkan.'
                      : 'Fitur Perjalanan Cinta tidak termasuk dalam paket ini.'}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(formData.loveStory || []).map((story, index) => (
                      <div
                        key={index}
                        className="
                          p-5
                          bg-slate-50
                          border border-slate-200
                          rounded-xl
                          relative
                          group
                        "
                      >
                        <div
                          className="
                            absolute -left-2 -top-2
                            w-6 h-6
                            rounded-full
                            bg-pink-500 text-white
                            flex items-center justify-center
                            text-[10px] font-bold
                            border-2 border-white
                            shadow-sm
                          "
                        >
                          {index + 1}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mb-3">
                          <input
                            type="text"
                            value={story.year}
                            onChange={(e) =>
                              handleLoveStoryChange(index, "year", e.target.value)
                            }
                            placeholder="Tahun (Ex: 2021)"
                            className="
                              w-full sm:w-1/3
                              p-3
                              bg-white
                              border border-slate-200
                              rounded-lg
                              outline-none
                              focus:border-amber-400
                              text-xs font-bold
                              text-amber-600
                            "
                          />

                          <input
                            type="text"
                            value={story.title}
                            onChange={(e) =>
                              handleLoveStoryChange(index, "title", e.target.value)
                            }
                            placeholder="Judul (Ex: Pertama Bertemu)"
                            className="
                              w-full sm:w-2/3
                              p-3
                              bg-white
                              border border-slate-200
                              rounded-lg
                              outline-none
                              focus:border-amber-400
                              text-sm font-bold
                              text-slate-800
                            "
                          />
                        </div>

                        <textarea
                          value={story.text}
                          onChange={(e) =>
                            handleLoveStoryChange(index, "text", e.target.value)
                          }
                          placeholder="Ceritakan kisah singkatnya di sini..."
                          rows="2"
                          className="
                            w-full
                            p-3
                            bg-white
                            border border-slate-200
                            rounded-lg
                            outline-none
                            focus:border-amber-400
                            focus:bg-white
                            transition-colors
                            text-xs
                            text-slate-600
                            mb-3
                          "
                        />

                        <button
                          type="button"
                          onClick={() => removeLoveStory(index)}
                          className="
                            w-full
                            p-2
                            bg-white
                            border border-slate-200
                            rounded-lg
                            text-red-500
                            font-bold
                            text-[10px]
                            uppercase
                            tracking-widest
                            transition-colors
                            hover:text-white
                            hover:bg-red-500
                          "
                        >
                          Hapus Cerita Ini
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NAVIGASI BAWAH SAMA SEPERTI SEBELUMNYA */}
          <div
            className="
              hidden sm:flex
              gap-4
              pt-8
              border-t border-slate-100
            "
          >
            {step > 1 && (
              <button
                type="button"
                onClick={() => {
                  setStep(step - 1);
                  window.scrollTo(0, 0);
                }}
                className="
                  w-1/3
                  px-6 py-4
                  rounded-xl
                  font-bold
                  text-slate-500
                  bg-slate-50
                  border border-slate-200
                  hover:bg-slate-100
                  transition-all
                "
              >
                Kembali
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full
                bg-slate-900 text-white
                py-4
                rounded-xl
                font-bold
                tracking-widest uppercase
                text-sm
                hover:bg-amber-600
                shadow-xl
                transition-all
                disabled:opacity-50
                flex justify-center items-center gap-2
              "
            >
              {isSubmitting ? (
                <>
                  <div
                    className="
                      w-4 h-4
                      border-2
                      border-white/20
                      border-t-white
                      rounded-full
                      animate-spin
                    "
                  ></div>
                  Memproses Data...
                </>
              ) : step < totalSteps ? (
                "Lanjutkan"
              ) : (
                "Selesai & Buat Undangan"
              )}
            </button>
          </div>
        </form>

        <div
          className="
            fixed bottom-0 left-0
            w-full
            bg-white/95 backdrop-blur-md
            border-t border-slate-200
            p-4 pb-5
            flex gap-3 items-center justify-center
            z-[100]
            shadow-[0_-10px_30px_rgba(0,0,0,0.1)]
            sm:hidden
            animate-[slideUp_0.3s_ease-out]
          "
        >
          {step > 1 && (
            <button
              type="button"
              onClick={() => {
                setStep(step - 1);
                window.scrollTo(0, 0);
              }}
              className="
                w-14 h-14
                flex items-center justify-center
                rounded-full
                bg-slate-100
                text-slate-600
                border border-slate-200
                active:scale-95
                transition-all
                flex-shrink-0
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={() => document.querySelector("form").requestSubmit()}
            disabled={isSubmitting}
            className="
              flex-1
              h-14
              rounded-full
              font-bold
              text-white
              bg-amber-600
              hover:bg-amber-700
              shadow-xl shadow-amber-900/30
              transition-all
              disabled:opacity-50
              flex items-center justify-center gap-2
              active:scale-95
              text-sm
              tracking-widest
              uppercase
            "
          >
            {isSubmitting ? (
              <>
                <div
                  className="
                    w-5 h-5
                    border-2
                    border-white/20
                    border-t-white
                    rounded-full
                    animate-spin
                  "
                ></div>
                Menyimpan...
              </>
            ) : step < totalSteps ? (
              "Lanjut"
            ) : (
              "Selesai & Simpan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
