'use client';
import Reveal from '@/components/Reveal';

export default function Gallery({ data }) {
  if (!data || data.tier === 'basic' || !data.galleries || data.galleries.length === 0) return null;
  
  const sortedGalleries = [...data.galleries].sort((a, b) => a.position - b.position);
  const total = sortedGalleries.length;

  // LOGIKA DINAMIS: Menentukan rentang kolom berdasarkan jumlah foto
  // Kita ingin foto pertama jadi "Hero" (besar) jika jumlah fotonya ganjil atau > 2
  const getGridClass = (index) => {
    if (total === 1) return "col-span-2 row-span-2"; // 1 foto: Full besar
    if (total === 2) return "col-span-1 row-span-2"; // 2 foto: Berdampingan tinggi
    
    // Jika 3 foto: Foto pertama besar di kiri (span 2 row), 2 sisanya di kanan
    if (total === 3 && index === 0) return "md:col-span-2 md:row-span-2 col-span-2";
    
    // Jika lebih dari 3: Foto pertama tetap dominan untuk estetika klasik
    if (total > 3 && index === 0) return "md:col-span-2 md:row-span-2 col-span-2";
    
    // Default: Kotak biasa
    return "col-span-1 row-span-1";
  };

  return (
    <section id="gallery" className="py-24 px-6 bg-transparent relative">
      <div className="max-w-6xl mx-auto">
        <Reveal direction="down">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-stone-400 mb-4 block">Galeri Kenangan</span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 italic">Momen Bahagia</h2>
          </div>
        </Reveal>

        {/* GRID DINAMIS DENGAN AUTO-ROWS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[200px]">
          {sortedGalleries.map((item, idx) => (
            <Reveal 
              key={item.id || idx} 
              delay={idx * 0.1} 
              direction="up" 
              className={getGridClass(idx)}
            >
              <div className="w-full h-full bg-white p-2 border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-700 group relative overflow-hidden">
                {/* Overlay Putih Transparan Saat Hover */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                
                <img 
                  src={item.image_url} 
                  alt={`Gallery ${idx + 1}`} 
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" 
                />
                
                {/* Ornamen Sudut Kecil di dalam Frame Foto */}
                <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-white/50 z-20"></div>
                <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-white/50 z-20"></div>
              </div>
            </Reveal>
          ))}
        </div>
        
        <Reveal delay={0.5}>
          <div className="mt-12 flex justify-center">
             <div className="w-24 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent"></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}