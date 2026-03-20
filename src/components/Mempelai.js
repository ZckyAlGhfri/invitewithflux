'use client';
import Image from 'next/image';
import Reveal from './Reveal';

export default function Mempelai({ data, trigger }) {
  if (!data) return null;

  // Menggunakan data asli dari Supabase, dengan fallback (nilai default) jika kosong
  const mempelaiWanita = {
    namaPanggilan: data.nama_wanita,
    namaLengkap: data.nama_lengkap_wanita || `${data.nama_wanita} ...`, 
    ayah: data.nama_ayah_wanita || "Fulan", 
    ibu: data.nama_ibu_wanita || "Fulanah",
    foto: data.foto_wanita || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600",
  };

  const mempelaiPria = {
    namaPanggilan: data.nama_pria,
    namaLengkap: data.nama_lengkap_pria || `${data.nama_pria} ...`,
    ayah: data.nama_ayah_pria || "Fulan", 
    ibu: data.nama_ibu_pria || "Fulanah",
    foto: data.foto_pria || "https://images.unsplash.com/photo-1550005816-193a68a15db8?q=80&w=600",
  };

  const CardProfil = ({ person, gender }) => (
    <div className="flex flex-col items-center px-6 py-10 bg-white rounded-3xl shadow-xl border border-slate-100">
      <div className="relative w-48 h-48 mb-8">
        <Image src={person.foto} alt={person.namaPanggilan} width={200} height={200} className="rounded-full w-full h-full object-cover" priority />
      </div>
      <p className="text-xl text-slate-400 font-serif italic mb-2">{gender === 'wanita' ? 'Putri dari' : 'Putra dari'}</p>
      <p className="text-sm text-slate-700 font-medium mb-1">Bapak {person.ayah}</p>
      <p className="text-sm text-slate-700 font-medium mb-6">& Ibu {person.ibu}</p>
      <h3 className="text-5xl font-serif text-slate-900 mb-3 italic">{person.namaPanggilan}</h3>
      <p className="text-base text-slate-800 font-medium tracking-wide">{person.namaLengkap}</p>
    </div>
  );

  return (
    <section className="py-24 px-4 bg-white overflow-hidden">
      {/* ... (Kode bagian return ke bawah TETAP SAMA seperti sebelumnya) ... */}
      <div className="max-w-7xl mx-auto">
        <Reveal trigger={trigger} direction="up">
          <h2 className="text-2xl md:text-3xl font-serif italic text-slate-800 uppercase tracking-[0.4em] mb-20 text-center">Mempelai</h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-12">
          <Reveal trigger={trigger} direction="left" delay={0.2}>
            <CardProfil person={mempelaiWanita} gender="wanita" />
          </Reveal>
          <Reveal trigger={trigger} direction="fade" delay={0.4}>
            <div className="text-8xl text-slate-100 italic text-center">&</div>
          </Reveal>
          <Reveal trigger={trigger} direction="right" delay={0.2}>
            <CardProfil person={mempelaiPria} gender="pria" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}