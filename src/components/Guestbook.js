'use client';
import { useState, useEffect } from 'react';
import { submitRSVP, getGuestbook } from '@/lib/actions';

export default function Guestbook({ invitationId }) {
  const [listUcapan, setListUcapan] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Fungsi ambil data via Server Action
  useEffect(() => {
    async function fetchComments() {
      if (!invitationId) return;
      const data = await getGuestbook(invitationId);
      setListUcapan(data);
      setLoading(false);
    }
    fetchComments();
  }, [invitationId]);

  // 2. Fungsi kirim ucapan via Server Action
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    
    // Tarik data langsung dari form HTML bawaan (lebih ringan dari useState)
    const formData = new FormData(e.target);
    
    try {
      await submitRSVP(invitationId, formData);
      e.target.reset(); // Kosongkan form setelah sukses
      
      // Ambil ulang data terbaru agar ucapan langsung muncul
      const newData = await getGuestbook(invitationId);
      setListUcapan(newData);
    } catch (error) {
      alert(error.message);
    }
    setIsSending(false);
  };

  return (
    <section className="py-24 px-4 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif italic text-slate-900 mb-4">Ucapan & Doa</h2>
          <p className="text-slate-500 font-light">Berikan doa restu Anda untuk kedua mempelai</p>
        </div>

        {/* Form RSVP & Guestbook */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 px-1">Nama Lengkap</label>
              <input 
                type="text" 
                name="nama"
                placeholder="Masukkan nama Anda"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-400 outline-none transition-all text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 px-1">Konfirmasi Kehadiran</label>
              <select 
                name="kehadiran"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-400 outline-none transition-all text-slate-800 cursor-pointer"
                required
              >
                <option value="Hadir">Hadir</option>
                <option value="Tidak Hadir">Tidak Hadir</option>
                <option value="Masih Ragu">Masih Ragu</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 px-1">Ucapan & Doa</label>
              <textarea 
                name="pesan"
                rows="4" 
                placeholder="Tuliskan ucapan Anda..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-400 outline-none transition-all text-slate-800 resize-none"
                required
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={isSending}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-medium tracking-widest uppercase text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98] disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isSending ? 'Mengirim...' : 'Kirim Ucapan'}
            </button>
          </form>
        </div>

        {/* Daftar Ucapan (Feed) */}
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
             <p className="text-center text-slate-400 italic font-serif">Memuat doa & harapan...</p>
          ) : listUcapan.length > 0 ? (
            listUcapan.map((item) => (
              <div key={item.id} className="bg-white/60 backdrop-blur-sm p-6 rounded-3xl border border-white shadow-sm animate-fade-in">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800">{item.nama}</h4>
                    {item.kehadiran === 'Hadir' && (
                      <span className="bg-green-100 text-green-600 text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Hadir</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-tighter">
                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className="text-slate-600 font-light leading-relaxed text-sm">
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