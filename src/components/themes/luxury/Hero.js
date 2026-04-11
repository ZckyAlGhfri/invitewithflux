'use client';
import { motion } from 'framer-motion';
import Reveal from '@/components/Reveal';

export default function Hero({ data, imgSampul, colorVariant }) {
  if (!data) return null;

  // ================= KAMUS WARNA =================
  const themeStyles = {
    gold: {
      primary: "text-amber-400",
      secondary: "text-amber-300",
      quote: "text-amber-500/30"
    },
    silver: {
      primary: "text-slate-400",
      secondary: "text-slate-300",
      quote: "text-slate-500/30"
    },
    'rose-gold': {
      primary: "text-rose-400",
      secondary: "text-rose-300",
      quote: "text-rose-500/30"
    }
  };
  const currentStyle = themeStyles[colorVariant] || themeStyles.gold;
  // ===============================================

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section id="hero" className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-slate-950/60 z-10 pointer-events-none"></div>
      
      <motion.img 
        src={imgSampul} 
        alt="Hero Background" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-70"
        animate={{ scale: [1, 1.15, 1] }} 
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full h-full pt-20 pb-10">
        <Reveal direction="down" delay={0.5}>
          <p className={`text-[10px] md:text-xs uppercase tracking-[0.6em] mb-6 ${currentStyle.secondary} font-bold drop-shadow-lg`}>Menyambut Hari Bahagia</p>
        </Reveal>
        
        <Reveal delay={0.7}>
          <h2 className="text-6xl md:text-9xl font-serif text-white mb-6 drop-shadow-[0_4px_40px_rgba(0,0,0,0.8)]">
            {data.nama_wanita} <span className={`text-4xl md:text-7xl mx-2 font-light ${currentStyle.primary}`}>&</span> {data.nama_pria}
          </h2>
        </Reveal>
        
        <Reveal direction="up" delay={0.9}>
          <p className="text-lg md:text-2xl font-light tracking-widest text-white/90 drop-shadow-md bg-slate-900/30 px-8 py-3 rounded-full backdrop-blur-sm border border-white/10 mb-12">
            {formatDate(data.tanggal_akad)}
          </p>
        </Reveal>

        {data.quotes && (
          <Reveal delay={1.1} direction="up">
            <div className="max-w-xl mx-auto mt-4 mb-8 relative">
              <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-5xl ${currentStyle.quote} font-serif opacity-50`}>"</span>
              <p className="text-sm md:text-base text-slate-300 italic font-serif leading-relaxed text-center drop-shadow-md px-6 whitespace-pre-line">
                {data.quotes}
              </p>
            </div>
          </Reveal>
        )}
        
        <Reveal delay={1.4}>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-70 flex flex-col items-center">
            <p className="text-[10px] uppercase tracking-widest text-white/60 mb-2 font-bold">Geser ke Bawah</p>
            <svg className={`w-5 h-5 ${currentStyle.primary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
          </div>
        </Reveal>
      </div>
    </section>
  );
}