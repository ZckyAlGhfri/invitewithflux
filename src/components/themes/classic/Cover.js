'use client';
import { motion } from 'framer-motion';

export default function Cover({ data, isOpened, handleOpen, tamu, imgSampul, colorVariant }) {
  if (!data) return null;

  const isSpecificGuest = tamu !== 'Tamu Undangan';

  // ================= KAMUS WARNA (CLASSIC) =================
  const themeStyles = {
    emerald: { bg: "bg-emerald-50", textMain: "text-emerald-950", textMuted: "text-emerald-600/70", accent: "text-emerald-500", border: "border-emerald-300/50", btn: "bg-emerald-900 hover:bg-emerald-800 text-white" },
    sapphire: { bg: "bg-blue-50", textMain: "text-blue-950", textMuted: "text-blue-600/70", accent: "text-blue-500", border: "border-blue-300/50", btn: "bg-blue-900 hover:bg-blue-800 text-white" },
    ruby: { bg: "bg-rose-50", textMain: "text-rose-950", textMuted: "text-rose-600/70", accent: "text-rose-500", border: "border-rose-300/50", btn: "bg-rose-900 hover:bg-rose-800 text-white" },
    gold: { bg: "bg-amber-50", textMain: "text-amber-950", textMuted: "text-amber-600/70", accent: "text-amber-500", border: "border-amber-300/50", btn: "bg-amber-900 hover:bg-amber-800 text-white" },
    monochrome: { bg: "bg-stone-50", textMain: "text-stone-900", textMuted: "text-stone-500", accent: "text-stone-400", border: "border-stone-300", btn: "bg-stone-900 hover:bg-stone-700 text-white" }
  };
  const currentStyle = themeStyles[colorVariant] || themeStyles.monochrome; // Default ke monochrome (mirip desain asli)
  // =========================================================

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-[2500ms] ease-in-out ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${currentStyle.bg}`}>
      
      {/* Latar Belakang */}
      <div className="absolute inset-0 z-0">
         <img src={imgSampul} alt="Cover" className="w-full h-full object-cover opacity-20 blur-md grayscale-[30%]" />
         <div className={`absolute inset-0 ${currentStyle.bg} opacity-80 backdrop-blur-sm`}></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full max-w-md">
        
        {/* Bingkai Klasik */}
        <div className={`border ${currentStyle.border} p-2 w-full rounded-t-full shadow-2xl bg-white/40 backdrop-blur-md`}>
          <div className={`border ${currentStyle.border} p-10 py-16 w-full rounded-t-full flex flex-col items-center bg-white/60`}>
            <p className={`${currentStyle.textMuted} tracking-[0.3em] text-[10px] font-bold uppercase mb-6`}>The Wedding Of</p>
            
            <h1 className={`text-5xl md:text-6xl font-serif ${currentStyle.textMain} mb-8 leading-tight`}>
              {data.nama_wanita} <br/>
              <span className={`text-3xl italic ${currentStyle.accent} font-light`}>&</span><br/> 
              {data.nama_pria}
            </h1>
            
            <div className={`w-16 h-px ${currentStyle.border} bg-transparent border-t my-6`}></div>
            
            <p className={`${currentStyle.textMuted} text-[10px] mb-3 uppercase tracking-widest`}>Kepada Yth:</p>
            <p className={`text-2xl font-serif ${currentStyle.textMain} font-bold mb-2 capitalize`}>{tamu}</p>
            
            <p className={`text-[10px] ${currentStyle.textMuted} italic`}>
              {isSpecificGuest ? 'Mohon maaf bila ada kesalahan penulisan nama/gelar' : 'Kami menantikan kehadiran Anda'}
            </p>
          </div>
        </div>

        {/* Tombol Klasik */}
        <button 
          onClick={handleOpen}
          className={`mt-10 px-10 py-4 ${currentStyle.btn} font-medium uppercase tracking-[0.2em] text-[10px] transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl`}
        >
          Buka Undangan
        </button>
      </div>
    </div>
  );
}