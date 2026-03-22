'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateClientByToken, deleteRSVP } from '@/lib/actions'; 
import { uploadImage } from '@/lib/cloudinary';
import MusicPreview from '@/components/MusicPreview';
import ImageUploader from '@/components/ImageUploader';


export default function EditClient({ initialData }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  // 1. Ekstrak Galeri
  const initialGaleri = initialData.galleries 
    ? initialData.galleries.sort((a, b) => a.position - b.position).map(g => g.image_url) 
    : [];

  // 2. Ekstrak & Urutkan Buku Tamu (Paling baru di atas)
  const initialGuestbook = initialData.guestbook
    ? [...initialData.guestbook].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    : [];

  // 3. Hitung Statistik RSVP
  const stats = {
    total: initialGuestbook.length,
    hadir: initialGuestbook.filter(g => g.kehadiran === 'Hadir').length,
    tidakHadir: initialGuestbook.filter(g => g.kehadiran === 'Tidak Hadir').length,
    ragu: initialGuestbook.filter(g => g.kehadiran === 'Masih Ragu').length,
  };

  let parsedRules = [];
  if (initialData.house_rules) {
    try { parsedRules = typeof initialData.house_rules === 'string' ? JSON.parse(initialData.house_rules) : initialData.house_rules; } 
    catch (e) { parsedRules = []; }
  }

  // PARSING JSONB LOVE STORY
  let parsedStory = [];
  if (initialData.love_story) {
    try { parsedStory = typeof initialData.love_story === 'string' ? JSON.parse(initialData.love_story) : initialData.love_story; } 
    catch (e) { parsedStory = []; }
  }

  const [formData, setFormData] = useState({
    token: initialData.edit_token, tier: initialData.tier || 'basic', fotoSampul: initialData.foto_sampul || '', 
    namaWanita: initialData.nama_wanita || '', namaLengkapWanita: initialData.nama_lengkap_wanita || '', 
    ayahWanita: initialData.nama_ayah_wanita || '', ibuWanita: initialData.nama_ibu_wanita || '', fotoWanita: initialData.foto_wanita || '', 
    namaPria: initialData.nama_pria || '', namaLengkapPria: initialData.nama_lengkap_pria || '', 
    ayahPria: initialData.nama_ayah_pria || '', ibuPria: initialData.nama_ibu_pria || '', fotoPria: initialData.foto_pria || '', 
    tanggalAkad: initialData.tanggal_akad ? initialData.tanggal_akad.split('T')[0] : '', waktuAkad: initialData.waktu_akad || '', tempatAkad: initialData.tempat_akad || '', mapLinkAkad: initialData.map_link_akad || '',
    tanggalResepsi: initialData.tanggal_resepsi ? initialData.tanggal_resepsi.split('T')[0] : '', waktuResepsi: initialData.waktu_resepsi || '', tempatResepsi: initialData.tempat_resepsi || '', mapLinkResepsi: initialData.map_link_resepsi || '',
    alamatKadoFisik: initialData.alamat_kado_fisik || '', musicUrl: initialData.music_url || '/music/DieWithASmile.mp3',
    quotes: initialData.quotes || '',
    houseRules: parsedRules.length > 0 ? parsedRules : [],
    loveStory: parsedStory,
    bankAccounts: initialData.bank_accounts && initialData.bank_accounts.length > 0 ? initialData.bank_accounts : [{ bankName: '', accountNumber: '', accountName: '' }],
    fotoGaleri: initialGaleri
  });

  const [jumlahFoto, setJumlahFoto] = useState(initialGaleri.length > 0 ? initialGaleri.length : 1);
  const maxFoto = formData.tier === 'exclusive' ? 10 : (formData.tier === 'premium' ? 5 : 0);
  const isPremiumOrAbove = formData.tier === 'premium' || formData.tier === 'exclusive';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleHouseRuleChange = (index, field, value) => {
    const newRules = [...formData.houseRules];
    newRules[index][field] = value;
    setFormData({ ...formData, houseRules: newRules });
  };
  // HANDLER LOVE STORY
  const handleLoveStoryChange = (index, field, value) => {
    const newStory = [...formData.loveStory]; newStory[index][field] = value;
    setFormData({ ...formData, loveStory: newStory });
  };
  const addLoveStory = () => setFormData({ ...formData, loveStory: [...formData.loveStory, { year: '2020', title: 'Pertama Bertemu', text: '' }] });
  const removeLoveStory = (index) => setFormData({ ...formData, loveStory: formData.loveStory.filter((_, i) => i !== index) });
  const addHouseRule = () => setFormData({ ...formData, houseRules: [...formData.houseRules, { icon: 'clock', text: '' }] });
  const removeHouseRule = (index) => setFormData({ ...formData, houseRules: formData.houseRules.filter((_, i) => i !== index) });

  // PRESET QUOTES (Taktik Injector)
  const handleQuotePreset = (e) => {
    if(e.target.value) setFormData({ ...formData, quotes: e.target.value });
  };
  const handleBankChange = (index, field, value) => {
    const newBanks = [...formData.bankAccounts]; newBanks[index][field] = value;
    setFormData({ ...formData, bankAccounts: newBanks });
  };
  const addBankAccount = () => setFormData({ ...formData, bankAccounts: [...formData.bankAccounts, { bankName: '', accountNumber: '', accountName: '' }] });
  const removeBankAccount = (index) => setFormData({ ...formData, bankAccounts: formData.bankAccounts.filter((_, i) => i !== index) });
  const handleUpdateGaleriArray = (index, url) => {
    const newGaleri = [...formData.fotoGaleri]; newGaleri[index] = url;
    setFormData({ ...formData, fotoGaleri: newGaleri });
  };

  // LOGIKA EXPORT CSV NATIVE
  const handleExportCSV = () => {
    if (initialGuestbook.length === 0) return alert('Belum ada data tamu untuk diekspor.');
    
    // Header Kolom Excel
    const headers = ['Tanggal Isi', 'Nama Tamu', 'Status Kehadiran', 'Pesan / Doa'];
    
    // Susun baris data
    const csvData = initialGuestbook.map(g => {
      const tanggal = new Date(g.created_at).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      const pesanAman = `"${g.pesan.replace(/"/g, '""').replace(/\n/g, ' ')}"`; // Amankan koma dan enter
      return [ `"${tanggal}"`, `"${g.nama}"`, `"${g.kehadiran}"`, pesanAman ];
    });

    const csvContent = [headers.join(','), ...csvData.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Daftar_Tamu_${formData.namaWanita}_${formData.namaPria}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

 // MESIN CETAK PDF SULTAN (ANTI-SSR & AUTOTABLE FIXED)
  const handleExportPDF = async () => {
    if (stats.total === 0) return alert('Belum ada data tamu untuk diekspor.');

    // Mencegah Next.js SSR mengeksekusi kode ini di server
    if (typeof window === 'undefined') return;

    try {
      // 1. Panggil library HANYA saat tombol diklik (Lazy Load)
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;
      
      // 2. Trik pemanggilan AutoTable untuk Dynamic Import!
      const autoTableModule = await import('jspdf-autotable');
      const autoTable = autoTableModule.default; 

      const doc = new jsPDF();
      
      // Header Kop Dokumen
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`Daftar Hadir Tamu - ${formData.namaWanita} & ${formData.namaPria}`, 14, 20);
      
      // Sub-header Info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })} WIB`, 14, 28);
      doc.text(`Total Mengisi: ${stats.total}  |  Hadir: ${stats.hadir}  |  Ragu: ${stats.ragu}  |  Tidak Hadir: ${stats.tidakHadir}`, 14, 34);

      // Persiapan Data Tabel
      const tableColumn = ["No", "Nama Tamu", "Tgl Isi", "Status", "Pesan / Doa"];
      const tableRows = [];

      initialGuestbook.forEach((guest, index) => {
        const guestData = [
          index + 1,
          guest.nama,
          new Date(guest.created_at).toLocaleDateString('id-ID', {day: '2-digit', month: 'short'}),
          guest.kehadiran,
          guest.pesan
        ];
        tableRows.push(guestData);
      });

      // 3. Generate Tabel dengan gaya pemanggilan yang benar
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: 'grid',
        headStyles: { fillColor: [217, 119, 6] }, 
        styles: { fontSize: 9, cellPadding: 3, font: 'helvetica' },
        columnStyles: { 
          0: { cellWidth: 10, halign: 'center' }, 
          1: { cellWidth: 40 }, 
          2: { cellWidth: 20 }, 
          3: { cellWidth: 22 }, 
          4: { cellWidth: 'auto' } 
        }
      });

      // Simpan File ke HP/Laptop Klien
      doc.save(`Daftar_Hadir_${formData.namaWanita}_${formData.namaPria}.pdf`);
      
    } catch (err) {
      console.error("Gagal memuat pembuat PDF:", err);
      alert("Terjadi kesalahan saat memuat mesin cetak PDF.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalData = { ...formData };
      const uploadIfFile = async (item) => {
        if (item instanceof Blob || item instanceof File) {
          const fd = new FormData(); fd.append('file', item);
          const res = await uploadImage(fd);
          if (!res.success) throw new Error(res.error || "Gagal mengunggah foto ke Cloudinary");
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

      await updateClientByToken(finalData.token, finalData);
      alert('Hore! Data undangan berhasil diperbarui.');
      router.refresh(); 
    } catch (err) {
      alert('Waduh, gagal menyimpan data: ' + err.message);
    }
    setIsSubmitting(false);
  };

  // TAMBAHKAN TAB 7: DAFTAR TAMU
    const tabs = [
    { id: 1, label: 'Cover' }, { id: 2, label: 'Mempelai' }, { id: 3, label: 'Galeri' },
    { id: 4, label: 'Acara' }, { id: 5, label: 'Kado' }, { id: 6, label: 'Musik' },
    { id: 7, label: 'Personalisasi' }, { id: 8, label: 'Daftar Tamu' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-0 sm:p-4 md:p-8 font-sans pb-40 flex justify-center selection:bg-amber-200">
      <div className="max-w-4xl w-full">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-4 md:p-6 rounded-none sm:rounded-[2rem] border-b sm:border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-amber-500/30 text-base md:text-xl">✨</div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">Magic Edit</h1>
              <p className="text-slate-500 text-xs md:text-sm">Sesuaikan undangan di hari bahagia Anda.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-3 md:px-4 py-1.5 md:py-2 rounded-2xl border border-slate-100 w-fit">
            <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Paket:</span>
            <span className="bg-white text-amber-600 px-2 md:px-3 py-0.5 md:py-1 rounded-lg border border-amber-200 font-bold text-[10px] md:text-sm uppercase tracking-widest shadow-sm">{formData.tier}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-t-[2.5rem] rounded-b-none sm:rounded-[2.5rem] sm:shadow-xl sm:border border-slate-200 overflow-hidden relative">
          <div className="flex overflow-x-auto border-b border-slate-100 px-4 md:px-6 pt-4 md:pt-6 scrollbar-hide bg-slate-50/50">
            {tabs.map((tab) => (
              <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`px-4 sm:px-6 py-3 sm:py-4 text-xs md:text-sm font-bold uppercase tracking-wide md:tracking-widest whitespace-nowrap transition-all relative ${ activeTab === tab.id ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600' }`}>
                {tab.label}
                {activeTab === tab.id && ( <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 rounded-t-full shadow-[0_-2px_10px_rgba(245,158,11,0.5)]"></div> )}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-8 md:p-12 bg-white min-h-[500px]">
            
            {/* TAB 1: COVER (Sekarang sudah bersih, khusus foto) */}
            {activeTab === 1 && (
              <div className="space-y-10 animate-[fadeIn_0.3s_ease-out]">
                <div>
                  <div className="border-b border-slate-100 pb-3 md:pb-4 mb-5 md:mb-6">
                    <h2 className="text-lg md:text-xl font-bold text-slate-800">Foto Sampul Depan</h2>
                    <p className="text-xs text-slate-500 mt-1">Foto utama yang akan tampil memenuhi layar saat undangan pertama dibuka.</p>
                  </div>
                  <ImageUploader label="Foto Background Utama (Crop Portrait 9:16)" aspectRatio={9/16} currentImage={formData.fotoSampul} onUploadSuccess={(url) => setFormData({...formData, fotoSampul: url})} />
                </div>
              </div>
            )}

            {/* TAB 2: MEMPELAI */}
            {activeTab === 2 && (
                <div className="space-y-12 animate-[fadeIn_0.3s_ease-out]">
                    <div>
                        <div className="border-b border-slate-100 pb-4 mb-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm">1</span> Mempelai Wanita</h2>
                        </div>
                        <div className="mb-6"><ImageUploader label="Foto Wanita" currentImage={formData.fotoWanita} onUploadSuccess={(url) => setFormData({...formData, fotoWanita: url})} /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div><label className="block text-[11px] font-bold text-slate-500 uppercase">Panggilan</label><input type="text" name="namaWanita" value={formData.namaWanita} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transtion-colors" /></div>
                            <div><label className="block text-[11px] font-bold text-slate-500 uppercase">Lengkap</label><input type="text" name="namaLengkapWanita" value={formData.namaLengkapWanita} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transtion-colors" /></div>
                            <div><label className="block text-[11px] font-bold text-slate-500 uppercase">Ayah</label><input type="text" name="ayahWanita" value={formData.ayahWanita} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transtion-colors" /></div>
                            <div><label className="block text-[11px] font-bold text-slate-500 uppercase">Ibu</label><input type="text" name="ibuWanita" value={formData.ibuWanita} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transtion-colors" /></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5">2. Mempelai Pria</h3>
                        <div className="mb-6"><ImageUploader label="Foto Pria" currentImage={formData.fotoPria} onUploadSuccess={(url) => setFormData({...formData, fotoPria: url})} /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div><label className="block text-[11px] font-bold text-slate-500 uppercase">Panggilan</label><input type="text" name="namaPria" value={formData.namaPria} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transtion-colors" /></div>
                            <div><label className="block text-[11px] font-bold text-slate-500 uppercase">Lengkap</label><input type="text" name="namaLengkapPria" value={formData.namaLengkapPria} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transtion-colors" /></div>
                            <div><label className="block text-[11px] font-bold text-slate-500 uppercase">Ayah</label><input type="text" name="ayahPria" value={formData.ayahPria} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transtion-colors" /></div>
                            <div><label className="block text-[11px] font-bold text-slate-500 uppercase">Ibu</label><input type="text" name="ibuPria" value={formData.ibuPria} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-amber-400 transtion-colors" /></div>
                        </div>
                     </div>
                </div>
            )}

            {/* TAB 3: GALERI */}
            {activeTab === 3 && (
                <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                    {!isPremiumOrAbove ? (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl">🔒 Fitur Terkunci</div>
                        ): (
                        <>
                        <div className="border-b border-slate-100 pb-4">
                            <h2 className="text-xl font-bold text-slate-800">Visualisasi Kebahagiaan</h2>
                            <p className="text-sm text-slate-500 mt-1">Foto-foto ini akan disusun rapi menjadi sebuah grid galeri sebelum bagian kado.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-slate-800">Jumlah Slot Foto</h3>
                                <p className="text-xs text-slate-500 mt-1">Batas maksimal: {maxFoto} foto</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                                <button type="button" onClick={() => setJumlahFoto(Math.max(1, jumlahFoto - 1))} className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-lg">-</button>
                                <span className='w-8 text-center font-bold text-slate-800 text-lg'>{jumlahFoto}</span>
                                <button type="button" onClick={() => setJumlahFoto(Math.min(maxFoto, jumlahFoto + 1))} className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-lg">+</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{Array.from({ length: jumlahFoto }).map((_, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group"><div className="absolute -top-3 -left-3 w-8 h-8 bg-amber-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-4 border-white z-10">{index + 1}</div><ImageUploader label={`Galeri ${index+1}`} currentImage={formData.fotoGaleri[index]} onUploadSuccess={(url) => handleUpdateGaleriArray(index, url)} /></div>))}
                        </div></>)}
                    </div>)}

            {/* TAB 4: ACARA */}
            {activeTab === 4 && (
              <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Jadwal & Lokasi</h2>
                </div>
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
                            <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl"><label className="font-bold text-slate-700 block mb-3">Pilih Lagu Romantis</label><select name="musicUrl" value={formData.musicUrl} onChange={handleChange} className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl outline-none text-slate-800 font-bold focus:ring-2 focus:ring-amber-400 mb-6 cursor-pointer"><option value="/music/DieWithASmile.mp3">Die With A Smile - Lady Gaga & Bruno Mars</option><option value="/music/AThousandYears.mp3">A Thousand Years - Christina Perri</option><option value="/music/LaguPernikahanKita.mp3">Lagu Pernikahan Kita - Tiara Andini</option><option value="/music/TeruntukMia.mp3">Teruntuk Mia - Nadin Amizah</option></select><div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"><MusicPreview url={formData.musicUrl} /></div></div>
                          </div>
                        )}

            {/* TAB 7: PERSONALISASI (KAMAR SULTAN KHUSUS QUOTES & RULES) */}
            {activeTab === 7 && (
              <div className="space-y-10 animate-[fadeIn_0.3s_ease-out]">
                
                {/* KARTU 1: QUOTES */}
                <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>
                  <div className="border-b border-slate-200 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                      <span className="text-2xl">📖</span> Kutipan Romantis
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Hiasi halaman depan undangan Anda dengan kata-kata indah.</p>
                  </div>
                  
                  <select onChange={handleQuotePreset} className="w-full px-5 py-4 mb-5 bg-white text-slate-700 border border-slate-200 rounded-xl outline-none font-bold text-sm cursor-pointer hover:border-amber-400 shadow-sm transition-colors">
                    <option value="">💡 Pilih Kutipan Otomatis (Opsional)...</option>
                    <optgroup label="Berdasarkan Agama">
                      <option value={`وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةًۗ اِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ\n\nDi antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia menciptakan pasangan-pasangan untukmu dari (jenis) dirimu sendiri agar kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa cinta dan kasih sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir. (QS. Ar-Rum: 21)`}>Islami: QS. Ar-Rum: 21</option>
                      <option value={`بَارَكَ اللهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ\n\nSemoga Allah memberkahimu di waktu bahagia dan memberkahimu di waktu susah, serta semoga Allah menghimpun kalian berdua dalam kebaikan. (HR. Abu Dawud, Tirmidzi, dan Ahmad).`}>Islami: Doa Nabi Muhammad SAW</option>
                      <option value="Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia. (Matius 19:6)">Kristiani: Matius 19:6</option>
                      <option value="Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan. (Kolose 3:14)">Kristiani: Kolose 3:14</option>
                    </optgroup>
                    <optgroup label="Universal & Puitis">
                      <option value="Cinta tidak berupa tatapan satu sama lain, tetapi memandang ke luar bersama ke arah yang sama. (Antoine de Saint-Exupéry)">Puitis: Memandang Bersama</option>
                      <option value="Dua jiwa namun satu pikiran, dua hati namun satu detak. (John Keats)">Puitis: Dua Jiwa Satu Detak</option>
                      <option value="Aku memilihmu. Dan aku akan memilihmu terus menerus, tanpa henti, tanpa ragu, dalam setiap detak jantungku.">Puitis: Aku Memilihmu</option>
                    </optgroup>
                    <optgroup label="English / Aesthetic">
                      <option value="I have found the one whom my soul loves. (Song of Solomon 3:4)">English: Found The One</option>
                      <option value="To love and be loved is to feel the sun from both sides. (David Viscott)">English: Feel The Sun</option>
                    </optgroup>
                  </select>
                  <textarea name="quotes" value={formData.quotes} onChange={handleChange} placeholder="Atau ketik kata-kata puitis Anda sendiri di sini..." rows="4" className="w-full p-5 bg-white border border-slate-200 rounded-xl outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-50 transition-all text-sm leading-relaxed shadow-inner"></textarea>
                </div>

                {/* KARTU 2: TATA TERTIB */}
                <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-800"></div>
                  <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                        <span className="text-2xl">📋</span> Tata Tertib Acara
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">Pilih ikon dan buat aturan khusus untuk tamu undangan Anda.</p>
                    </div>
                    <button type="button" onClick={addHouseRule} className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-600 transition-colors shadow-lg active:scale-95 whitespace-nowrap">
                      + Tambah Aturan
                    </button>
                  </div>

                  {formData.houseRules.length === 0 ? (
                    <div className="text-center py-10 bg-white border border-slate-200 border-dashed rounded-2xl text-slate-400 text-sm font-medium">
                      Belum ada tata tertib yang ditambahkan.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.houseRules.map((rule, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-3 items-start md:items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm group hover:border-amber-300 transition-colors">
                          <select value={rule.icon} onChange={(e) => handleHouseRuleChange(index, 'icon', e.target.value)} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer text-sm font-bold text-slate-700 w-full md:w-48 focus:border-amber-400">
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
                          <input type="text" value={rule.text} onChange={(e) => handleHouseRuleChange(index, 'text', e.target.value)} placeholder="Tuliskan aturan detail di sini..." className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-400 focus:bg-white transition-colors text-sm" />
                          <button type="button" onClick={() => removeHouseRule(index)} className="p-3.5 text-red-500 hover:text-white bg-red-50 border border-red-100 rounded-lg hover:bg-red-500 w-full md:w-auto font-bold text-xs uppercase tracking-widest transition-colors">Hapus</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* KARTU 3: LOVE STORY (KHUSUS EXCLUSIVE) */}
                <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-pink-400"></div>
                  <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                        <span className="text-2xl">💌</span> Perjalanan Cinta
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">Ceritakan momen bersejarah hubungan Anda (Tahun Bertemu, Jadian, Tunangan).</p>
                    </div>
                    {formData.tier === 'exclusive' && (
                      <button type="button" onClick={addLoveStory} className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-amber-600 transition-colors shadow-lg active:scale-95 whitespace-nowrap">
                        + Tambah Cerita
                      </button>
                    )}
                  </div>

                  {formData.tier !== 'exclusive' ? (
                     <div className="text-center py-10 bg-white border border-slate-200 border-dashed rounded-2xl">
                       <div className="text-3xl mb-2">🔒</div>
                       <p className="text-slate-400 text-sm font-medium">Fitur Love Story Timeline hanya tersedia untuk Paket Exclusive.</p>
                     </div>
                  ) : formData.loveStory.length === 0 ? (
                    <div className="text-center py-10 bg-white border border-slate-200 border-dashed rounded-2xl text-slate-400 text-sm font-medium">
                      Belum ada cerita yang ditambahkan.
                    </div>
                  ) : (
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                      {formData.loveStory.map((story, index) => (
                        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-pink-100 text-pink-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-xs font-bold relative z-10">
                            {index + 1}
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-pink-300 transition-colors">
                            <div className="flex gap-2 mb-3">
                              <input type="text" value={story.year} onChange={(e) => handleLoveStoryChange(index, 'year', e.target.value)} placeholder="Tahun (Ex: 2021)" className="w-1/3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-400 text-xs font-bold text-amber-600" />
                              <input type="text" value={story.title} onChange={(e) => handleLoveStoryChange(index, 'title', e.target.value)} placeholder="Judul (Ex: Pertama Bertemu)" className="w-2/3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-400 text-sm font-bold text-slate-800" />
                            </div>
                            <textarea value={story.text} onChange={(e) => handleLoveStoryChange(index, 'text', e.target.value)} placeholder="Ceritakan kisah singkatnya di sini..." rows="2" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-400 focus:bg-white transition-colors text-xs text-slate-600 mb-3"></textarea>
                            <button type="button" onClick={() => removeLoveStory(index)} className="text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-lg w-full font-bold text-[10px] uppercase tracking-widest transition-colors">Hapus Cerita</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 8: DASBOR RSVP KLIEN (Sekarang bergeser jadi Tab 8) */}
            {activeTab === 8 && (
              <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                
                {formData.tier === 'basic' ? (
                  /* TAMPILAN BASIC: GEMBOK PROVOKATIF */
                  <div className="text-center py-16 md:py-20 bg-slate-50 rounded-[2rem] border border-slate-100 p-6 shadow-inner">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-4xl md:text-5xl border border-slate-200 shadow-sm">🔒</div>
                    <h2 className="text-2xl md:text-3xl font-serif italic text-slate-800 mb-4">Manajemen RSVP Terkunci</h2>
                    <p className="text-sm md:text-base text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
                      Saat ini Anda hanya bisa melihat ucapan melalui link undangan publik. Ingin mengelola daftar hadir, <strong className="text-slate-700">menghapus pesan spam</strong>, dan mencetak dokumen rekapitulasi tamu?
                    </p>
                    <button type="button" onClick={() => alert('Segera hubungi Admin FluxWedding untuk meng-upgrade ke Paket Premium / Exclusive dan nikmati fitur ini!')} className="px-8 py-4 bg-slate-900 text-white font-bold rounded-full shadow-xl hover:bg-amber-600 transition-all uppercase tracking-widest text-xs active:scale-95">
                      Upgrade Paket Sekarang
                    </button>
                  </div>
                ) : (

                  /* TAMPILAN PREMIUM & EXCLUSIVE: DASBOR TERBUKA */
                  <>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-6 gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-800">Daftar Kehadiran Tamu</h2>
                        <p className="text-sm text-slate-500 mt-1">Pantau ucapan dan kelola status kehadiran tamu undangan Anda.</p>
                      </div>
                      
                      {/* LOGIKA UPSELL TOMBOL PDF */}
                      {formData.tier === 'exclusive' ? (
                        <button type="button" onClick={handleExportPDF} className="px-6 py-2.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-bold hover:bg-amber-100 transition-colors flex items-center gap-2 text-sm whitespace-nowrap shadow-sm active:scale-95">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                          Cetak PDF
                        </button>
                      ) : (
                        <button type="button" onClick={() => alert('Fitur Ekspor PDF Dokumen Rekap Daftar Hadir dengan kop surat resmi HANYA tersedia untuk Paket Exclusive. Upgrade sekarang untuk kemudahan cetak data tamu Anda!')} className="px-6 py-2.5 bg-slate-50 text-slate-400 border border-slate-200 rounded-xl font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 text-sm whitespace-nowrap cursor-not-allowed">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          Cetak PDF (Eksklusif)
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Isi</p><p className="text-3xl font-bold text-slate-800">{stats.total}</p></div>
                      <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center"><p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Hadir</p><p className="text-3xl font-bold text-emerald-700">{stats.hadir}</p></div>
                      <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-center"><p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Ragu-ragu</p><p className="text-3xl font-bold text-amber-700">{stats.ragu}</p></div>
                      <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-center"><p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-1">Tidak Hadir</p><p className="text-3xl font-bold text-red-700">{stats.tidakHadir}</p></div>
                    </div>

                    <div className="mt-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                      {initialGuestbook.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 font-medium"><div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📝</div>Belum ada tamu yang mengisi buku tamu.</div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500 border-b border-slate-200">
                                <th className="p-4 font-bold">Tamu & Tanggal</th>
                                <th className="p-4 font-bold">Status</th>
                                <th className="p-4 font-bold">Pesan / Doa</th>
                                <th className="p-4 font-bold text-center">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="text-sm">
                              {initialGuestbook.map((guest, idx) => (
                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                  <td className="p-4 align-top whitespace-nowrap"><p className="font-bold text-slate-800">{guest.nama}</p><p className="text-[10px] text-slate-400 mt-1">{new Date(guest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p></td>
                                  <td className="p-4 align-top whitespace-nowrap"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${guest.kehadiran === 'Hadir' ? 'bg-emerald-100 text-emerald-700' : guest.kehadiran === 'Tidak Hadir' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{guest.kehadiran}</span></td>
                                  <td className="p-4 align-top min-w-[200px] text-slate-600 italic">"{guest.pesan}"</td>
                                  <td className="p-4 align-top text-center">
                                    <button 
                                      type="button" 
                                      onClick={async () => {
                                        if(confirm(`Yakin ingin menghapus secara permanen pesan dari ${guest.nama}?`)) {
                                          try { await deleteRSVP(guest.id); alert('Pesan berhasil dibasmi!'); router.refresh(); } 
                                          catch(err) { alert('Gagal menghapus'); }
                                        }
                                      }} 
                                      className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Pesan"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

          </div>

          <div className="bg-slate-50 border-t border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sistem Upload Massal Aktif</span></div>
            <div className="flex gap-4 w-full sm:w-auto">
             <button type="submit" disabled={isSubmitting} className="hidden sm:flex px-10 py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-amber-600 shadow-xl transition-all disabled:opacity-50 items-center justify-center gap-2 w-full sm:w-auto text-sm md:text-base">
               {isSubmitting ? 'Menyimpan...' : 'Simpan & Upload Perubahan'}
             </button>
            </div>
          </div>
        </form>

        <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 pb-5 flex items-center justify-center z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] sm:hidden animate-[slideUp_0.4s_ease-out_0.5s_both]">
          <button type="button" onClick={() => document.querySelector('form').requestSubmit()} disabled={isSubmitting} className="w-full h-14 rounded-full font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-xl shadow-amber-900/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2.5 active:scale-95 text-base tracking-widest uppercase">
            {isSubmitting ? ( <><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>Menyimpan...</> ) : 'Simpan & Upload'}
          </button>
        </div>

      </div>
    </div>
  );
}


