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
    slate: { overlay: "bg-slate-500/20", border: "border-slate-500" },
    indigo: { overlay: "bg-indigo-500/20", border: "border-indigo-500" },
    rose: { overlay: "bg-rose-500/20", border: "border-rose-500" },
    teal: { overlay: "bg-teal-500/20", border: "border-teal-500" },
    amber: { overlay: "bg-amber-500/20", border: "border-amber-500" }
  };
  const c = themeStyles[colorVariant] || themeStyles.slate;

  const sortedGalleries = hasPhotos ? [...data.galleries].sort((a, b) => a.position - b.position) : [];

  return (
    <section id="gallery" className="bg-black py-32 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* VIDEO YOUTUBE MODERN STYLE */}
        {hasVideo && videoId && (
          <Reveal direction="up">
            <div className="mb-20">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-8 text-center">Cinematic</h2>
              <div className={`w-full max-w-4xl mx-auto p-2 border border-white/10 bg-stone-900 shadow-2xl relative group`}>
                {/* Aksen Garis Modern */}
                <div className={`absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 ${c.border} z-10`}></div>
                <div className={`absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 ${c.border} z-10`}></div>
                
                <div className="relative w-full aspect-video bg-black overflow-hidden pointer-events-auto">
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
            </div>
          </Reveal>
        )}

        {/* FOTO GALERI */}
        {hasPhotos && (
          <>
            <Reveal direction="down">
               <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-8 text-center">Moments</h2>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[250px] md:auto-rows-[400px] gap-2">
              {sortedGalleries.map((item, idx) => (
                <Reveal key={idx} className={`${idx === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'} overflow-hidden group relative pointer-events-none`}>
                  <img 
                    src={item.image_url} 
                    alt="Gallery" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 pointer-events-none select-none" 
                    draggable="false"
                  />
                  <div className={`absolute inset-0 ${c.overlay} opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none`}></div>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}