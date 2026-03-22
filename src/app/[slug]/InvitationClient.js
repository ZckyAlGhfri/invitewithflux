'use client';
import { useState, useEffect, useRef } from 'react';
import Reveal from '@/components/Reveal';
import Guestbook from '@/components/Guestbook';

// IMPORT COMPONENT TEMA LUXURY
import Cover from '@/components/themes/luxury/Cover';
import Hero from '@/components/themes/luxury/Hero';
import Couple from '@/components/themes/luxury/Couple';
import Event from '@/components/themes/luxury/Event';
import Gallery from '@/components/themes/luxury/Gallery';
import LoveStory from '@/components/themes/luxury/LoveStory';
import Gift from '@/components/themes/luxury/Gift';
import FloatingNav from '@/components/themes/luxury/FloatingNav';

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
        <Event data={data} timeLeft={timeLeft} />
        <LoveStory data={data} />
        <Gallery data={data} imgSampul={imgSampul} />
        <Gift data={data} />

        <div id="rsvp" className="relative bg-slate-50 border-t border-slate-200/50">
          <Reveal direction="up">
            <Guestbook invitationId={data.id} />
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