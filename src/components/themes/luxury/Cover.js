'use client';
import { motion } from 'framer-motion';

export default function Cover({ data, isOpened, handleOpen, tamu, imgSampul, colorVariant }) {
  if (!data) return null;

  const isSpecificGuest = tamu !== 'Tamu Undangan';

  // =========================================================
  // 1. KAMUS WARNA (THE COLOR DICTIONARY)
  // Di sinilah letak rahasia 1 Tema bisa jadi 50 Varian
  // =========================================================
  const themeStyles = {
    gold: {
      subtext: "text-amber-300",
      accent: "text-amber-400",
      divider: "bg-amber-400/50",
      button: "bg-amber-600 shadow-[0_10px_40px_rgba(217,119,6,0.5)]"
    },
    silver: {
      subtext: "text-slate-300",
      accent: "text-slate-400",
      divider: "bg-slate-400/50",
      button: "bg-slate-600 shadow-[0_10px_40px_rgba(71,85,105,0.5)]"
    },
    'rose-gold': {
      subtext: "text-rose-300",
      accent: "text-rose-400",
      divider: "bg-rose-400/50",
      button: "bg-rose-600 shadow-[0_10px_40px_rgba(225,29,72,0.5)]"
    }
  };

  // 2. Ambil gaya berdasarkan prop colorVariant (Default ke 'gold')
  const currentStyle = themeStyles[colorVariant] || themeStyles.gold;

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-[3500ms] ease-in-out ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-slate-950/60 z-10"></div>
      <img src={imgSampul} alt="Cover" className="absolute inset-0 w-full h-full object-cover scale-105 blur-sm" />
      
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 w-full max-w-lg">
        {/* Suntikkan warna dari currentStyle */}
        <p className={`${currentStyle.subtext} tracking-[0.4em] text-xs font-bold uppercase mb-4 drop-shadow-md`}>The Wedding Of</p>
        <h1 className="text-6xl md:text-8xl font-serif text-white mb-12 drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
          {data.nama_wanita} <span className={`${currentStyle.accent} font-light mx-2`}>&</span> {data.nama_pria}
        </h1>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] w-full mb-10 shadow-2xl">
          <p className="text-white/80 text-xs mb-4 font-medium uppercase tracking-widest">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
          <p className="text-3xl md:text-4xl font-serif text-white font-bold mb-4 drop-shadow-md capitalize leading-snug">{tamu}</p>
          <div className={`w-12 h-px ${currentStyle.divider} mx-auto my-4`}></div>
          
          {isSpecificGuest ? (
            <p className="text-[10px] text-white/50 italic tracking-wider">Mohon maaf bila ada kesalahan penulisan nama/gelar</p>
          ) : (
            <p className="text-[10px] text-white/50 italic tracking-wider">Kami menantikan kehadiran Anda</p>
          )}
        </div>

        <button 
          onClick={handleOpen}
          // Suntikkan warna tombol dari currentStyle
          className={`group px-10 py-5 ${currentStyle.button} text-white font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white hover:text-slate-900 transition-all duration-500 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 animate-pulse`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/></svg>
          Buka Undangan
        </button>
      </div>
    </div>
  );
}