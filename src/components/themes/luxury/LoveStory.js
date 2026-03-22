'use client';
import Reveal from '@/components/Reveal';

export default function LoveStory({ data }) {
  // Jika tidak ada data atau string kosong, jangan render section ini sama sekali
  if (!data || !data.love_story) return null;

  // Parsing data JSONB dengan pelindung anti-error
  let parsedStory = [];
  try {
    parsedStory = typeof data.love_story === 'string' ? JSON.parse(data.love_story) : data.love_story;
  } catch (e) {
    parsedStory = [];
  }

  // Jika array kosong (klien belum mengisi cerita), sembunyikan section
  if (parsedStory.length === 0) return null;

  return (
    <section id="lovestory" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Ornamen Latar Belakang */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-100 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Judul Section */}
        <div className="text-center mb-24">
          <Reveal direction="down">
            <span className="text-xs font-bold tracking-[0.4em] uppercase text-amber-600 mb-4 block">Perjalanan Cinta</span>
            <h2 className="text-4xl md:text-5xl font-serif italic text-slate-900 drop-shadow-sm">Kisah Kami</h2>
          </Reveal>
        </div>

        {/* WADAH TIMELINE: ZIGZAG ARSITEKTUR KELAS DUNIA */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-y-16 pl-12 relative before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-amber-300 md:grid-cols-[1fr,auto,1fr] md:pl-0 md:gap-x-16 md:before:left-1/2 md:before:-translate-x-1/2 md:before:translate-x-[-1px]">
          {parsedStory.map((story, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-y-6 md:gap-y-0 md:gap-x-16 group relative">
                
                {/* 1. Titik Tengah Timeline (Dot Cincin) */}
                <div className="w-10 h-10 flex items-center justify-center shrink-0 order-1 md:order-none md:col-start-2 md:col-end-3 relative z-10">
                  <Reveal direction="down">
                    <div className="w-10 h-10 rounded-full border-4 border-white bg-amber-100 text-amber-600 shadow-md flex items-center justify-center text-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-amber-900/10">
                      💍
                    </div>
                  </Reveal>
                </div>

                {/* 2. Kotak Konten Cerita (Zigzag Dinamis) */}
                <Reveal 
                  direction={isEven ? "left" : "right"} 
                  className={`flex flex-col gap-6 p-6 md:p-8 bg-white border border-slate-100 shadow-xl transition-all duration-500 order-2 md:order-none rounded-3xl ${isEven ? 'md:col-start-1 md:col-end-2 md:text-right md:rounded-r-none md:rounded-l-[2rem]' : 'md:col-start-3 md:col-end-4 md:text-left md:rounded-l-none md:rounded-r-[2rem]'}`}>
                  
                  {/* Header Cerita dengan Perataan Dinamis */}
                  <div className={`flex flex-col sm:flex-row sm:items-center gap-3 mb-4 ${isEven ? 'md:justify-end' : ''}`}>
                    <span className="px-4 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-widest rounded-full w-fit">
                      {story.year}
                    </span>
                    <h4 className="text-lg md:text-xl font-bold text-slate-800 font-serif italic drop-shadow-sm">{story.title}</h4>
                  </div>
                  
                  {/* Teks Deskripsi */}
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-sans">
                    {story.text}
                  </p>
                </Reveal>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}