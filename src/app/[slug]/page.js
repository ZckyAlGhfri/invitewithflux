'use client';
import { useState, useEffect, useRef, use } from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Guestbook from '@/components/Guestbook';
import { motion } from 'framer-motion';

// ==========================================
// 1. KOMPONEN ANIMASI SCROLL (SMOOTH & LAMBAT)
// ==========================================
const Reveal = ({ children, direction = 'up', delay = 0, className = '' }) => {
  const variants = {
    hidden: { 
      opacity: 0, 
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0, 
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0, 
      transition: { duration: 1.2, delay, ease: [0.25, 0.1, 0.25, 1] } 
    }
  };
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={variants} className={className}>
      {children}
    </motion.div>
  );
};

export default function InvitationPage({ params, searchParams }) {
  const unwrappedParams = use(params);
  const unwrappedSearchParams = use(searchParams);
  const slug = unwrappedParams.slug;
  const tamu = unwrappedSearchParams.to || 'Tamu Undangan';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const audioRef = useRef(null);

  useEffect(() => {
    async function fetchInvitation() {
     const { data: invite, error } = await supabase
        .from('invitations')
        .select(`*, bank_accounts(*)`) // <-- INI YANG BERUBAH
        .eq('slug', slug)
        .single();
      if (error || !invite || invite.status !== 'published') notFound();
      setData(invite);
      setLoading(false);
    }
    fetchInvitation();
  }, [slug]);

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

  // LOGIKA BUKA UNDANGAN (FADE OUT COVER, TANPA AUTO SCROLL)
  const handleOpen = () => {
    if (audioRef.current) { audioRef.current.play(); setIsPlaying(true); }
    setIsOpened(true); // Ini akan memicu class opacity-0 pada Cover
  };

  const toggleAudio = () => {
    if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  // Kunci Scroll Layar Saat Cover Belum Dibuka
  useEffect(() => {
    if (!isOpened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpened]);

  // Fallback Data
  const imgSampul = data?.foto_sampul || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000";
  const imgPria = data?.foto_pria || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800";
  const imgWanita = data?.foto_wanita || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800";
  const imgAkad = "https://images.unsplash.com/photo-1621617448897-425b0f49887f?q=80&w=1200";
  const imgResepsi = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200";
  
  // Video Background Mewah (Bisa diganti URL Cloudinary Anda nanti)
  const videoHero = "/videos/wedding.mp4";

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-amber-200 font-serif italic">
      <div className="w-16 h-16 border-4 border-amber-200/20 border-t-amber-300 rounded-full animate-spin mb-6"></div>
      <p className="tracking-widest text-sm uppercase">Menyiapkan Momen Indah...</p>
    </div>
  );

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 overflow-x-hidden relative selection:bg-amber-100">
      
      {/* ========================================== */}
      {/* 1. COVER (SAMPUL DEPAN) - FADE OUT ANIMATION */}
      {/* ========================================== */}
      <div 
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-[4500ms] ease-in-out ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <div className="absolute inset-0 bg-slate-950/60 z-10"></div>
        <img src={imgSampul} alt="Cover" className="absolute inset-0 w-full h-full object-cover scale-105 blur-sm" />
        
        <div className="relative z-20 flex flex-col items-center justify-center text-center px-6 w-full max-w-lg">
          <p className="text-amber-300 tracking-[0.4em] text-xs font-bold uppercase mb-4 drop-shadow-md">The Wedding Of</p>
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-12 drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
            {data.nama_wanita} <span className="text-amber-400 font-light mx-2">&</span> {data.nama_pria}
          </h1>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] w-full mb-10 shadow-2xl">
            <p className="text-amber-100/80 text-xs mb-4 font-medium uppercase tracking-widest">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
            <p className="text-3xl md:text-4xl font-serif text-white font-bold mb-4 drop-shadow-md">{tamu}</p>
            <div className="w-12 h-px bg-amber-400/50 mx-auto my-4"></div>
            <p className="text-[10px] text-white/50 italic tracking-wider">Mohon maaf bila ada kesalahan penulisan nama/gelar</p>
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

      {/* AUDIO PLAYER MELAYANG */}
      <audio ref={audioRef} src={data.music_url} loop />
      <button 
        onClick={toggleAudio} 
        className={`fixed top-6 right-6 z-[90] w-12 h-12 bg-white/70 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center shadow-xl transition-all hover:bg-white hover:scale-110 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''} ${isOpened ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {isPlaying ? <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg> : <svg className="w-5 h-5 text-slate-400 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
      </button>

      {/* ========================================== */}
      {/* PEMBUNGKUS KONTEN UTAMA (Di Bawah Cover)   */}
      {/* ========================================== */}
      <div className="relative w-full">
        
        {/* ========================================== */}
        {/* 2. HERO SECTION (VIDEO BACKGROUND)         */}
        {/* ========================================== */}
        <section id="hero" className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-slate-950/50 z-10 pointer-events-none"></div>
          
          {/* Latar Belakang Foto dengan Animasi Zoom Super Lambat (Ken Burns) */}
          <motion.img 
            src={imgSampul} 
            alt="Hero Background" 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-80"
            animate={{ scale: [1, 1.15, 1] }} 
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
          
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full mt-20">
            <Reveal direction="down" delay={0.5}>
              <p className="text-xs uppercase tracking-[0.6em] mb-6 text-amber-300 font-bold drop-shadow-lg">Menyambut Hari Bahagia</p>
            </Reveal>
            <Reveal delay={0.7}>
              <h2 className="text-7xl md:text-9xl font-serif text-white mb-8 drop-shadow-[0_4px_40px_rgba(0,0,0,0.8)]">
                {data.nama_wanita} <span className="text-5xl md:text-7xl mx-2 font-light text-amber-400">&</span> {data.nama_pria}
              </h2>
            </Reveal>
            <Reveal direction="up" delay={0.9}>
              <p className="text-xl md:text-2xl font-light tracking-widest text-white/90 drop-shadow-md bg-slate-900/30 px-8 py-3 rounded-full backdrop-blur-sm border border-white/10">
                {formatDate(data.tanggal_akad)}
              </p>
            </Reveal>
            
            <Reveal delay={1.2}>
              <div className="mt-24 animate-bounce opacity-70">
                <p className="text-[10px] uppercase tracking-widest text-white/60 mb-3 font-bold">Geser ke Bawah</p>
                <svg className="w-6 h-6 mx-auto text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ========================================== */}
        {/* 3. PROFIL MEMPELAI                         */}
        {/* ========================================== */}
        <section id="couple" className="py-32 px-6 md:px-12 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-50 rounded-full blur-[150px] opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <Reveal className="flex flex-col items-center justify-center w-full">
              <svg className="w-14 h-14 text-amber-300 mb-8" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/></svg>
              <p className="text-slate-600 italic font-serif text-xl md:text-2xl leading-relaxed mb-24 max-w-3xl text-center">
                "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya..." <br/>
                <span className="block mt-8 text-xs font-sans font-bold text-amber-700 uppercase tracking-[0.2em] bg-amber-50 inline-block px-6 py-2.5 rounded-full">(QS. Ar-Rum: 21)</span>
              </p>
            </Reveal>

            <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24">
              {/* MEMPELAI WANITA */}
              <Reveal direction="right" className="flex-1">
                <div className="flex flex-col items-center group">
                  <div className="w-56 h-72 md:w-72 md:h-96 rounded-t-[12rem] overflow-hidden border-[12px] border-slate-50 shadow-2xl mb-8 relative transition-transform duration-700 group-hover:-translate-y-4">
                    <img src={imgWanita} alt="Wanita" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border border-amber-200/60 rounded-t-[12rem] m-4 pointer-events-none"></div>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">{data.nama_lengkap_wanita}</h3>
                  <p className="text-slate-500 text-base leading-relaxed">Putri tercinta dari: <br/><span className="font-bold text-slate-800">Bapak {data.nama_ayah_wanita}</span> & <span className="font-bold text-slate-800">Ibu {data.nama_ibu_wanita}</span></p>
                </div>
              </Reveal>

              <Reveal><h2 className="text-7xl font-serif text-amber-200 font-extralight my-12 md:my-0">&</h2></Reveal>

              {/* MEMPELAI PRIA */}
              <Reveal direction="left" className="flex-1">
                <div className="flex flex-col items-center group">
                  <div className="w-56 h-72 md:w-72 md:h-96 rounded-t-[12rem] overflow-hidden border-[12px] border-slate-50 shadow-2xl mb-8 relative transition-transform duration-700 group-hover:-translate-y-4">
                    <img src={imgPria} alt="Pria" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 border border-amber-200/60 rounded-t-[12rem] m-4 pointer-events-none"></div>
                  </div>
                  <h3 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">{data.nama_lengkap_pria}</h3>
                  <p className="text-slate-500 text-base leading-relaxed">Putra tercinta dari: <br/><span className="font-bold text-slate-800">Bapak {data.nama_ayah_pria}</span> & <span className="font-bold text-slate-800">Ibu {data.nama_ibu_pria}</span></p>
                </div>
              </Reveal>
              
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 4. ACARA & COUNTDOWN                       */}
        {/* ========================================== */}
        <section id="event" className="py-32 bg-slate-950 text-white relative">
          <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center justify-center text-center mb-20">
              <Reveal direction="down">
                <span className="text-xs font-bold tracking-[0.4em] uppercase text-amber-400 mb-4 block">Save The Date</span>
                <h2 className="text-5xl md:text-6xl font-serif italic text-white">Momen Bersejarah</h2>
              </Reveal>
            </div>
              
            {/* BOX COUNTDOWN */}
            <div className="flex justify-center gap-4 md:gap-10 mb-28">
                {[
                  { label: 'Hari', value: timeLeft.days }, { label: 'Jam', value: timeLeft.hours },
                  { label: 'Menit', value: timeLeft.minutes }, { label: 'Detik', value: timeLeft.seconds }
                ].map((time, idx) => (
                  <Reveal key={idx} direction="up" delay={idx * 0.1}>
                    <div className="w-20 h-24 md:w-32 md:h-36 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-amber-400/50 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                      <span className="text-4xl md:text-5xl font-serif text-amber-300 mb-2">{String(time.value).padStart(2, '0')}</span>
                      <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/50 font-bold">{time.label}</span>
                    </div>
                  </Reveal>
                ))}
            </div>

            {/* KARTU ACARA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Reveal direction="right">
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-8 md:p-12 rounded-[3rem] text-center shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-colors duration-500">
                  <div className="w-1 h-full bg-amber-500 absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <h3 className="text-4xl font-serif mb-6 text-amber-100">Akad Nikah</h3>
                  <div className="space-y-2 mb-8">
                    <p className="text-amber-400 font-bold uppercase tracking-widest text-sm">{formatDate(data.tanggal_akad)}</p>
                    <p className="text-2xl text-white font-light">Pukul {data.waktu_akad || formatTime(data.tanggal_akad)} WIB</p>
                  </div>
                  <div className="w-full h-56 rounded-3xl overflow-hidden mb-8 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                    <img src={imgAkad} alt="Akad" className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"/>
                  </div>
                  <p className="text-slate-400 font-medium mb-10 leading-relaxed text-sm md:text-base">{data.tempat_akad}</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href={data.map_link_akad} target="_blank" className="w-full sm:w-auto px-8 py-4 bg-amber-600 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-slate-900 transition-colors shadow-lg shadow-amber-900/50">Lihat Lokasi Maps</a>
                    <a href={`https://www.google.com/calendar/render?action=TEMPLATE&text=Akad+Nikah+${data.nama_pria}+%26+${data.nama_wanita}&dates=${new Date(data.tanggal_akad).toISOString().replace(/-|:|\.\d\d\d/g,"")}/${new Date(new Date(data.tanggal_akad).getTime() + 2*60*60*1000).toISOString().replace(/-|:|\.\d\d\d/g,"")}&details=Akad+Nikah&location=${data.tempat_akad}&sf=true&output=xml`} target="_blank" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:border-amber-400 hover:text-amber-400 transition-colors">Ingatkan Saya</a>
                  </div>
                </div>
              </Reveal>

              <Reveal direction="left">
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-8 md:p-12 rounded-[3rem] text-center shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-colors duration-500">
                  <div className="w-1 h-full bg-amber-500 absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <h3 className="text-4xl font-serif mb-6 text-amber-100">Resepsi</h3>
                  <div className="space-y-2 mb-8">
                    <p className="text-amber-400 font-bold uppercase tracking-widest text-sm">{formatDate(data.tanggal_resepsi)}</p>
                    <p className="text-2xl text-white font-light">Pukul {data.waktu_resepsi || formatTime(data.tanggal_resepsi)} WIB</p>
                  </div>
                  <div className="w-full h-56 rounded-3xl overflow-hidden mb-8 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                    <img src={imgResepsi} alt="Resepsi" className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"/>
                  </div>
                  <p className="text-slate-400 font-medium mb-10 leading-relaxed text-sm md:text-base">{data.tempat_resepsi}</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href={data.map_link_resepsi} target="_blank" className="w-full sm:w-auto px-8 py-4 bg-amber-600 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-slate-900 transition-colors shadow-lg shadow-amber-900/50">Lihat Lokasi Maps</a>
                    <a href={`https://www.google.com/calendar/render?action=TEMPLATE&text=Resepsi+Pernikahan+${data.nama_pria}+%26+${data.nama_wanita}&dates=${new Date(data.tanggal_resepsi).toISOString().replace(/-|:|\.\d\d\d/g,"")}/${new Date(new Date(data.tanggal_resepsi).getTime() + 4*60*60*1000).toISOString().replace(/-|:|\.\d\d\d/g,"")}&details=Resepsi+Pernikahan&location=${data.tempat_resepsi}&sf=true&output=xml`} target="_blank" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:border-amber-400 hover:text-amber-400 transition-colors">Ingatkan Saya</a>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 5. GALERI MOMEN                            */}
        {/* ========================================== */}
        <section id="gallery" className="py-32 px-6 bg-white overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center mb-20">
              <Reveal direction="down">
                <span className="text-xs font-bold tracking-[0.4em] uppercase text-amber-600 mb-4 block">Visualisasi Kebahagiaan</span>
                <h2 className="text-5xl md:text-6xl font-serif italic text-slate-900">Galeri Kami</h2>
              </Reveal>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
              {[
                { url: imgSampul, col: "col-span-2", row: "row-span-2" },
                { url: imgWanita, col: "col-span-1", row: "row-span-1" },
                { url: "https://images.unsplash.com/photo-1591604466107-ec97de577fad?q=80&w=800", col: "col-span-1", row: "row-span-2" },
                { url: imgPria, col: "col-span-1", row: "row-span-1" },
                { url: "https://images.unsplash.com/photo-1520856729845-cee33a39295c?q=80&w=800", col: "col-span-2", row: "row-span-1" },
                { url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800", col: "col-span-1", row: "row-span-1" },
              ].map((img, idx) => (
                <Reveal key={idx} delay={idx * 0.15} direction={idx % 2 === 0 ? "up" : "down"} className={`${img.col} ${img.row}`}>
                  <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-lg group cursor-pointer border-[8px] border-slate-50 relative">
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img src={img.url} alt={`Gallery ${idx+1}`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/* 6. KADO DIGITAL                            */}
        {/* ========================================== */}
        {(data.tier === 'premium' || data.tier === 'exclusive') && (
          <section id="gift" className="py-32 bg-amber-50 px-6 relative overflow-hidden">
            <div className="absolute -left-32 top-0 w-96 h-96 bg-amber-200/40 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <Reveal direction="down">
                <span className="text-xs font-bold tracking-[0.4em] uppercase text-amber-700 mb-4 block">Tanda Kasih</span>
                <h2 className="text-5xl md:text-6xl font-serif italic text-slate-900 mb-8">Wedding Gift</h2>
                <p className="text-slate-600 mb-16 font-light leading-relaxed text-lg max-w-2xl mx-auto">Tanpa mengurangi rasa hormat, bagi Anda yang ingin memberikan tanda kasih untuk kami, dapat melalui beberapa cara di bawah ini.</p>
              </Reveal>
              
              <div className="space-y-8">
                {/* LOOPING REKENING ASLI DARI DATABASE */}
                {data.bank_accounts && data.bank_accounts.length > 0 ? (
                  data.bank_accounts.map((bank, index) => (
                    <Reveal key={index} direction="up" delay={0.2 * index}>
                      <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-[0_10px_50px_rgba(0,0,0,0.05)] border border-amber-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                        <div className="absolute left-0 top-0 w-2 h-full bg-amber-400"></div>
                        <div className="text-left flex-1">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-700 font-bold mb-4 bg-amber-50 inline-block px-4 py-1.5 rounded-full border border-amber-200/50">
                            Transfer {bank.bank_name}
                          </p>
                          <p className="text-3xl md:text-4xl font-bold text-slate-900 my-2 font-mono tracking-wider">
                            {bank.account_number}
                          </p>
                          <p className="text-base text-slate-500 mt-2">
                            Atas Nama: <strong className="text-slate-800">{bank.account_name}</strong>
                          </p>
                        </div>
                        <button 
                          onClick={() => {navigator.clipboard.writeText(bank.account_number); alert(`No. Rekening ${bank.bank_name} disalin!`)}} 
                          className="w-full md:w-auto px-10 py-5 bg-slate-900 text-white font-bold text-xs rounded-full uppercase tracking-widest hover:bg-amber-600 transition-colors active:scale-95 shadow-xl"
                        >
                          Salin Rekening
                        </button>
                      </div>
                    </Reveal>
                  ))
                ) : (
                  <p className="text-slate-500 italic">Informasi rekening belum ditambahkan.</p>
                )}

                {data.tier === 'exclusive' && data.alamat_kado_fisik && (
                  <Reveal direction="up" delay={0.4}>
                    <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-[0_10px_50px_rgba(0,0,0,0.05)] border border-amber-100 text-left relative overflow-hidden">
                      <div className="absolute left-0 top-0 w-2 h-full bg-amber-400"></div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-amber-700 font-bold mb-5 bg-amber-50 inline-block px-4 py-1.5 rounded-full border border-amber-200/50">Kirim Kado Fisik</p>
                      <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-8">
                        <p className="text-slate-700 leading-relaxed font-medium text-base">{data.alamat_kado_fisik}</p>
                      </div>
                      <button onClick={() => {navigator.clipboard.writeText(data.alamat_kado_fisik); alert("Alamat disalin!")}} className="w-full px-10 py-5 bg-slate-100 text-slate-800 font-bold text-xs rounded-full uppercase tracking-widest hover:bg-slate-200 transition-colors active:scale-95 text-center shadow-sm">
                        Salin Alamat Lengkap
                      </button>
                    </div>
                  </Reveal>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ========================================== */}
        {/* 7. GUESTBOOK & FOOTER                      */}
        {/* ========================================== */}
        <div id="rsvp" className="relative bg-slate-50 border-t border-slate-200/50">
          <Reveal direction="up">
            <Guestbook invitationId={data.id} />
          </Reveal>
        </div>

        <footer className="bg-slate-950 text-white text-center py-24 pb-40 relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
           <Reveal direction="up">
              <h2 className="text-5xl md:text-7xl font-serif italic mb-8 text-amber-300 drop-shadow-lg">{data.nama_pria} & {data.nama_wanita}</h2>
              <p className="text-sm text-white/60 mb-16 tracking-[0.4em] uppercase font-light">FluxWeddingMoment</p>
              
              <div className="w-20 h-px bg-white/20 mx-auto my-10"></div>
              
              <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase mt-4">Built with Excellence by</p>
              <p className="text-xs font-bold text-white/60 tracking-[0.3em] uppercase mt-2">FluxWedding Invitation</p>
           </Reveal>
        </footer>

      </div>

      {/* ========================================== */}
      {/* 8. FLOATING NAV (DIKUNCI TENGAH BAWAH)     */}
      {/* ========================================== */}
      <div className={`fixed bottom-6 left-0 right-0 mx-auto w-max z-[90] transition-all duration-1000 ${isOpened ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
        <nav className="bg-white/90 backdrop-blur-2xl border border-slate-200/50 shadow-[0_10px_40px_rgba(0,0,0,0.15)] rounded-full px-8 py-4 flex items-center gap-8 md:gap-10">
          {[
            { id: 'hero', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { id: 'couple', label: 'Mempelai', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
            { id: 'event', label: 'Acara', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { id: 'gallery', label: 'Galeri', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
            { id: 'rsvp', label: 'RSVP', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' }
          ].map(item => (
            <a key={item.id} href={`#${item.id}`} className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-amber-600 transition-colors group">
              <svg className="w-5 h-5 transition-transform group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}/></svg>
              <span className="text-[8px] font-bold tracking-widest uppercase opacity-70 group-hover:opacity-100">{item.label}</span>
            </a>
          ))}
        </nav>
      </div>

    </div>
  );
}