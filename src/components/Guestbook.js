'use client';
import { useState, useEffect } from 'react';
import { submitRSVP, getGuestbook } from '@/lib/actions';

export default function Guestbook({ invitationSlug, theme = 'luxury', colorVariant = 'gold' }) {
  const [listUcapan, setListUcapan] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      if (!invitationSlug) return;
      try {
        const data = await getGuestbook(invitationSlug);
        setListUcapan(data);
      } catch {
        setListUcapan([]);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [invitationSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const formData = new FormData(e.target);
    
    try {
      const response = await submitRSVP(invitationSlug, formData);
      e.target.reset(); 

      if (response && response.isDemo) {
        setListUcapan(prev => [response.data, ...prev]);
        alert(response.message); 
      } else {
        const newData = await getGuestbook(invitationSlug);
        setListUcapan(newData);
      }
    } catch (error) {
      alert(error.message);
    }
    setIsSending(false);
  };

  // ==================================================
  // KAMUS WARNA UNIVERSAL UNTUK GUESTBOOK
  // ==================================================
  const getColorData = (t, v) => {
    if (t === 'luxury') {
      const map = {
        gold: { ring: "focus:ring-amber-400", btnHover: "hover:bg-amber-600" },
        silver: { ring: "focus:ring-slate-400", btnHover: "hover:bg-slate-600" },
        'rose-gold': { ring: "focus:ring-rose-400", btnHover: "hover:bg-rose-600" }
      };
      return map[v] || map.gold;
    }
    if (t === 'classic') {
      const map = {
        emerald: { focus: "focus:border-emerald-800", btn: "border-emerald-800 text-emerald-800 hover:bg-emerald-800 hover:text-white" },
        sapphire: { focus: "focus:border-blue-800", btn: "border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white" },
        ruby: { focus: "focus:border-rose-800", btn: "border-rose-800 text-rose-800 hover:bg-rose-800 hover:text-white" },
        gold: { focus: "focus:border-amber-800", btn: "border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white" },
        monochrome: { focus: "focus:border-stone-800", btn: "border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white" }
      };
      return map[v] || map.monochrome;
    }
    if (t === 'modern') {
      const map = {
        slate: { text: "text-slate-400", focus: "focus:border-slate-400", bgHover: "hover:bg-slate-500", borderL: "border-slate-400" },
        indigo: { text: "text-indigo-500", focus: "focus:border-indigo-500", bgHover: "hover:bg-indigo-500", borderL: "border-indigo-500" },
        rose: { text: "text-rose-500", focus: "focus:border-rose-500", bgHover: "hover:bg-rose-500", borderL: "border-rose-500" },
        teal: { text: "text-teal-400", focus: "focus:border-teal-400", bgHover: "hover:bg-teal-400", borderL: "border-teal-400" },
        amber: { text: "text-amber-500", focus: "focus:border-amber-500", bgHover: "hover:bg-amber-500", borderL: "border-amber-500" }
      };
      return map[v] || map.slate;
    }
    return {};
  };

  const c = getColorData(theme, colorVariant);

  // KONFIGURASI STYLE TIAP TEMA
  const styles = {
    luxury: {
      section: "py-24 px-4 bg-transparent",
      title: "text-4xl font-serif italic text-slate-900 mb-4",
      container: "bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 mb-12",
      label: "text-slate-700 font-medium",
      input: `w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none transition-all text-slate-800 focus:ring-2 ${c.ring}`,
      button: `w-full bg-slate-900 text-white py-4 rounded-2xl font-medium tracking-widest uppercase text-sm transition-all shadow-lg active:scale-[0.98] ${c.btnHover}`,
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
      input: `w-full bg-transparent border-b border-stone-300 px-2 py-4 outline-none transition-all text-stone-800 font-serif italic ${c.focus}`,
      button: `w-full py-4 border font-bold uppercase tracking-[0.3em] text-[10px] transition-all ${c.btn}`,
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
      label: `${c.text} font-black uppercase tracking-[0.2em] text-[10px]`,
      input: `w-full bg-black border border-white/10 rounded-none px-5 py-4 outline-none transition-all text-white font-bold uppercase text-xs tracking-widest ${c.focus}`,
      button: `w-full py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] ${c.bgHover} hover:text-white transition-all shadow-none`,
      pesan: "space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar",
      item: `bg-stone-900/50 border-l-4 ${c.borderL} p-8 mb-6`,
      name: "font-black uppercase tracking-tighter text-white text-xl",
      badgeBase: "text-[8px] px-2 py-0.5 font-bold uppercase tracking-tighter rounded-full",
      text: "text-white/60 font-medium uppercase tracking-wider text-xs leading-loose",
      tanggal: "text-[9px] opacity-70 uppercase tracking-tighter font-bold text-white"
    }
  };

  const getBadgeColor = (status, currentTheme) => {
    const map = {
      luxury: { 'Hadir': "bg-green-100 text-green-600", 'Tidak Hadir': "bg-red-100 text-red-600", 'Masih Ragu': "bg-amber-100 text-amber-600" },
      classic: { 'Hadir': "bg-stone-100 text-stone-600 border border-stone-200", 'Tidak Hadir': "bg-stone-50 text-stone-400 border border-stone-200", 'Masih Ragu': "bg-stone-50 text-stone-500 border border-stone-200" },
      modern: { 'Hadir': "bg-green-500 text-black", 'Tidak Hadir': "bg-red-500 text-white", 'Masih Ragu': "bg-stone-500 text-white" }
    };
    return map[currentTheme]?.[status] || "bg-slate-100 text-slate-500";
  };

  const current = styles[theme] || styles.luxury;

  return (
    <section id="rsvp" className={current.section}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={current.title}>Ucapan & Doa</h2>
          <p className={theme === 'modern' ? 'text-white/30 uppercase text-[10px] tracking-[0.5em]' : 'text-slate-500 font-light italic'}>
            Berikan doa restu Anda untuk kedua mempelai
          </p>
        </div>

        <div className={current.container}>
          {theme === 'classic' && <div className="absolute top-0 left-0 w-full h-1 bg-stone-200"></div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block mb-2 px-1 ${current.label}`}>Nama Lengkap</label>
              <input type="text" name="nama" placeholder="Masukkan nama Anda" className={current.input} required />
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
              <textarea name="pesan" rows="4" placeholder="Tuliskan ucapan Anda..." className={current.input + " resize-none"} required ></textarea>
            </div>

            <button type="submit" disabled={isSending} className={current.button}>
              {isSending ? 'Mengirim...' : 'Kirim Ucapan'}
            </button>
          </form>
        </div>

        <div className={current.pesan}>
          {loading ? (
              <p className="text-center text-slate-400 italic font-serif">Memuat doa & harapan...</p>
          ) : listUcapan.length > 0 ? (
            listUcapan.map((item) => (
              <div key={item.id} className={current.item}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className={current.name}>{item.nama}</h4>
                    <span className={`${current.badgeBase} ${getBadgeColor(item.kehadiran, theme)}`}>{item.kehadiran}</span>
                  </div>
                  <span className={current.tanggal}>{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <p className={current.text}>{item.pesan}</p>
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
