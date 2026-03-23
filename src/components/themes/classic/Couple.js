'use client';
import Reveal from '@/components/Reveal';

export default function Couple({ data }) {
  if (!data) return null;

  const svgWanita = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23f5f5f4"><rect width="100" height="100" fill="%23e7e5e4"/><circle cx="50" cy="40" r="15" fill="%23a8a29e"/><path d="M20 100 c0-20 15-35 30-35 s30 15 30 35 z" fill="%23a8a29e"/></svg>`;
  const svgPria = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23f5f5f4"><rect width="100" height="100" fill="%23e7e5e4"/><circle cx="50" cy="40" r="15" fill="%23a8a29e"/><path d="M25 100 c0-15 10-30 25-30 s25 15 25 30 z" fill="%23a8a29e"/></svg>`;

  const mempelaiWanita = {
    namaPanggilan: data.nama_wanita || "Wanita", namaLengkap: data.nama_lengkap_wanita || "Nama Lengkap Wanita", 
    ayah: data.nama_ayah_wanita || "Nama Ayah", ibu: data.nama_ibu_wanita || "Nama Ibu", foto: data.foto_wanita || svgWanita,
  };
  const mempelaiPria = {
    namaPanggilan: data.nama_pria || "Pria", namaLengkap: data.nama_lengkap_pria || "Nama Lengkap Pria",
    ayah: data.nama_ayah_pria || "Nama Ayah", ibu: data.nama_ibu_pria || "Nama Ibu", foto: data.foto_pria || svgPria,
  };

  const CardProfil = ({ person, gender }) => (
    <div className="flex flex-col items-center px-4 py-8 bg-transparent">
      <div className="relative w-48 h-64 mb-8 p-1.5 border border-stone-300 rounded-t-[10rem]">
        <img src={person.foto} alt={person.namaPanggilan} className="w-full h-full object-cover rounded-t-[10rem] grayscale-[20%]" />
      </div>
      <p className="text-sm text-stone-500 font-serif italic mb-2">{gender === 'wanita' ? 'Putri dari' : 'Putra dari'}</p>
      <p className="text-xs text-stone-600 font-medium mb-1 uppercase tracking-widest">Bapak {person.ayah}</p>
      <p className="text-xs text-stone-600 font-medium mb-6 uppercase tracking-widest">& Ibu {person.ibu}</p>
      <h3 className="text-4xl font-serif text-stone-900 mb-3">{person.namaPanggilan}</h3>
      <p className="text-xs text-stone-500 font-medium tracking-widest uppercase">{person.namaLengkap}</p>
    </div>
  );

  return (
    <section id="couple" className="py-24 px-4 bg-transparent overflow-hidden relative border-y border-stone-200">
      <div className="absolute top-4 left-4 right-4 bottom-4 border border-stone-100 pointer-events-none"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        <Reveal direction="up">
          <h2 className="text-xl md:text-2xl font-serif text-stone-800 uppercase tracking-[0.4em] mb-16 text-center">Mempelai</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-8">
          <Reveal direction="left" delay={0.2}><CardProfil person={mempelaiWanita} gender="wanita" /></Reveal>
          <Reveal direction="fade" delay={0.4}><div className="text-5xl text-stone-300 font-light text-center font-serif italic">&</div></Reveal>
          <Reveal direction="right" delay={0.2}><CardProfil person={mempelaiPria} gender="pria" /></Reveal>
        </div>
      </div>
    </section>
  );
}