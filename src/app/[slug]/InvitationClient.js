'use client';
import { useState, useEffect, useRef } from 'react';
import Reveal from '@/components/Reveal';
import Guestbook from '@/components/Guestbook';
import { motion } from 'framer-motion';

// IMPORT COMPONENT TEMA LUXURY (SESUAI STRUKTUR FOLDER ANDA)
import Cover from '@/components/themes/luxury/Cover';
import Hero from '@/components/themes/luxury/Hero';
import Couple from '@/components/themes/luxury/Couple';
import Event from '@/components/themes/luxury/Event';
import Gallery from '@/components/themes/luxury/Gallery';
import LoveStory from '@/components/themes/luxury/LoveStory';
import Gift from '@/components/themes/luxury/Gift';
import FloatingNav from '@/components/themes/luxury/FloatingNav';

// IMPORT COMPONENT TEMA CLASSIC
import ClassicCover from '@/components/themes/classic/Cover';
import ClassicHero from '@/components/themes/classic/Hero';
import ClassicCouple from '@/components/themes/classic/Couple';
import ClassicEvent from '@/components/themes/classic/Event';
import ClassicGallery from '@/components/themes/classic/Gallery';
import ClassicLoveStory from '@/components/themes/classic/LoveStory';
import ClassicGift from '@/components/themes/classic/Gift';
import ClassicFloatingNav from '@/components/themes/classic/FloatingNav';

// IMPORT COMPONENT TEMA MODERN
import ModernCover from '@/components/themes/modern/Cover';
import ModernHero from '@/components/themes/modern/Hero';
import ModernCouple from '@/components/themes/modern/Couple';
import ModernEvent from '@/components/themes/modern/Event';
import ModernGallery from '@/components/themes/modern/Gallery';
import ModernLoveStory from '@/components/themes/modern/LoveStory';
import ModernGift from '@/components/themes/modern/Gift';
import ModernFloatingNav from '@/components/themes/modern/FloatingNav';

