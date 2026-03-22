'use client';
import { motion } from 'framer-motion';

export default function Cover({ data, isOpened, handleOpen, tamu, imgSampul }) {
  if (!data) return null;

  // Cek apakah undangan ini ditujukan ke orang spesifik atau general
  const isSpecificGuest = tamu !== 'Tamu Undangan';

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-[3500ms] ease-in-out ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-slate-950/60 z-10"></div>
      <img src={imgSampul} alt="Cover" className="absolute inset-0 w-full h-full object-cover scale-105 blur-sm" />
      
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 w-full max-w-lg">
        <p className="text-amber-300 tracking-[0.4em] text-xs font-bold uppercase mb-4 drop-shadow-md">The Wedding Of</p>
        <h1 className="text-6xl md:text-8xl font-serif text-white mb-12 drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
          {data.nama_wanita} <span className="text-amber-400 font-light mx-2">&</span> {data.nama_pria}
        </h1>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] w-full mb-10 shadow-2xl">
          <p className="text-amber-100/80 text-xs mb-4 font-medium uppercase tracking-widest">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
          <p className="text-3xl md:text-4xl font-serif text-white font-bold mb-4 drop-shadow-md capitalize leading-snug">{tamu}</p>
          <div className="w-12 h-px bg-amber-400/50 mx-auto my-4"></div>
          
          {/* Kalimat mohon maaf HANYA muncul kalau ada nama tamu khusus */}
          {isSpecificGuest ? (
            <p className="text-[10px] text-white/50 italic tracking-wider">Mohon maaf bila ada kesalahan penulisan nama/gelar</p>
          ) : (
            <p className="text-[10px] text-white/50 italic tracking-wider">Kami menantikan kehadiran Anda</p>
          )}
        </div>

        <button 
          onClick={handleOpen}
          className="group px-10 py-5 bg-amber-600 text-white font-bold uppercase tracking-widest text-xs rounded-full shadow-[0_10px_40px_rgba(217,119,6,0.5)] hover:bg-white hover:text-slate-900 transition-all duration-500 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 animate-pulse"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/></svg>
          Buka Undangan
        </button>
      </div>
    </div>
  );
}