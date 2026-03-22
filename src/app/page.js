'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  const waNumber = "6287725266562"; 
  const waText = "Halo FluxWedding, saya tertarik untuk membuat undangan digital eksklusif.";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-amber-200 overflow-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-serif font-bold text-slate-900 tracking-wider flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-sm shadow-md">✨</span>
            Flux<span className="text-amber-600 italic">Wedding</span>
          </div>
          <div className="hidden md:flex gap-8 text-xs font-bold tracking-widest uppercase text-slate-500">
            <a href="#fitur" className="hover:text-amber-600 transition-colors">Keunggulan</a>
            <a href="#langkah" className="hover:text-amber-600 transition-colors">Cara Kerja</a>
            <a href="#harga" className="hover:text-amber-600 transition-colors">Paket & Harga</a>
          </div>
          <a 
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-600/30 active:scale-95"
          >
            Pesan Sekarang
          </a>
        </div>
      </nav>

      {/* HERO SECTION (Dipercantik dengan nuansa Luxury) */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 flex flex-col items-center text-center">
        {/* Latar Belakang Estetik */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[600px] bg-gradient-to-b from-amber-100/60 to-transparent rounded-full blur-[120px] -z-10"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none z-0"></div>
        
        <motion.span 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="relative z-10 text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase text-amber-700 mb-8 block bg-amber-50/80 backdrop-blur-sm px-6 py-2.5 rounded-full border border-amber-200/60 inline-flex items-center gap-2 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Pelopor Undangan Digital Premium
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-5xl md:text-7xl lg:text-8xl font-serif text-slate-900 mb-8 max-w-5xl leading-[1.1] tracking-tight drop-shadow-sm"
        >
          Kesan Pertama yang <span className="italic text-amber-600">Tak Terlupakan</span> untuk Hari Bahagia Anda.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 text-base md:text-xl text-slate-500 max-w-2xl mb-12 font-light leading-relaxed"
        >
          Bukan sekadar informasi acara. Sebarkan kebahagiaan dengan undangan digital interaktif yang elegan, menceritakan kisah cinta Anda, dan memanjakan tamu undangan.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="relative z-10 flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
        >
          <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`} target="_blank" className="px-10 py-4 sm:py-5 bg-slate-900 text-white font-bold uppercase tracking-widest text-xs sm:text-sm rounded-full shadow-xl hover:bg-amber-600 hover:shadow-amber-600/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 w-full sm:w-auto">
            Mulai Buat Undangan <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </a>
          <a href="#fitur" className="px-10 py-4 sm:py-5 bg-white text-slate-700 border border-slate-200 font-bold uppercase tracking-widest text-xs sm:text-sm rounded-full hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center w-full sm:w-auto">
            Lihat Fitur Sultan
          </a>
        </motion.div>
      </section>

      {/* FITUR SECTION (Update Teks sesuai fitur yang baru kita buat) */}
      <section id="fitur" className="py-24 bg-white px-6 relative z-20 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-amber-500 mb-4 block">Teknologi Terkini</span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">Fitur Kelas Premium</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Dilengkapi dengan fitur canggih layaknya asisten pernikahan pribadi Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Dasbor RSVP & Export PDF', desc: 'Pantau kehadiran tamu secara real-time. Tersedia fitur kelola pesan dan export dokumen PDF siap cetak dengan kop surat resmi.', icon: '📊' },
              { title: 'Love Story Timeline', desc: 'Ceritakan perjalanan cinta Anda dari awal bertemu hingga pelaminan dalam desain garis waktu (timeline) yang sangat estetik.', icon: '💌' },
              { title: 'Personalisasi Tata Tertib', desc: 'Beri panduan kepada tamu dengan ikon elegan (Dresscode, Tanpa Anak Kecil, Tepat Waktu) tanpa mengurangi kesopanan.', icon: '📋' },
              { title: 'Save to Google Calendar', desc: 'Tamu tidak akan lupa jadwal acara Anda berkat tombol sinkronisasi otomatis ke kalender di ponsel mereka.', icon: '📅' },
              { title: 'Kado Digital & Bank', desc: 'Mudahkan tamu memberikan tanda kasih dari jarak jauh melalui dompet digital atau transfer bank lengkap dengan fitur Salin Instan.', icon: '🎁' },
              { title: 'Magic Edit Mandiri', desc: 'Ubah foto, revisi nama, atau ganti lagu kapan saja sesuka hati tanpa perlu menunggu bantuan admin kami.', icon: '🪄' },
            ].map((fitur, idx) => (
              <motion.div 
                key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:border-amber-200 hover:shadow-2xl hover:shadow-amber-100/50 hover:-translate-y-2 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">{fitur.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 font-serif">{fitur.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{fitur.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LANGKAH / CARA KERJA SECTION (BARU) */}
      <section id="langkah" className="py-24 bg-slate-50 px-6 border-t border-slate-200/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">3 Langkah Mudah</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Tidak perlu pusing memikirkan desain. Sistem kami yang akan bekerja untuk Anda.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[15%] w-[70%] h-0.5 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 z-0 border-t border-dashed border-amber-500/50"></div>
            {[
              { step: '1', title: 'Pilih Paket', desc: 'Konsultasikan kebutuhan Anda dengan admin kami via WhatsApp lalu dapatkan Akses Khusus.' },
              { step: '2', title: 'Isi Data & Foto', desc: 'Isi form interaktif dari HP Anda. Sistem akan merakit undangan Anda secara otomatis.' },
              { step: '3', title: 'Sebarkan!', desc: 'Undangan digital eksklusif Anda siap disebarkan ke seluruh tamu kerabat & keluarga.' }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-amber-100 flex items-center justify-center text-3xl font-bold text-amber-600 shadow-xl mb-6 font-serif italic">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION (Teks Diperbarui Sesuai Sistem Baru) */}
      <section id="harga" className="py-24 bg-slate-950 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-xs font-bold tracking-[0.4em] uppercase text-amber-500 mb-4 block">Investasi Momen</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Pilihan Paket</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Harga transparan untuk mahakarya yang akan selalu dikenang.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Paket Basic */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-center hover:border-slate-700 transition-colors">
              <h3 className="text-2xl font-serif text-white mb-2">Basic</h3>
              <p className="text-slate-400 text-sm mb-6">Simple & Elegan</p>
              <div className="text-4xl font-bold text-white mb-8">Rp 99<span className="text-xl text-slate-500 font-normal">.000</span></div>
              <ul className="text-left text-slate-300 space-y-4 mb-8 text-sm">
                <li className="flex items-start gap-3"><span className="text-amber-500">✓</span> <span>Masa aktif 3 Bulan</span></li>
                <li className="flex items-start gap-3"><span className="text-amber-500">✓</span> <span>Animasi & Musik Background</span></li>
                <li className="flex items-start gap-3"><span className="text-amber-500">✓</span> <span>Hitung Mundur (Countdown)</span></li>
                <li className="flex items-start gap-3"><span className="text-amber-500">✓</span> <span>Navigasi Peta (Google Maps)</span></li>
                <li className="flex items-start gap-3"><span className="text-amber-500">✓</span> <span>Kutipan Ayat Suci / Quotes</span></li>
                <li className="flex items-start gap-3 opacity-40"><span className="text-slate-600">✕</span> <span>Dasbor RSVP & Buku Tamu</span></li>
                <li className="flex items-start gap-3 opacity-40"><span className="text-slate-600">✕</span> <span>Galeri Pre-Wedding</span></li>
              </ul>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Halo FluxWedding, saya mau pesan undangan paket Basic.")}`} className="block w-full py-4 bg-slate-800 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-700 transition-colors">Pilih Basic</a>
            </div>

            {/* Paket Premium (Highlight) */}
            <div className="bg-gradient-to-b from-amber-600 to-amber-800 p-8 py-12 rounded-[2.5rem] text-center shadow-2xl shadow-amber-900/50 relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-amber-400 text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-full border border-amber-500/30 whitespace-nowrap shadow-lg">Paling Diminati</div>
              <h3 className="text-3xl font-serif text-white mb-2">Premium</h3>
              <p className="text-amber-200 text-sm mb-6">Lengkap & Interaktif</p>
              <div className="text-5xl font-bold text-white mb-8">Rp 199<span className="text-2xl text-amber-300/50 font-normal">.000</span></div>
              <ul className="text-left text-white space-y-4 mb-10 text-sm">
                <li className="flex items-start gap-3"><span className="text-amber-300">✓</span> <span>Masa aktif 6 Bulan</span></li>
                <li className="flex items-start gap-3"><span className="text-amber-300">✓</span> <span>Semua Fitur Basic</span></li>
                <li className="flex items-start gap-3 font-bold text-amber-100"><span>✨</span> <span>Galeri Foto (Maksimal 5)</span></li>
                <li className="flex items-start gap-3 font-bold text-amber-100"><span>✨</span> <span>Dasbor RSVP & Sensor Pesan</span></li>
                <li className="flex items-start gap-3 font-bold text-amber-100"><span>✨</span> <span>Kado Digital (Bank/E-Wallet)</span></li>
                <li className="flex items-start gap-3 font-bold text-amber-100"><span>✨</span> <span>Save to Google Calendar</span></li>
                <li className="flex items-start gap-3 font-bold text-amber-100"><span>✨</span> <span>Akses Edit Mandiri 24/7</span></li>
                <li className="flex items-start gap-3 opacity-60"><span className="text-amber-900">✕</span> <span>Export Cetak PDF & Love Story</span></li>
              </ul>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Halo FluxWedding, saya mau pesan undangan paket Premium.")}`} className="block w-full py-4 sm:py-5 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-slate-900 transition-colors shadow-xl">Pilih Premium</a>
            </div>

            {/* Paket Exclusive */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-center hover:border-slate-700 transition-colors">
              <h3 className="text-2xl font-serif text-white mb-2">Exclusive</h3>
              <p className="text-slate-400 text-sm mb-6">Fasilitas Sang Sultan</p>
              <div className="text-4xl font-bold text-white mb-8">Rp 349<span className="text-xl text-slate-500 font-normal">.000</span></div>
              <ul className="text-left text-slate-300 space-y-4 mb-8 text-sm">
                <li className="flex items-start gap-3"><span className="text-amber-500">✓</span> <span>Aktif 1 Tahun (Selamanya)</span></li>
                <li className="flex items-start gap-3"><span className="text-amber-500">✓</span> <span>Semua Fitur Premium</span></li>
                <li className="flex items-start gap-3"><span>👑</span> <span className="text-amber-200 font-bold">Galeri Foto Maks 10</span></li>
                <li className="flex items-start gap-3"><span>👑</span> <span className="text-amber-200 font-bold">Love Story Timeline</span></li>
                <li className="flex items-start gap-3"><span>👑</span> <span className="text-amber-200 font-bold">Tata Tertib (House Rules)</span></li>
                <li className="flex items-start gap-3"><span>👑</span> <span className="text-amber-200 font-bold">Cetak Rekap Tamu (PDF)</span></li>
                <li className="flex items-start gap-3"><span>👑</span> <span className="text-amber-200 font-bold">Alamat Kado Fisik Spesial</span></li>
              </ul>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Halo FluxWedding, saya siap menjadi Sultan dengan paket Exclusive!")}`} className="block w-full py-4 bg-slate-800 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-700 transition-colors">Pilih Exclusive</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-12 px-6 border-t border-slate-100 text-center relative z-20">
        <div className="text-2xl font-serif font-bold text-slate-900 tracking-wider mb-4 flex items-center justify-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-[10px]">✨</span>
          Flux<span className="text-amber-600 italic">Wedding</span>
        </div>
        <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto leading-relaxed">Membantu pasangan membagikan kabar bahagia dengan cara yang lebih elegan, praktis, dan memukau.</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">© {new Date().getFullYear()} FluxWedding.id. All rights reserved.</p>
      </footer>
    </div>
  );
}