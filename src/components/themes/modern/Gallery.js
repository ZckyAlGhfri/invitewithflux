'use client';
import Reveal from '@/components/Reveal';

export default function Gallery({ data }) {
  if (!data || data.tier === 'basic' || !data.galleries || data.galleries.length === 0) return null;
  const sortedGalleries = [...data.galleries].sort((a, b) => a.position - b.position);

  return (
    <section id="gallery" className="bg-black py-20">
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[250px] md:auto-rows-[400px]">
        {sortedGalleries.map((item, idx) => (
          <Reveal key={idx} className={`${idx === 0 ? 'col-span-2 row-span-2' : ''} overflow-hidden group relative`}>
             <img 
              src={item.image_url} 
              alt="Gallery" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
            />
            <div className="absolute inset-0 bg-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}