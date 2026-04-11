'use client';
import Reveal from '@/components/Reveal';

export default function Couple({ data, colorVariant }) {
  if (!data) return null;

  const themeStyles = {
    slate: { accent: "text-slate-400" },
    indigo: { accent: "text-indigo-500" },
    rose: { accent: "text-rose-500" },
    teal: { accent: "text-teal-400" },
    amber: { accent: "text-amber-500" }
  };
  const c = themeStyles[colorVariant] || themeStyles.slate;

  const CardProfil = ({ person, gender }) => (
    <div className={`flex flex-col ${gender === 'wanita' ? 'items-start text-left' : 'items-end text-right'} w-full`}>
      <div className="relative w-full aspect-[4/5] mb-8 overflow-hidden bg-stone-900">
        <img 
          src={person.foto || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800"} 
          alt={person.namaPanggilan} 
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
        />
        <div className="absolute inset-0 border-[16px] border-black/20 pointer-events-none"></div>
      </div>
      <p className={`${c.accent} font-black uppercase tracking-[0.3em] text-[10px] mb-4`}>
        {gender === 'wanita' ? 'The Bride' : 'The Groom'}
      </p>
      <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4 text-white">
        {person.namaPanggilan}
      </h3>
      <div className="space-y-1 opacity-40 uppercase text-[10px] tracking-[0.2em] font-bold text-white">
        <p>{person.namaLengkap}</p>
        <p>Child of {person.ayah} & {person.ibu}</p>
      </div>
    </div>
  );

  return (
    <section id="couple" className="py-32 px-6 bg-black text-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32 items-start">
          <Reveal direction="left">
            <CardProfil 
              gender="wanita"
              person={{
                namaPanggilan: data.nama_wanita,
                namaLengkap: data.nama_lengkap_wanita,
                ayah: data.nama_ayah_wanita,
                ibu: data.nama_ibu_wanita,
                foto: data.foto_wanita
              }} 
            />
          </Reveal>
          
          <Reveal direction="right" delay={0.2}>
            <div className="md:mt-40">
              <CardProfil 
                gender="pria"
                person={{
                  namaPanggilan: data.nama_pria,
                  namaLengkap: data.nama_lengkap_pria,
                  ayah: data.nama_ayah_pria,
                  ibu: data.nama_ibu_pria,
                  foto: data.foto_pria
                }} 
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}