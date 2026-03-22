'use client';
import Reveal from '@/components/Reveal';

export default function Gallery({ data }) {
  // Cek jika tidak ada data, tier basic, atau array galleries kosong
  if (!data || data.tier === 'basic' || !data.galleries || data.galleries.length === 0) return null;

  // Urutkan foto berdasarkan kolom position agar tampilannya konsisten
  const sortedGalleries = [...data.galleries].sort((a, b) => a.position - b.position);

  return (
    <section id="gallery" className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center mb-20">
          <Reveal direction="down">
            <span className="text-xs font-bold tracking-[0.4em] uppercase text-amber-600 mb-4 block">Visualisasi Kebahagiaan</span>
            <h2 className="text-5xl md:text-6xl font-serif italic text-slate-900">Galeri Kami</h2>
          </Reveal>
        </div>
        
        {/* GRID FLEKSIBEL */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
          {sortedGalleries.map((item, idx) => {
            const isFirst = idx === 0;
            return (
              <Reveal 
                key={item.id || idx} 
                delay={idx * 0.15} 
                direction={idx % 2 === 0 ? "up" : "down"} 
                className={`${isFirst ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}`}
              >
                <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-lg group cursor-pointer border-[8px] border-slate-50 relative">
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <img src={item.image_url} alt={`Gallery ${idx+1}`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}