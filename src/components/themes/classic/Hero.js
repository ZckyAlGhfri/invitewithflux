'use client';
import Reveal from '@/components/Reveal';

export default function Hero({ data, imgSampul, colorVariant }) {
  if (!data) return null;

  // ================= KAMUS WARNA (CLASSIC) =================
  const themeStyles = {
    emerald: { textMain: "text-emerald-950", textMuted: "text-emerald-600/70", textAccent: "text-emerald-500", border: "border-emerald-200", ornament: "text-emerald-300" },
    sapphire: { textMain: "text-blue-950", textMuted: "text-blue-600/70", textAccent: "text-blue-500", border: "border-blue-200", ornament: "text-blue-300" },
    ruby: { textMain: "text-rose-950", textMuted: "text-rose-600/70", textAccent: "text-rose-500", border: "border-rose-200", ornament: "text-rose-300" },
    gold: { textMain: "text-amber-950", textMuted: "text-amber-600/70", textAccent: "text-amber-500", border: "border-amber-200", ornament: "text-amber-300" },
    monochrome: { textMain: "text-stone-900", textMuted: "text-stone-500", textAccent: "text-stone-400", border: "border-stone-200", ornament: "text-stone-300" }
  };
  const currentStyle = themeStyles[colorVariant] || themeStyles.monochrome;
  // =========================================================

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col items-center justify-center bg-transparent pt-20 pb-12 overflow-hidden">
      
      {/* Garis Ganda Pembingkai Layar */}
      <div className={`absolute top-4 bottom-4 left-4 right-4 border ${currentStyle.border} z-0 pointer-events-none`}></div>
      <div className={`absolute top-5 bottom-5 left-5 right-5 border ${currentStyle.border} z-0 pointer-events-none`}></div>
      
      {/* Ornamen Bunga */}
      <svg className={`absolute top-8 left-8 w-16 h-16 ${currentStyle.ornament} opacity-60 pointer-events-none`} viewBox="0 0 100 100" fill="currentColor"><path d="M0,0 Q50,0 50,50 Q50,0 100,0 Q50,0 50,-50 Q50,0 0,0 Z" transform="translate(50,50) scale(1.5)"/></svg>
      <svg className={`absolute top-8 right-8 w-16 h-16 ${currentStyle.ornament} opacity-60 pointer-events-none`} viewBox="0 0 100 100" fill="currentColor"><path d="M0,0 Q50,0 50,50 Q50,0 100,0 Q50,0 50,-50 Q50,0 0,0 Z" transform="translate(50,50) scale(1.5) rotate(90)"/></svg>
      <svg className={`absolute bottom-8 left-8 w-16 h-16 ${currentStyle.ornament} opacity-60 pointer-events-none`} viewBox="0 0 100 100" fill="currentColor"><path d="M0,0 Q50,0 50,50 Q50,0 100,0 Q50,0 50,-50 Q50,0 0,0 Z" transform="translate(50,50) scale(1.5) rotate(-90)"/></svg>
      <svg className={`absolute bottom-8 right-8 w-16 h-16 ${currentStyle.ornament} opacity-60 pointer-events-none`} viewBox="0 0 100 100" fill="currentColor"><path d="M0,0 Q50,0 50,50 Q50,0 100,0 Q50,0 50,-50 Q50,0 0,0 Z" transform="translate(50,50) scale(1.5) rotate(180)"/></svg>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full h-full pt-10">
        <Reveal direction="down">
          <p className={`text-[10px] uppercase tracking-[0.4em] mb-6 ${currentStyle.textMuted} font-medium`}>Pernikahan Suci</p>
        </Reveal>
        
        <Reveal delay={0.2}>
          <h2 className={`text-5xl md:text-7xl font-serif ${currentStyle.textMain} mb-8 leading-tight`}>
            {data.nama_wanita} <span className={`italic font-light ${currentStyle.textAccent} mx-1`}>&</span> {data.nama_pria}
          </h2>
        </Reveal>

        <Reveal direction="up" delay={0.4}>
          <div className={`w-56 h-72 md:w-72 md:h-96 p-2 border ${currentStyle.border} rounded-t-[10rem] mb-10 bg-white shadow-xl`}>
            <img src={imgSampul} alt="Mempelai" className="w-full h-full object-cover rounded-t-[10rem]" />
          </div>
        </Reveal>
        
        <Reveal direction="up" delay={0.6}>
          <p className={`text-sm md:text-base font-medium tracking-[0.2em] uppercase ${currentStyle.textMain} border-y ${currentStyle.border} py-3 px-10 mb-8 bg-white/50`}>
            {formatDate(data.tanggal_akad)}
          </p>
        </Reveal>

        {data.quotes && (
          <Reveal delay={0.8}>
            <div className="max-w-lg mx-auto mt-2 px-6 relative">
              <p className={`text-xs md:text-sm ${currentStyle.textMuted} italic font-serif leading-relaxed text-center whitespace-pre-line`}>
                &ldquo;{data.quotes}&rdquo;
              </p>
            </div>
          </Reveal>
        )}

        <Reveal delay={1.2}>
          <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 opacity-60 flex flex-col items-center animate-bounce`}>
            <div className={`w-[1px] h-12 ${currentStyle.border} border-l mb-2`}></div>
            <p className={`text-[8px] uppercase tracking-widest ${currentStyle.textMuted} font-bold`}>Scroll</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
