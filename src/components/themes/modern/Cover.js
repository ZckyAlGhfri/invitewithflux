'use client';
import { motion } from 'framer-motion';

export default function Cover({ data, isOpened, handleOpen, tamu, imgSampul, colorVariant }) {
  if (!data) return null;

  // ================= KAMUS WARNA (MODERN) =================
  const themeStyles = {
    slate: { accent: "text-slate-400", bgHover: "hover:bg-slate-400", border: "border-slate-400", bgLine: "bg-slate-400" },
    indigo: { accent: "text-indigo-500", bgHover: "hover:bg-indigo-500", border: "border-indigo-500", bgLine: "bg-indigo-500" },
    rose: { accent: "text-rose-500", bgHover: "hover:bg-rose-500", border: "border-rose-500", bgLine: "bg-rose-500" },
    teal: { accent: "text-teal-400", bgHover: "hover:bg-teal-400", border: "border-teal-400", bgLine: "bg-teal-400" },
    amber: { accent: "text-amber-500", bgHover: "hover:bg-amber-500", border: "border-amber-500", bgLine: "bg-amber-500" }
  };
  const c = themeStyles[colorVariant] || themeStyles.slate; // Slate as default minimal
  // ========================================================

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-all duration-[1500ms] ${isOpened ? 'translate-y-[-100%]' : 'translate-y-0'}`}>
      
      <div className="absolute inset-0 opacity-40">
        <img src={imgSampul} alt="Background" className="w-full h-full object-cover grayscale" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-12 border-2 border-white/20 p-4"
        >
          <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 border border-white/30">
            <p className="text-[10px] tracking-[0.5em] uppercase text-white/60 mb-6 font-bold">The Wedding Of</p>
            <h1 className="text-6xl md:text-8xl font-sans font-black text-white uppercase tracking-tighter leading-none mb-8">
              {data.nama_wanita} <br/>
              <span className={`${c.accent}`}>&</span> <br/>
              {data.nama_pria}
            </h1>
            
            <div className={`h-0.5 w-12 ${c.bgLine} mx-auto mb-8`}></div>
            
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Special Invite For:</p>
            <p className="text-2xl font-bold text-white tracking-tight">{tamu}</p>
          </div>
        </motion.div>

        <button 
          onClick={handleOpen}
          className={`px-12 py-5 bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] ${c.bgHover} hover:text-white transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]`}
        >
          Buka Undangan
        </button>
      </div>
    </div>
  );
}