export default function InvitationClient({ data, tamu }) {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const audioRef = useRef(null);

  // LOGIKA COUNTDOWN
  useEffect(() => {
    if (!data?.tanggal_akad) return;
    const targetDate = new Date(data.tanggal_akad).getTime();
    if (isNaN(targetDate)) return;

    const interval = setInterval(() => {
      const distance = targetDate - new Date().getTime();
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [data]);

  const handleOpen = () => {
    if (audioRef.current) { audioRef.current.play(); setIsPlaying(true); }
    setIsOpened(true); 
  };

  const toggleAudio = () => {
    if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpened]);

  const imgSampul = data?.foto_sampul || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000";

  // --- ROUTER TEMA DINAMIS ---
  const currentTheme = data.theme || 'luxury';

  // 1. TEMA CLASSIC
  if (currentTheme === 'classic') {
    return (
      <div className="bg-[#FCFBF7] min-h-screen font-sans text-stone-800 overflow-x-hidden relative selection:bg-stone-200">
        
        {/* --- KANVAS LATAR BELAKANG SULTAN (FLOATING ORNAMENTS) --- */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* 1. Efek Tekstur Kertas */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60"></div>
          
          {/* 2. Gradasi Warna Tipis (Mencegah layar polos 1 warna) */}
          <div className="absolute -top-[10%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-stone-200/50 blur-[120px]"></div>
          <div className="absolute top-[30%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-amber-100/30 blur-[120px]"></div>
          <div className="absolute -bottom-[10%] left-[10%] w-[80vw] h-[80vw] rounded-full bg-stone-200/50 blur-[150px]"></div>

          {/* 3. Floating Ornaments (Ukuran Berbeda & Melayang Acak) */}
          {[
            { top: '5%', left: '10%', size: 240, delay: 0, op: 0.07 },  // Besar & Sangat Tipis
            { top: '15%', left: '80%', size: 80, delay: 2, op: 0.12 },   // Kecil & Agak Jelas
            { top: '35%', left: '50%', size: 200, delay: 4, op: 0.08 },  // Sedang
            { top: '60%', left: '5%', size: 60, delay: 1, op: 0.15 },    // Sangat Kecil
            { top: '85%', left: '15%', size: 300, delay: 6, op: 0.1 }, // Raksasa di pojok (Background)
            { top: '45%', left: '90%', size: 100, delay: 3, op: 0.1 },    // Sedang
            { top: '70%', left: '85%', size: 170, delay: 5, op: 0.07 },   // Sedang
            { top: '25%', left: '25%', size: 50, delay: 7, op: 0.18 },   // Partikel Kecil
            { top: '55%', left: '45%', size: 220, delay: 2, op: 0.07 },  // Besar
            { top: '90%', left: '60%', size: 90, delay: 4, op: 0.12 },   // Kecil
          ].map((ornament, i) => (
            <motion.div
              key={i}
              className="absolute text-stone-500"
              style={{ 
                top: ornament.top, 
                left: ornament.left, 
                width: ornament.size, 
                height: ornament.size,
                opacity: ornament.op 
              }}
              animate={{
                y: [0, i % 2 === 0 ? -40 : 40, 0], // Arah naik turun acak
                x: [0, i % 3 === 0 ? 30 : -30, 0], // Arah ayunan acak
                rotate: [0, 360] // Berputar penuh sangat lambat
              }}
              transition={{
                duration: 7 + i * 5, // Kecepatan berbeda tiap elemen
                repeat: Infinity,
                ease: "linear",
                delay: ornament.delay
              }}
            >
              <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
                <path d="M50 0 C50 25 75 50 100 50 C75 50 50 75 50 100 C50 75 25 50 0 50 C25 50 50 25 50 0 Z" />
              </svg>
            </motion.div>
          ))}
        </div>
        {/* --- AKHIR KANVAS LATAR BELAKANG --- */}

        {/* Karena latar belakang sudah ramai tapi elegan, komponen di atasnya harus dipastikan ada z-10 atau z-20 */}
        <div className="relative z-10">
          <ClassicCover data={data} isOpened={isOpened} handleOpen={handleOpen} tamu={tamu} imgSampul={imgSampul} />
          {/* ... (Sisanya biarkan persis seperti kode sebelumnya: <audio>, <ClassicHero>, dst) ... */}
        <audio ref={audioRef} src={data.music_url} loop />
        
        <button onClick={toggleAudio} className={`fixed top-6 right-6 z-[90] w-12 h-12 bg-white/90 border border-stone-300 flex items-center justify-center shadow-lg transition-all hover:bg-stone-100 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''} ${isOpened ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {isPlaying ? <span className="text-stone-800 text-xs tracking-widest">II</span> : <span className="text-stone-800 text-xs tracking-widest">▶</span>}
        </button>

        <div className="relative w-full">
          <ClassicHero data={data} imgSampul={imgSampul} />
          <ClassicCouple data={data} />
          {data.tier === 'exclusive' && <ClassicLoveStory data={data} />}
          <ClassicEvent data={data} timeLeft={timeLeft} />
          
          {data.tier !== 'basic' && (
            <>
              <ClassicGallery data={data} />
              <ClassicGift data={data} />
            </>
          )}

          <div id="rsvp" className="relative bg-white border-t border-stone-300 pt-10">
            <Reveal direction="up">
              <Guestbook invitationId={data.id} theme="classic" />
            </Reveal>
          </div>

          <footer className="bg-stone-100 text-stone-500 text-center py-20 border-t border-stone-300">
              <Reveal direction="up">
                <h2 className="text-3xl font-serif text-stone-900 mb-6">{data.nama_wanita} & {data.nama_pria}</h2>
                <div className="w-10 h-px bg-stone-400 mx-auto my-6"></div>
                <p className="text-[9px] tracking-[0.3em] uppercase mb-1">Built with Excellence by</p>
                <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-stone-800">FluxWedding</p>
              </Reveal>
          </footer>
        </div>
        <ClassicFloatingNav isOpened={isOpened} />
        </div>
      </div>
    );
  }

  // 2. TEMA MODERN
  if (currentTheme === 'modern') {
    return (
      <div className="bg-black min-h-screen font-sans selection:bg-amber-500 selection:text-white">
        <ModernCover data={data} isOpened={isOpened} handleOpen={handleOpen} tamu={tamu} imgSampul={imgSampul} />
        <audio ref={audioRef} src={data.music_url} loop />
        
        {/* TOMBOL MUSIK MODERN (Industrial Style) */}
        <button 
          onClick={toggleAudio} 
          className={`fixed top-6 right-6 z-[90] w-12 h-12 bg-white text-black flex items-center justify-center shadow-[4px_4px_0px_rgba(245,158,11,1)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(245,158,11,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${isOpened ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          {isPlaying ? (
            <span className="text-[10px] font-black tracking-tighter uppercase">Stop</span>
          ) : (
            <span className="text-[10px] font-black tracking-tighter uppercase">Play</span>
          )}
        </button>

        <div className="relative w-full">
          <ModernHero data={data} imgSampul={imgSampul} />
          <ModernCouple data={data} />
          {data.tier === 'exclusive' && <ModernLoveStory data={data} />}
          <ModernEvent data={data} timeLeft={timeLeft} />
          
          {data.tier !== 'basic' && (
            <>
              <ModernGallery data={data} />
              <ModernGift data={data} />
            </>
          )}

          {/* GUESTBOOK DENGAN PROPS THEME */}
          <div id="rsvp" className="bg-stone-900 py-24 px-6 border-y border-white/5">
            <Reveal direction="up">
              <Guestbook invitationId={data.id} theme="modern" />
            </Reveal>
          </div>

          <footer className="bg-black text-center py-24 border-t border-white/5">
             <h2 className="text-4xl font-black uppercase text-white tracking-tighter">
               {data.nama_wanita} <span className="text-amber-500">&</span> {data.nama_pria}
             </h2>
             <p className="text-[8px] tracking-[0.5em] text-white/20 uppercase mt-10 italic">Built with Excellence by FluxWedding</p>
          </footer>
        </div>

        {/* FLOATING NAV MODERN */}
        <ModernFloatingNav isOpened={isOpened} />
      </div>
    );
  }

  // 3. TEMA LUXURY (DEFAULT)
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 overflow-x-hidden relative selection:bg-amber-100">
      
      <Cover data={data} isOpened={isOpened} handleOpen={handleOpen} tamu={tamu} imgSampul={imgSampul} />

      <audio ref={audioRef} src={data.music_url} loop />
      <button 
        onClick={toggleAudio} 
        className={`fixed top-6 right-6 z-[90] w-12 h-12 bg-white/70 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center shadow-xl transition-all hover:bg-white hover:scale-110 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''} ${isOpened ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {isPlaying ? <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg> : <svg className="w-5 h-5 text-slate-400 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
      </button>

      <div className="relative w-full">
        <Hero data={data} imgSampul={imgSampul} />
        <Couple data={data} />
        
        {/* FITUR EKSKLUSIF: LOVE STORY */}
        {data.tier === 'exclusive' && <LoveStory data={data} />}
        
        <Event data={data} timeLeft={timeLeft} />
        
        {/* FITUR PREMIUM & EKSKLUSIF: GALLERY & KADO */}
        {data.tier !== 'basic' && (
          <>
            <Gallery data={data} imgSampul={imgSampul} />
            <Gift data={data} />
          </>
        )}

        <div id="rsvp" className="relative bg-slate-50 border-t border-slate-200/50">
          <Reveal direction="up">
            <Guestbook invitationId={data.id} theme="luxury" />
          </Reveal>
        </div>

        <footer className="bg-slate-950 text-white text-center py-24 pb-40 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
            <Reveal direction="up">
              <h2 className="text-5xl md:text-7xl font-serif italic mb-8 text-amber-300 drop-shadow-lg">{data.nama_wanita} & {data.nama_pria}</h2>
              <p className="text-sm text-white/60 mb-16 tracking-[0.4em] uppercase font-light">#invitewithflux</p>
              
              <div className="w-20 h-px bg-white/20 mx-auto my-10"></div>
              
              <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase mt-4">Built with Excellence by</p>
              <p className="text-xs font-bold text-white/60 tracking-[0.3em] uppercase mt-2">invitewithflux.com</p>
            </Reveal>
        </footer>
      </div>

      <FloatingNav isOpened={isOpened} />

    </div>
  );
}