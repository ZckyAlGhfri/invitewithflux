'use client';
import Reveal from '@/components/Reveal';

export default function Hero({ data, imgSampul }) {
  if (!data) return null;

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center bg-transparent pt-20 pb-12 overflow-hidden">
      
      {/* Garis Ganda Pembingkai Layar (Khas Keraton/Klasik) */}
      <div className="absolute top-4 bottom-4 left-4 right-4 border border-stone-200 z-0 pointer-events-none"></div>
      <div className="absolute top-5 bottom-5 left-5 right-5 border border-stone-200 z-0 pointer-events-none"></div>
      
      {/* Ornamen Bunga Sudut Atas Kiri & Kanan */}
      <svg className="absolute top-8 left-8 w-16 h-16 text-stone-300 opacity-60 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
        <path d="M0,0 Q50,0 50,50 Q50,0 100,0 Q50,0 50,-50 Q50,0 0,0 Z" transform="translate(50,50) scale(1.5)"/>
      </svg>
      <svg className="absolute top-8 right-8 w-16 h-16 text-stone-300 opacity-60 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
        <path d="M0,0 Q50,0 50,50 Q50,0 100,0 Q50,0 50,-50 Q50,0 0,0 Z" transform="translate(50,50) scale(1.5) rotate(90)"/>
      </svg>
      
      {/* Ornamen Bunga Sudut Bawah Kiri & Kanan */}
      <svg className="absolute bottom-8 left-8 w-16 h-16 text-stone-300 opacity-60 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
        <path d="M0,0 Q50,0 50,50 Q50,0 100,0 Q50,0 50,-50 Q50,0 0,0 Z" transform="translate(50,50) scale(1.5) rotate(-90)"/>
      </svg>
      <svg className="absolute bottom-8 right-8 w-16 h-16 text-stone-300 opacity-60 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
        <path d="M0,0 Q50,0 50,50 Q50,0 100,0 Q50,0 50,-50 Q50,0 0,0 Z" transform="translate(50,50) scale(1.5) rotate(180)"/>
      </svg>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full h-full pt-10">
        
        <Reveal direction="down">
          <p className="text-[10px] uppercase tracking-[0.4em] mb-6 text-stone-500 font-medium">Pernikahan Suci</p>
        </Reveal>
        
        <Reveal delay={0.2}>
          <h2 className="text-5xl md:text-7xl font-serif text-stone-900 mb-8 leading-tight">
            {data.nama_wanita} <span className="italic font-light text-stone-400 mx-1">&</span> {data.nama_pria}
          </h2>
        </Reveal>

        {/* Foto Pasangan Dibingkai Arch */}
        <Reveal direction="up" delay={0.4}>
          <div className="w-56 h-72 md:w-72 md:h-96 p-2 border border-stone-300 rounded-t-[10rem] mb-10 bg-white shadow-xl">
            <img src={imgSampul} alt="Mempelai" className="w-full h-full object-cover rounded-t-[10rem]" />
          </div>
        </Reveal>
        
        <Reveal direction="up" delay={0.6}>
          <p className="text-sm md:text-base font-medium tracking-[0.2em] uppercase text-stone-800 border-y border-stone-300 py-3 px-10 mb-8 bg-white/50">
            {formatDate(data.tanggal_akad)}
          </p>
        </Reveal>

        {data.quotes && (
          <Reveal delay={0.8}>
            <div className="max-w-lg mx-auto mt-2 px-6 relative">
              <p className="text-xs md:text-sm text-stone-600 italic font-serif leading-relaxed text-center whitespace-pre-line">
                "{data.quotes}"
              </p>
            </div>
          </Reveal>
        )}

        {/* Indikator Scroll Halus */}
        <Reveal delay={1.2}>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-60 flex flex-col items-center animate-bounce">
            <div className="w-[1px] h-12 bg-stone-400 mb-2"></div>
            <p className="text-[8px] uppercase tracking-widest text-stone-500 font-bold">Scroll</p>
          </div>
        </Reveal>
        
      </div>
    </section>
  );
}