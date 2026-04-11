'use client';
import Reveal from '@/components/Reveal';

export default function Gallery({ data, colorVariant }) {
  const hasPhotos = data?.galleries && data.galleries.length > 0;
  const videoUrl = data?.video_prewedding;
  const hasVideo = data?.tier === 'exclusive' && videoUrl;

  if (!data || data.tier === 'basic' || (!hasPhotos && !hasVideo)) return null;

  const getYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  const videoId = getYouTubeID(videoUrl);

  const themeStyles = {
    emerald: { main: "text-emerald-900", accent: "text-emerald-400", border: "border-emerald-200", via: "via-emerald-300" },
    sapphire: { main: "text-blue-900", accent: "text-blue-400", border: "border-blue-200", via: "via-blue-300" },
    ruby: { main: "text-rose-900", accent: "text-rose-400", border: "border-rose-200", via: "via-rose-300" },
    gold: { main: "text-amber-900", accent: "text-amber-400", border: "border-amber-200", via: "via-amber-300" },
    monochrome: { main: "text-stone-900", accent: "text-stone-400", border: "border-stone-200", via: "via-stone-300" }
  };
  const c = themeStyles[colorVariant] || themeStyles.monochrome;

  const sortedGalleries = hasPhotos ? [...data.galleries].sort((a, b) => a.position - b.position) : [];
  const total = sortedGalleries.length;

  const getGridClass = (index) => {
    if (total === 1) return "col-span-2 row-span-2"; 
    if (total === 2) return "col-span-1 row-span-2"; 
    if (total >= 3 && index === 0) return "md:col-span-2 md:row-span-2 col-span-2";
    return "col-span-1 row-span-1";
  };

  return (
    <section id="gallery" className="py-24 px-6 bg-transparent relative">
      <div className="max-w-6xl mx-auto select-none">
        <Reveal direction="down">
          <div className="text-center mb-16">
            <span className={`text-[10px] font-bold tracking-[0.4em] uppercase ${c.accent} mb-4 block`}>Galeri Kenangan</span>
            <h2 className={`text-4xl md:text-5xl font-serif ${c.main} italic`}>Momen Bahagia</h2>
          </div>
        </Reveal>

        {/* CINE-VIDEO CLASSIC STYLE (Tegas & Berbingkai) */}
        {hasVideo && videoId && (
          <Reveal direction="up">
            <div className={`w-full max-w-4xl mx-auto mb-16 bg-white p-2 border ${c.border} shadow-lg relative`}>
               {/* Ornamen Sudut */}
               <div className={`absolute top-1 left-1 w-4 h-4 border-t border-l ${c.border} opacity-50`}></div>
               <div className={`absolute bottom-1 right-1 w-4 h-4 border-b border-r ${c.border} opacity-50`}></div>
               
               <div className="relative w-full aspect-video overflow-hidden bg-black border border-stone-100">
                 <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                    title="Pre-Wedding Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                 ></iframe>
               </div>
            </div>
          </Reveal>
        )}

        {hasPhotos && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[200px]">
            {sortedGalleries.map((item, idx) => (
              <Reveal key={item.id || idx} delay={idx * 0.1} direction="up" className={getGridClass(idx)}>
                <div className={`w-full h-full bg-white p-2 border ${c.border} shadow-sm hover:shadow-xl transition-all duration-700 group relative overflow-hidden pointer-events-none`}>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                  <img src={item.image_url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 pointer-events-none select-none" draggable="false" />
                  <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-white/50 z-20"></div>
                  <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-white/50 z-20"></div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
        
        <Reveal delay={0.5}>
          <div className="mt-12 flex justify-center">
             <div className={`w-24 h-px bg-gradient-to-r from-transparent ${c.via} to-transparent`}></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}