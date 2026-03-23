'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  const waNumber = "6287725266562"; 
  const waText = "Halo FluxWedding, saya tertarik untuk membuat undangan digital eksklusif.";

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#FCFBFA] text-slate-800 font-sans selection:bg-amber-200 overflow-x-hidden">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full backdrop-blur-lg bg-white/80 border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 text-xl md:text-2xl font-serif font-bold tracking-wide text-slate-900">
            <span className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md text-sm md:text-base">✨</span>
            Flux<span className="italic text-amber-600">Wedding</span>
          </div>

          <div className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-widest text-slate-500">
            <a href="#demo" className="hover:text-amber-600 transition">Lihat Desain</a>
            <a href="#fitur" className="hover:text-amber-600 transition">Keunggulan</a>
            <a href="#harga" className="hover:text-amber-600 transition">Harga</a>
          </div>

          <a 
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            className="px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-slate-900 text-white text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-amber-600 transition shadow-lg active:scale-95"
          >
            Pesan Via WA
          </a>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="relative pt-36 md:pt-44 pb-20 md:pb-28 px-6 flex flex-col items-center text-center bg-slate-950 overflow-hidden z-10">
        
        {/* background glow (disesuaikan untuk dark mode) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] md:h-[650px] bg-gradient-to-b from-amber-500/10 to-transparent rounded-full blur-[100px] md:blur-[120px] -z-10"></div>
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] -z-10"></div>

        {/* Semua konten di dalam menggunakan z-20 agar di atas gradien di bawah */}
        <motion.span variants={fadeUp} initial="hidden" animate="visible" transition={{duration:0.7}} className="relative text-[10px] md:text-[11px] uppercase tracking-[0.35em] font-bold text-amber-400 bg-slate-900 border border-slate-800 px-6 py-2 rounded-full mb-8 shadow-sm flex items-center gap-2 z-20">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
          Premium Digital Invitation
        </motion.span>

        <motion.h1 variants={fadeUp} initial="hidden" animate="visible" transition={{delay:0.15}} className="relative text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif leading-[1.1] tracking-tight text-white mb-6 md:mb-8 max-w-5xl z-20">
          Kemewahan Undangan <br className="hidden md:block"/>
          <span className="text-amber-600 italic">Digital</span> untuk Momen Abadi
        </motion.h1>

        <motion.p variants={fadeUp} initial="hidden" animate="visible" transition={{delay:0.3}} className="relative max-w-2xl text-base md:text-xl text-slate-400 mb-10 md:mb-12 leading-relaxed px-4 z-20">
          Hadirkan kesan pertama yang tak terlupakan. Undangan eksklusif, personal, dan siap disebarkan dalam hitungan menit tanpa ribet.
        </motion.p>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{delay:0.45}} className="relative flex flex-col sm:flex-row gap-4 md:gap-5 w-full sm:w-auto z-20">
          <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`} target="_blank" className="px-8 md:px-10 py-4 md:py-5 bg-amber-500 text-white rounded-full font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-amber-600 transition shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:-translate-y-1 flex items-center gap-3 justify-center">
            Mulai Buat Undangan
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <a href="#demo" className="px-8 md:px-10 py-4 md:py-5 bg-slate-900 border border-slate-800 text-slate-300 rounded-full font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-slate-800 hover:text-white transition justify-center flex items-center">
            Lihat Desain
          </a>
        </motion.div>
        
        {/* === PERBAIKAN TRANSISI GRADIENT TAJAM, TANPA MENUTUPI TOMBOL === */}
        {/* Menggunakan z-0 agar di bawah konten yang menggunakan z-20 */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-slate-950 to-transparent z-0"></div>
        {/* ============================================================= */}
      </section>

      {/* ================= FITUR ================= */}
      <section id="fitur" className="py-20 md:py-28 bg-slate-50 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-500">Solusi Cerdas</span>
            <h2 className="text-3xl md:text-5xl font-serif mt-4 mb-6 text-slate-900">Fitur Premium Tanpa Ribet</h2>
            <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto">Berikan kemudahan untuk tamu Anda dan ketenangan pikiran untuk Anda sendiri.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {[
              {title:'Buku Tamu Otomatis',icon:'📊',desc:'Ucapkan selamat tinggal pada catatan manual. Biarkan sistem mendata kehadiran tamu Anda.'},
              {title:'Sapa Nama Personal',icon:'💌',desc:'Nama tamu tampil otomatis di cover. Memberikan kesan sangat eksklusif dan dihargai.'},
              {title:'Edit Mandiri 24/7',icon:'🪄',desc:'Ada salah ketik atau lokasi berubah? Edit sendiri kapan saja tanpa harus menunggu antrean admin.'},
              {title:'Navigasi Presisi',icon:'📍',desc:'Satu klik langsung terhubung ke Google Maps, memastikan tamu sampai tujuan tanpa nyasar.'},
              {title:'Kado Digital Aman',icon:'🎁',desc:'Terima hadiah pernikahan langsung ke rekening bank atau e-wallet Anda dengan mudah.'},
              {title:'Love Story Timeline',icon:'⏳',desc:'Bagikan perjalanan kisah cinta Anda dalam visual memukau yang menyentuh hati para tamu.'}
            ].map((item,i)=>(
              <motion.div key={i} initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}} className="bg-white p-8 md:p-9 rounded-[2rem] border border-slate-100 hover:border-amber-200 hover:shadow-xl hover:-translate-y-2 transition group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">{item.icon}</div>
                <h3 className="text-lg md:text-xl font-bold font-serif text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LANGKAH ================= */}
      <section id="langkah" className="py-20 md:py-28 bg-white px-6 border-t border-slate-200">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4 md:mb-6">3 Langkah Bebas Stres</h2>
          <p className="text-base md:text-lg text-slate-500 mb-16 md:mb-20">Santai saja, biar sistem kami yang bekerja untuk hari bahagia Anda.</p>
          <div className="grid md:grid-cols-3 gap-12 md:gap-14">
            {[
              {step:'1',title:'Konsultasi Santai',desc:'Pilih desain dan paket favorit Anda, admin kami siap membantu via WhatsApp.'},
              {step:'2',title:'Personalisasi Data',desc:'Isi form undangan mandiri. Masukkan foto, cerita, dan detail acara sesuai keinginan.'},
              {step:'3',title:'Siap Disebar!',desc:'Undangan langsung aktif dan siap dibagikan ke ribuan kontak keluarga & sahabat.'}
            ].map((item,i)=>(
              <div key={i} className="flex flex-col items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-full border-4 border-amber-100 flex items-center justify-center text-2xl md:text-3xl font-bold text-amber-600 shadow-lg mb-6">{item.step}</div>
                <h3 className="font-bold text-lg md:text-xl text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="harga" className="py-20 md:py-28 bg-slate-950 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <span className="text-xs font-bold tracking-[0.35em] uppercase text-amber-500">Investasi Momen</span>
            <h2 className="text-3xl md:text-5xl font-serif text-white mt-4 mb-4">Pilih Paket Terbaik</h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto">Harga transparan untuk mahakarya digital yang akan selalu dikenang.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-center">
            {/* BASIC */}
            <div className="bg-slate-900 border border-slate-800 p-8 md:p-9 rounded-[2.5rem] md:rounded-[2rem] text-center hover:border-slate-700 transition hover:-translate-y-2">
              <h3 className="text-xl md:text-2xl font-serif text-white mb-2">Basic</h3>
              <p className="text-slate-400 text-sm mb-6">Simple & Elegan</p>
              <div className="mb-8 flex flex-col items-center">
                <span className="text-sm text-slate-500 line-through decoration-red-500/50 decoration-2 mb-1">Rp 99.000</span>
                <div className="text-4xl font-bold text-white">
                  Rp 69<span className="text-slate-500 text-xl">.000</span>
                </div>
              </div>
              <ul className="text-left text-slate-300 space-y-4 mb-10 text-xs md:text-sm">
                <li className="flex gap-3"><span className="text-amber-500">✓</span><span>Aktif 3 bulan</span></li>
                <li className="flex gap-3"><span className="text-amber-500">✓</span><span>Musik background</span></li>
                <li className="flex gap-3"><span className="text-amber-500">✓</span><span>Hitung mundur</span></li>
                <li className="flex gap-3"><span className="text-amber-500">✓</span><span>Google Maps</span></li>
                <li className="flex gap-3 opacity-40"><span>✕</span><span>Dashboard RSVP</span></li>
                <li className="flex gap-3 opacity-40"><span>✕</span><span>Galeri Foto</span></li>
              </ul>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Halo FluxWedding, saya ingin pesan paket Basic.")}`} className="block w-full py-4 bg-slate-800 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-slate-700 transition">Pilih Paket</a>
            </div>

            {/* PREMIUM */}
            <div className="bg-gradient-to-b from-amber-600 to-amber-800 p-8 md:p-10 rounded-[2.5rem] md:rounded-[2rem] text-center shadow-2xl shadow-amber-900/40 relative transform md:-translate-y-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-amber-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-4 md:px-5 py-2 rounded-full whitespace-nowrap">Paling Diminati</div>
              <h3 className="text-2xl md:text-3xl font-serif text-white mb-2 mt-2">Premium</h3>
              <p className="text-amber-200 text-sm mb-6">Lengkap & Interaktif</p>
              <div className="mb-10 flex flex-col items-center">
                <span className="text-sm text-amber-200/60 line-through decoration-red-400 decoration-2 mb-1">Rp 199.000</span>
                <div className="text-5xl font-bold text-white">
                  Rp 129<span className="text-amber-300/60 text-2xl">.000</span>
                </div>
              </div>
              <ul className="text-left text-white space-y-4 mb-10 text-xs md:text-sm">
                <li className="flex gap-3"><span className="text-amber-200">✓</span><span>Aktif 6 bulan</span></li>
                <li className="flex gap-3"><span className="text-amber-200">✓</span><span>Semua fitur Basic</span></li>
                <li className="flex gap-3 font-semibold"><span>✨</span><span>Galeri Foto (maks 5)</span></li>
                <li className="flex gap-3 font-semibold"><span>✨</span><span>Dashboard RSVP</span></li>
                <li className="flex gap-3 font-semibold"><span>✨</span><span>Sapa Nama Tamu</span></li>
                <li className="flex gap-3 font-semibold"><span>✨</span><span>Edit Mandiri 24/7</span></li>
                <li className="flex gap-3 opacity-70"><span>✕</span><span>Export PDF & Love Story</span></li>
              </ul>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Halo FluxWedding, saya ingin pesan paket Premium.")}`} className="block w-full py-4 md:py-5 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-white hover:text-slate-900 transition shadow-lg">Pilih Premium</a>
            </div>

            {/* EXCLUSIVE */}
            <div className="bg-slate-900 border border-slate-800 p-8 md:p-9 rounded-[2.5rem] md:rounded-[2rem] text-center hover:border-slate-700 transition hover:-translate-y-2">
              <h3 className="text-xl md:text-2xl font-serif text-white mb-2">Exclusive</h3>
              <p className="text-slate-400 text-sm mb-6">Fasilitas Sang Sultan</p>
              <div className="mb-8 flex flex-col items-center">
                <span className="text-sm text-slate-500 line-through decoration-red-500/50 decoration-2 mb-1">Rp 349.000</span>
                <div className="text-4xl font-bold text-white">
                  Rp 199<span className="text-slate-500 text-xl">.000</span>
                </div>
              </div>
              <ul className="text-left text-slate-300 space-y-4 mb-10 text-xs md:text-sm">
                <li className="flex gap-3"><span className="text-amber-500">✓</span><span>Aktif 1 tahun</span></li>
                <li className="flex gap-3"><span className="text-amber-500">✓</span><span>Semua fitur Premium</span></li>
                <li className="flex gap-3"><span>👑</span><span className="text-amber-200 font-semibold">Galeri Foto (10)</span></li>
                <li className="flex gap-3"><span>👑</span><span className="text-amber-200 font-semibold">Love Story Timeline</span></li>
                <li className="flex gap-3"><span>👑</span><span className="text-amber-200 font-semibold">Tata Tertib Acara</span></li>
                <li className="flex gap-3"><span>👑</span><span className="text-amber-200 font-semibold">Export Data Tamu PDF</span></li>
              </ul>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Halo FluxWedding, saya ingin pesan paket Exclusive.")}`} className="block w-full py-4 bg-slate-800 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-slate-700 transition">Pilih Exclusive</a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white py-14 border-t border-slate-100 text-center px-6">
        <div className="text-xl md:text-2xl font-serif font-bold flex items-center justify-center gap-2 mb-4">
          <span className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-[10px] md:text-xs">✨</span>
          Flux<span className="italic text-amber-600">Wedding</span>
        </div>
        <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto mb-6 leading-relaxed">
          Membantu pasangan membagikan kabar bahagia dengan cara yang elegan, praktis, dan bebas stres.
        </p>
        <p className="text-[10px] md:text-[11px] text-slate-400 uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} FluxWedding.id
        </p>
      </footer>

    </div>
  );
}