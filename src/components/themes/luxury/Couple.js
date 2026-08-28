'use client';
import Reveal from '@/components/Reveal';

function ProfileCard({ person, gender, textAccent }) {
  return (
    <div className="flex flex-col items-center px-6 py-10 bg-white rounded-3xl shadow-xl border border-slate-100">
      <div className="relative w-48 h-48 mb-8">
        <img src={person.foto} alt={person.namaPanggilan} className="rounded-full w-full h-full object-cover" />
      </div>
      <p className={`text-xl ${textAccent} font-serif italic mb-2`}>{gender === 'wanita' ? 'Putri dari' : 'Putra dari'}</p>
      <p className="text-sm text-slate-700 font-medium mb-1">Bapak {person.ayah}</p>
      <p className="text-sm text-slate-700 font-medium mb-6">& Ibu {person.ibu}</p>
      <h3 className="text-5xl font-serif text-slate-900 mb-3 italic">{person.namaPanggilan}</h3>
      <p className="text-base text-slate-800 font-medium tracking-wide">{person.namaLengkap}</p>
    </div>
  );
}

export default function Mempelai({ data, trigger, colorVariant }) {
  if (!data) return null;

  // ================= KAMUS WARNA (LIGHT MODE) =================
  const themeStyles = {
    gold: { textAccent: "text-amber-600", bgLight: "text-amber-50" },
    silver: { textAccent: "text-slate-500", bgLight: "text-slate-100" },
    'rose-gold': { textAccent: "text-rose-600", bgLight: "text-rose-50" }
  };
  const currentStyle = themeStyles[colorVariant] || themeStyles.gold;
  // ==========================================================

  const svgWanita = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23f8fafc"><rect width="100" height="100" fill="%23e2e8f0"/><circle cx="50" cy="40" r="15" fill="%2394a3b8"/><path d="M20 100 c0-20 15-35 30-35 s30 15 30 35 z" fill="%2394a3b8"/></svg>`;
  const svgPria = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23f8fafc"><rect width="100" height="100" fill="%23f1f5f9"/><circle cx="50" cy="40" r="15" fill="%23cbd5e1"/><path d="M25 100 c0-15 10-30 25-30 s25 15 25 30 z" fill="%23cbd5e1"/></svg>`;

  const mempelaiWanita = {
    namaPanggilan: data.nama_wanita || "Mempelai Wanita",
    namaLengkap: data.nama_lengkap_wanita || "Nama Lengkap Mempelai Wanita", 
    ayah: data.nama_ayah_wanita || "Nama Ayah", 
    ibu: data.nama_ibu_wanita || "Nama Ibu",
    foto: data.foto_wanita || svgWanita,
  };

  const mempelaiPria = {
    namaPanggilan: data.nama_pria || "Mempelai Pria",
    namaLengkap: data.nama_lengkap_pria || "Nama Lengkap Mempelai Pria",
    ayah: data.nama_ayah_pria || "Nama Ayah", 
    ibu: data.nama_ibu_pria || "Nama Ibu",
    foto: data.foto_pria || svgPria,
  };

  return (
    <section className="py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <Reveal trigger={trigger} direction="up">
          <h2 className="text-2xl md:text-3xl font-serif italic text-slate-800 uppercase tracking-[0.4em] mb-20 text-center">Mempelai</h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-12">
          <Reveal trigger={trigger} direction="left" delay={0.2}>
            <ProfileCard person={mempelaiWanita} gender="wanita" textAccent={currentStyle.textAccent} />
          </Reveal>
          <Reveal trigger={trigger} direction="fade" delay={0.4}>
            <div className={`text-8xl ${currentStyle.bgLight} italic text-center`}>&</div>
          </Reveal>
          <Reveal trigger={trigger} direction="right" delay={0.2}>
            <ProfileCard person={mempelaiPria} gender="pria" textAccent={currentStyle.textAccent} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
