'use client';
import Reveal from '@/components/Reveal';

export default function LoveStory({ data, colorVariant }) {
  if (!data || !data.love_story) return null;

  // ================= KAMUS WARNA (LIGHT MODE TIMELINE) =================
  const themeStyles = {
    gold: {
      blurBg1: "bg-amber-100", blurBg2: "bg-pink-100",
      textAccent: "text-amber-600",
      lineVertical: "before:bg-amber-300",
      dotBg: "bg-amber-100 text-amber-600 shadow-amber-900/10",
      badgeBg: "bg-amber-50 border-amber-200 text-amber-700"
    },
    silver: {
      blurBg1: "bg-slate-200", blurBg2: "bg-blue-50",
      textAccent: "text-slate-500",
      lineVertical: "before:bg-slate-300",
      dotBg: "bg-slate-100 text-slate-600 shadow-slate-900/10",
      badgeBg: "bg-slate-100 border-slate-200 text-slate-700"
    },
    'rose-gold': {
      blurBg1: "bg-rose-100", blurBg2: "bg-orange-50",
      textAccent: "text-rose-600",
      lineVertical: "before:bg-rose-300",
      dotBg: "bg-rose-100 text-rose-600 shadow-rose-900/10",
      badgeBg: "bg-rose-50 border-rose-200 text-rose-700"
    }
  };
  const currentStyle = themeStyles[colorVariant] || themeStyles.gold;
  // ===================================================================

  let parsedStory = [];
  try {
    parsedStory = typeof data.love_story === 'string' ? JSON.parse(data.love_story) : data.love_story;
  } catch (e) {
    parsedStory = [];
  }

  if (parsedStory.length === 0) return null;

  return (
    <section id="lovestory" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-64 h-64 ${currentStyle.blurBg1} rounded-full blur-[100px] opacity-50 pointer-events-none`}></div>
      <div className={`absolute bottom-0 left-0 w-64 h-64 ${currentStyle.blurBg2} rounded-full blur-[100px] opacity-50 pointer-events-none`}></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <Reveal direction="down">
            <span className={`text-xs font-bold tracking-[0.4em] uppercase ${currentStyle.textAccent} mb-4 block`}>Perjalanan Cinta</span>
            <h2 className="text-4xl md:text-5xl font-serif italic text-slate-900 drop-shadow-sm">Kisah Kami</h2>
          </Reveal>
        </div>

        <div className={`max-w-5xl mx-auto grid grid-cols-1 gap-y-16 pl-12 relative before:absolute before:inset-y-0 before:left-0 before:w-px ${currentStyle.lineVertical} md:grid-cols-[1fr,auto,1fr] md:pl-0 md:gap-x-16 md:before:left-1/2 md:before:-translate-x-1/2 md:before:translate-x-[-1px]`}>
          {parsedStory.map((story, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-y-6 md:gap-y-0 md:gap-x-16 group relative">
                
                <div className="w-10 h-10 flex items-center justify-center shrink-0 order-1 md:order-none md:col-start-2 md:col-end-3 relative z-10">
                  <Reveal direction="down">
                    <div className={`w-10 h-10 rounded-full border-4 border-white flex items-center justify-center text-sm transition-all duration-500 group-hover:scale-110 shadow-md ${currentStyle.dotBg}`}>
                      💍
                    </div>
                  </Reveal>
                </div>

                <Reveal 
                  direction={isEven ? "left" : "right"} 
                  className={`flex flex-col gap-6 p-6 md:p-8 bg-white border border-slate-100 shadow-xl transition-all duration-500 order-2 md:order-none rounded-3xl ${isEven ? 'md:col-start-1 md:col-end-2 md:text-right md:rounded-r-none md:rounded-l-[2rem]' : 'md:col-start-3 md:col-end-4 md:text-left md:rounded-l-none md:rounded-r-[2rem]'}`}>
                  
                  <div className={`flex flex-col sm:flex-row sm:items-center gap-3 mb-4 ${isEven ? 'md:justify-end' : ''}`}>
                    <span className={`px-4 py-1.5 border text-[10px] font-bold uppercase tracking-widest rounded-full w-fit ${currentStyle.badgeBg}`}>
                      {story.year}
                    </span>
                    <h4 className="text-lg md:text-xl font-bold text-slate-800 font-serif italic drop-shadow-sm">{story.title}</h4>
                  </div>
                  
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