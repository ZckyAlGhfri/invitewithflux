'use client';
import { motion } from 'framer-motion';

export default function Cover({ data, isOpened, handleOpen, tamu, imgSampul }) {
  if (!data) return null;

  const isSpecificGuest = tamu !== 'Tamu Undangan';

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-[2500ms] ease-in-out ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'} bg-stone-50`}>
      
      {/* Latar Belakang Terang & Lembut */}
      <div className="absolute inset-0 z-0">
         <img src={imgSampul} alt="Cover" className="w-full h-full object-cover opacity-20 blur-md grayscale-[30%]" />
         <div className="absolute inset-0 bg-stone-50/80 backdrop-blur-sm"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 w-full max-w-md">
        
        {/* Bingkai Klasik (Double Line Arch) */}
        <div className="border border-stone-300 p-2 w-full rounded-t-full shadow-2xl bg-white/40 backdrop-blur-md">
          <div className="border border-stone-300 p-10 py-16 w-full rounded-t-full flex flex-col items-center bg-white/60">
            <p className="text-stone-500 tracking-[0.3em] text-[10px] font-bold uppercase mb-6">The Wedding Of</p>
            
            <h1 className="text-5xl md:text-6xl font-serif text-stone-900 mb-8 leading-tight">
              {data.nama_wanita} <br/>
              <span className="text-3xl italic text-stone-400 font-light">&</span><br/> 
              {data.nama_pria}
            </h1>
            
            <div className="w-16 h-px bg-stone-300 my-6"></div>
            
            <p className="text-stone-500 text-[10px] mb-3 uppercase tracking-widest">Kepada Yth:</p>
            <p className="text-2xl font-serif text-stone-800 font-bold mb-2 capitalize">{tamu}</p>
            
            {isSpecificGuest ? (
              <p className="text-[10px] text-stone-400 italic">Mohon maaf bila ada kesalahan penulisan nama/gelar</p>
            ) : (
              <p className="text-[10px] text-stone-400 italic">Kami menantikan kehadiran Anda</p>
            )}
          </div>
        </div>

        {/* Tombol Klasik (Kotak Tegas, Bukan Rounded) */}
        <button 
          onClick={handleOpen}
          className="mt-10 px-10 py-4 bg-stone-900 text-white font-medium uppercase tracking-[0.2em] text-[10px] transition-all duration-500 hover:bg-stone-700 hover:scale-105 active:scale-95 shadow-xl"
        >
          Buka Undangan
        </button>
      </div>
    </div>
  );
}