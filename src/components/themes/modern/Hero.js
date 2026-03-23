'use client';
import Reveal from '@/components/Reveal';
import { motion } from 'framer-motion';

export default function Hero({ data, imgSampul }) {
  if (!data) return null;

  // Ganti 'LONG' menjadi 'long'
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col justify-end bg-black text-white overflow-hidden p-8 md:p-16">
      
      {/* Background Image Half-Screen (Desktop) */}
      <div className="absolute top-0 right-0 w-full md:w-1/2 h-1/2 md:h-full z-0">
        <img src={imgSampul} alt="Hero" className="w-full h-full object-cover opacity-60 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/40 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-4xl">
        <Reveal direction="left">
          <span className="text-amber-500 font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Save the date</span>
          <h2 className="text-7xl md:text-[10rem] font-black uppercase leading-[0.85] tracking-tighter mb-8">
            {data.nama_wanita} <br/>
            <span className="text-white/20">AND</span> <br/>
            {data.nama_pria}
          </h2>
        </Reveal>

        <div className="flex flex-col md:flex-row md:items-center gap-8 mt-12">
          <Reveal direction="up" delay={0.4}>
            <div className="border-l-4 border-amber-500 pl-6">
              <p className="text-4xl font-bold uppercase tracking-tighter">
                {formatDate(data.tanggal_akad)}
              </p>
              <p className="text-xs text-white/50 uppercase tracking-widest mt-1">Starting the journey</p>
            </div>
          </Reveal>

          {data.quotes && (
            <Reveal direction="up" delay={0.6}>
              <p className="max-w-xs text-xs text-white/40 uppercase leading-relaxed tracking-widest italic">
                "{data.quotes}"
              </p>
            </Reveal>
          )}
        </div>
      </div>

      {/* Industrial Scroll Indicator */}
      <div className="absolute bottom-8 right-8 flex items-center gap-4 rotate-90 origin-right translate-y-[-50%]">
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/30">Scroll Down</p>
        <div className="w-20 h-px bg-white/20"></div>
      </div>
    </section>
  );
}