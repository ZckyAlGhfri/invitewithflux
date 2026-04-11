'use client';
import Reveal from '@/components/Reveal';

export default function Gallery({ data, colorVariant }) {
  const hasPhotos = data?.galleries && data.galleries.length > 0;
  const videoUrl = data?.video_prewedding;
  const hasVideo = data?.tier === 'exclusive' && videoUrl;

  if (!data || data.tier === 'basic' || (!hasPhotos && !hasVideo)) return null;

  // Helper untuk mengambil ID Video dari berbagai format Link YouTube
  const getYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeID(videoUrl);

  const themeStyles = {
    gold: { textAccent: "text-amber-600", videoBorder: "border-amber-200", shadow: "shadow-amber-900/10" },
    silver: { textAccent: "text-slate-500", videoBorder: "border-slate-200", shadow: "shadow-slate-900/10" },
    'rose-gold': { textAccent: "text-rose-600", videoBorder: "border-rose-200", shadow: "shadow-rose-900/10" }
  };
  const currentStyle = themeStyles[colorVariant] || themeStyles.gold;

  const sortedGalleries = hasPhotos ? [...data.galleries].sort((a, b) => a.position - b.position) : [];

  return (
    <section id="gallery" className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto select-none">
        <div className="flex flex-col items-center text-center mb-20">
          <Reveal direction="down">
            <span className={`text-xs font-bold tracking-[0.4em] uppercase ${currentStyle.textAccent} mb-4 block`}>Visualisasi Kebahagiaan</span>
            <h2 className="text-5xl md:text-6xl font-serif italic text-slate-900">Galeri Kami</h2>
          </Reveal>
        </div>

        {/* 1. CINEMATIC VIDEO PRE-WEDDING (YouTube Embed) */}
        {hasVideo && videoId && (
          <Reveal direction="up">
            <div className={`w-full max-w-4xl mx-auto mb-16 bg-slate-50 p-2 md:p-4 rounded-[2rem] border ${currentStyle.videoBorder} shadow-xl ${currentStyle.shadow}`}>
               <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
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
        
        {/* 2. GRID FOTO GALERI */}
        {hasPhotos && (
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
                  <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-lg group cursor-pointer border-[8px] border-slate-50 relative pointer-events-none">
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img 
                       src={item.image_url} 
                       alt={`Gallery ${idx+1}`} 
                       className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 pointer-events-none" 
                       draggable="false"
                    />
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}