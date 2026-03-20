'use client';
import Reveal from './Reveal';

export default function Acara({ data, trigger }) {
  if (!data) return null;

  // Fungsi untuk memformat tanggal (misal: "Sabtu, 20 Maret 2026")
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <section className="py-24 px-4 bg-slate-50 overflow-hidden text-center">
      <div className="max-w-4xl mx-auto">
        <Reveal trigger={trigger} direction="up">
          <h2 className="text-2xl md:text-3xl font-serif italic text-slate-800 uppercase tracking-[0.4em] mb-16">
            Rangkaian Acara
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* KARTU AKAD */}
          <Reveal trigger={trigger} direction="up" delay={0.2}>
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 h-full flex flex-col items-center justify-center relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-purple-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-6 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              
              <h3 className="text-3xl font-serif italic text-slate-900 mb-2">Akad Nikah</h3>
              <div className="h-px w-12 bg-slate-200 mb-6"></div>
              
              <p className="text-slate-700 font-medium mb-1">{formatDate(data.tanggal_akad)}</p>
              <p className="text-slate-500 text-sm mb-6">Pukul {data.waktu_akad || "-"} WIB</p>
              
              <p className="text-slate-800 font-bold mb-1">{data.tempat_akad || "Lokasi Menyusul"}</p>
              <p className="text-slate-500 text-sm mb-8">{data.alamat_akad || ""}</p>
              {data.map_link_akad && (
                <a 
                  href={data.map_link_akad} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  Buka Peta Lokasi
                </a>
              )}
            </div>
          </Reveal>

          {/* KARTU RESEPSI */}
          <Reveal trigger={trigger} direction="up" delay={0.4}>
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 h-full flex flex-col items-center justify-center relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-purple-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-6 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20v-4"/><path d="M22 20h.01"/><path d="M12 3a9 9 0 0 0-9 9v3.5"/><path d="M21 12a9 9 0 0 0-9-9"/></svg>
              </div>
              
              <h3 className="text-3xl font-serif italic text-slate-900 mb-2">Resepsi</h3>
              <div className="h-px w-12 bg-slate-200 mb-6"></div>
              
              <p className="text-slate-700 font-medium mb-1">{formatDate(data.tanggal_resepsi)}</p>
              <p className="text-slate-500 text-sm mb-6">Pukul {data.waktu_resepsi || "-"} WIB</p>
              
              <p className="text-slate-800 font-bold mb-1">{data.tempat_resepsi || "Lokasi Menyusul"}</p>
              <p className="text-slate-500 text-sm mb-8">{data.alamat_resepsi || ""}</p>
              {/* Tombol Maps Resepsi */}
              {data.map_link_resepsi && (
                <a 
                  href={data.map_link_resepsi} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  Buka Peta Lokasi
                </a>
              )}
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}