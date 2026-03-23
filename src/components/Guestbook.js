'use client';
import { useState, useEffect } from 'react';
import { submitRSVP, getGuestbook } from '@/lib/actions';

export default function Guestbook({ invitationId, theme = 'luxury' }) {
  const [listUcapan, setListUcapan] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      if (!invitationId) return;
      const data = await getGuestbook(invitationId);
      setListUcapan(data);
      setLoading(false);
    }
    fetchComments();
  }, [invitationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const formData = new FormData(e.target);
    
    try {
      // 1. Tangkap respon dari server action
      const response = await submitRSVP(invitationId, formData);
      e.target.reset(); // Kosongkan form

      // 2. === CEK APAKAH INI MODE DEMO ===
      if (response && response.isDemo) {
        // Jika Demo: Masukkan data sementara ke paling atas daftar (tanpa menyentuh database)
        setListUcapan(prev => [response.data, ...prev]);
        
        // Opsional: Kasih tahu pengunjung kalau ini cuma demo
        alert(response.message); 
      } else {
        // Jika Live (Bukan Demo): Ambil ulang data yang sebenarnya dari database
        const newData = await getGuestbook(invitationId);
        setListUcapan(newData);
      }

    } catch (error) {
      alert(error.message);
    }
    
    setIsSending(false);
  };

  // KONFIGURASI STYLE TIAP TEMA
  const styles = {
    luxury: {
      section: "py-24 px-4 bg-transparent",
      title: "text-4xl font-serif italic text-slate-900 mb-4",
      container: "bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 mb-12",
      label: "text-slate-700 font-medium",
      input: "w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none transition-all text-slate-800",
      button: "w-full bg-slate-900 text-white py-4 rounded-2xl font-medium tracking-widest uppercase text-sm hover:bg-amber-600 transition-all shadow-lg active:scale-[0.98]",
      pesan: "space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar",
      item: "bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white shadow-sm mb-6",
      name: "font-bold text-slate-800",
      badgeBase: "text-[8px] px-2 py-0.5 font-bold uppercase tracking-tighter rounded-full",
      text: "text-slate-600 font-light",
      tanggal: "text-[9px] opacity-40 uppercase tracking-tighter font-bold"
    },
    classic: {
      section: "py-24 px-4 bg-transparent",
      title: "text-3xl font-serif text-stone-800 uppercase tracking-widest mb-4",
      container: "bg-white border border-stone-300 p-8 md:p-12 mb-12 relative overflow-hidden",
      label: "text-stone-700 font-serif italic text-xs uppercase tracking-widest",
      input: "w-full bg-transparent border-b border-stone-300 px-2 py-4 focus:border-stone-800 outline-none transition-all text-stone-800 font-serif italic",
      button: "w-full py-4 border border-stone-800 text-stone-800 font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-stone-800 hover:text-white transition-all",
      pesan: "space-y-4 max-h-[600px] border border-stone-200 p-7 overflow-y-auto pr-2 custom-scrollbar",
      item: "border-b border-stone-200 py-8 last:border-0 mb-0",
      name: "font-serif text-lg text-stone-900",
      badgeBase: "text-[8px] px-2 py-0.5 font-bold uppercase tracking-tighter rounded-full",
      text: "text-stone-700 font-serif italic leading-relaxed",
      tanggal: "text-[9px] opacity-40 uppercase tracking-tighter font-bold"
    },
    modern: {
      section: "py-24 px-4 bg-transparent",
      title: "text-5xl font-black uppercase tracking-tighter italic text-white mb-4",
      container: "bg-stone-900 border border-white/10 p-8 md:p-12 mb-12",
      label: "text-amber-500 font-black uppercase tracking-[0.2em] text-[10px]",
      input: "w-full bg-black border border-white/10 rounded-none px-5 py-4 focus:border-amber-500 outline-none transition-all text-white font-bold uppercase text-xs tracking-widest",
      button: "w-full py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] hover:bg-amber-500 hover:text-white transition-all shadow-none",
      pesan: "space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar",
      item: "bg-stone-900/50 border-l-4 border-amber-500 p-8 mb-6",
      name: "font-black uppercase tracking-tighter text-white text-xl",
      badgeBase: "text-[8px] px-2 py-0.5 font-bold uppercase tracking-tighter rounded-full",
      text: "text-white/60 font-medium uppercase tracking-wider text-xs leading-loose",
      tanggal: "text-[9px] opacity-70 uppercase tracking-tighter font-bold text-white"
    }
  };

  const getBadgeColor = (status, currentTheme) => {
    const map = {
      luxury: {
        'Hadir': "bg-green-100 text-green-600",
        'Tidak Hadir': "bg-red-100 text-red-600",
        'Masih Ragu': "bg-amber-100 text-amber-600",
      },
      classic: {
        'Hadir': "bg-stone-100 text-stone-600 border border-stone-200",
        'Tidak Hadir': "bg-stone-50 text-stone-400 border border-stone-200",
        'Masih Ragu': "bg-stone-50 text-stone-500 border border-stone-200",
      },
      modern: {
        'Hadir': "bg-green-500 text-black",
        'Tidak Hadir': "bg-red-500 text-white",
        'Masih Ragu': "bg-amber-500 text-black",
      }
    };
    return map[currentTheme]?.[status] || "bg-slate-100 text-slate-500";
  };

  const current = styles[theme] || styles.luxury;

  return (
    <section className={current.section}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={current.title}>Ucapan & Doa</h2>
          <p className={theme === 'modern' ? 'text-white/30 uppercase text-[10px] tracking-[0.5em]' : 'text-slate-500 font-light italic'}>
            Berikan doa restu Anda untuk kedua mempelai
          </p>
        </div>

        {/* Form RSVP & Guestbook */}
        <div className={current.container}>
          {theme === 'classic' && <div className="absolute top-0 left-0 w-full h-1 bg-stone-200"></div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block mb-2 px-1 ${current.label}`}>Nama Lengkap</label>
              <input 
                type="text" 
                name="nama"
                placeholder="Masukkan nama Anda"
                className={current.input}
                required
              />
            </div>

            <div>
              <label className={`block mb-2 px-1 ${current.label}`}>Konfirmasi Kehadiran</label>
              <select name="kehadiran" className={current.input} required>
                <option value="Hadir">Hadir</option>
                <option value="Tidak Hadir">Tidak Hadir</option>
                <option value="Masih Ragu">Masih Ragu</option>
              </select>
            </div>

            <div>
              <label className={`block mb-2 px-1 ${current.label}`}>Ucapan & Doa</label>
              <textarea 
                name="pesan"
                rows="4" 
                placeholder="Tuliskan ucapan Anda..."
                className={current.input + " resize-none"}
                required
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={isSending}
              className={current.button}
            >
              {isSending ? 'Mengirim...' : 'Kirim Ucapan'}
            </button>
          </form>
        </div>

        {/* Daftar Ucapan (Feed) */}
        <div className={current.pesan}>
          {loading ? (
              <p className="text-center text-slate-400 italic font-serif">Memuat doa & harapan...</p>
          ) : listUcapan.length > 0 ? (
            listUcapan.map((item) => (
              <div key={item.id} className={current.item}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className={current.name}>{item.nama}</h4>
                    
                    {/* LOGIKA BADGE DINAMIS DI SINI */}
                    <span className={`${current.badgeBase} ${getBadgeColor(item.kehadiran, theme)}`}>
                      {item.kehadiran}
                    </span>
                    
                  </div>
                  <span className={current.tanggal}>
                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className={current.text}>
                  {item.pesan}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-400 font-serif italic">Belum ada ucapan. Jadilah yang pertama!</p>
          )}
        </div>
      </div>
    </section>
  );
}