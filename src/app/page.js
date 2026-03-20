'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  // Ganti dengan nomor WhatsApp Anda (Gunakan format 628...)
  const waNumber = "6287725266562"; 
  const waText = "Halo FluxWedding, saya tertarik untuk membuat undangan digital eksklusif.";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-amber-200">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-serif font-bold text-slate-900 tracking-wider">
            Flux<span className="text-amber-600 italic">Wedding</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-bold tracking-widest uppercase text-slate-500">
            <a href="#fitur" className="hover:text-amber-600 transition-colors">Fitur</a>
            <a href="#harga" className="hover:text-amber-600 transition-colors">Harga</a>
          </div>
          <a 
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-amber-600 transition-colors shadow-lg"
          >
            Pesan Sekarang
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-amber-100/50 rounded-full blur-[100px] -z-10"></div>
        
        <motion.span 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-xs font-bold tracking-[0.4em] uppercase text-amber-600 mb-6 block bg-amber-50 px-4 py-2 rounded-full border border-amber-200/50 inline-block"
        >
          Undangan Digital Premium
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-serif text-slate-900 mb-8 max-w-4xl leading-tight"
        >
          Kesan Pertama yang <span className="italic text-amber-600">Tak Terlupakan</span> untuk Hari Bahagia Anda.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-slate-500 max-w-2xl mb-12 font-light leading-relaxed"
        >
          Sebarkan kebahagiaan dengan undangan digital yang elegan, interaktif, dan mudah dibagikan. Desain eksklusif yang menceritakan kisah cinta Anda.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`} target="_blank" className="px-10 py-4 bg-slate-900 text-white font-bold uppercase tracking-widest text-sm rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:bg-amber-600 hover:shadow-[0_10px_40px_rgba(217,119,6,0.3)] transition-all hover:-translate-y-1">
            Buat Undangan Saya
          </a>
          <a href="#fitur" className="px-10 py-4 bg-white text-slate-800 border border-slate-200 font-bold uppercase tracking-widest text-sm rounded-full hover:border-slate-400 transition-all">
            Lihat Fitur
          </a>
        </motion.div>
      </section>

      {/* FITUR SECTION */}
      <section id="fitur" className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">Fitur Premium</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Semua yang Anda butuhkan untuk mengundang kerabat dengan cara yang modern dan berkelas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Desain Eksklusif', desc: 'Tampilan undangan yang mewah, elegan, dan didesain khusus agar tampil sempurna di semua perangkat.', icon: '✨' },
              { title: 'Amplop & Musik', desc: 'Sambut tamu Anda dengan animasi amplop digital dan alunan musik romantis yang otomatis berputar.', icon: '🎵' },
              { title: 'RSVP & Buku Tamu', desc: 'Ketahui siapa saja yang akan hadir dan terima ucapan doa restu secara real-time dari tamu Anda.', icon: '📖' },
              { title: 'Galeri Pre-Wedding', desc: 'Tampilkan momen-momen indah Anda bersama pasangan dalam galeri foto bergaya masonry yang estetik.', icon: '📸' },
              { title: 'Kado Digital', desc: 'Fitur dompet digital dan info rekening untuk memudahkan tamu memberikan tanda kasih dari jarak jauh.', icon: '🎁' },
              { title: 'Add to Calendar', desc: 'Tamu dapat menyimpan jadwal acara langsung ke Google Calendar mereka dengan satu kali klik.', icon: '📅' },
            ].map((fitur, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300"
              >
                <div className="text-4xl mb-6">{fitur.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{fitur.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{fitur.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="harga" className="py-24 bg-slate-950 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-xs font-bold tracking-[0.4em] uppercase text-amber-500 mb-4 block">Investasi Momen</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Pilihan Paket</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Pilih paket yang paling sesuai dengan kebutuhan pernikahan Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Paket Basic */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-center">
              <h3 className="text-2xl font-serif text-white mb-2">Basic</h3>
              <p className="text-slate-400 text-sm mb-6">Simple & Elegan</p>
              <div className="text-4xl font-bold text-white mb-8">Rp 99<span className="text-xl text-slate-500 font-normal">.000</span></div>
              <ul className="text-left text-slate-300 space-y-4 mb-8 text-sm">
                <li className="flex items-center gap-3">✅ Masa aktif 3 Bulan</li>
                <li className="flex items-center gap-3">✅ Animasi Amplop Digital</li>
                <li className="flex items-center gap-3">✅ Musik Background</li>
                <li className="flex items-center gap-3">✅ Hitung Mundur (Countdown)</li>
                <li className="flex items-center gap-3">✅ Navigasi Lokasi (Maps)</li>
                <li className="flex items-center gap-3 opacity-50">❌ Galeri Pre-Wedding</li>
                <li className="flex items-center gap-3 opacity-50">❌ RSVP & Buku Tamu</li>
                <li className="flex items-center gap-3 opacity-50">❌ Kado Digital</li>
              </ul>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Halo, saya mau pesan paket Basic.")}`} className="block w-full py-4 bg-slate-800 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-700 transition-colors">Pilih Basic</a>
            </div>

            {/* Paket Premium (Highlight) */}
            <div className="bg-gradient-to-b from-amber-600 to-amber-800 p-8 py-12 rounded-[2.5rem] text-center shadow-2xl shadow-amber-900/50 relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-amber-400 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-amber-500/30">Paling Diminati</div>
              <h3 className="text-3xl font-serif text-white mb-2">Premium</h3>
              <p className="text-amber-200 text-sm mb-6">Lengkap & Interaktif</p>
              <div className="text-5xl font-bold text-white mb-8">Rp 199<span className="text-2xl text-amber-300/50 font-normal">.000</span></div>
              <ul className="text-left text-white space-y-4 mb-10 text-sm">
                <li className="flex items-center gap-3">✅ Masa aktif 6 Bulan</li>
                <li className="flex items-center gap-3">✅ Semua Fitur Basic</li>
                <li className="flex items-center gap-3 font-bold text-amber-100">✨ Galeri Foto (Maks 10)</li>
                <li className="flex items-center gap-3 font-bold text-amber-100">✨ RSVP & Buku Tamu</li>
                <li className="flex items-center gap-3 font-bold text-amber-100">✨ Kado Digital (E-Wallet/Bank)</li>
                <li className="flex items-center gap-3 font-bold text-amber-100">✨ Magic Edit (Revisi Mandiri)</li>
                <li className="flex items-center gap-3 opacity-70 text-amber-200">❌ Custom Sub-Domain</li>
              </ul>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Halo, saya mau pesan paket Premium.")}`} className="block w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-slate-900 transition-colors">Pilih Premium</a>
            </div>

            {/* Paket Exclusive */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-center">
              <h3 className="text-2xl font-serif text-white mb-2">Exclusive</h3>
              <p className="text-slate-400 text-sm mb-6">Tanpa Batasan</p>
              <div className="text-4xl font-bold text-white mb-8">Rp 349<span className="text-xl text-slate-500 font-normal">.000</span></div>
              <ul className="text-left text-slate-300 space-y-4 mb-8 text-sm">
                <li className="flex items-center gap-3">✅ Masa aktif 1 Tahun (Selamanya)</li>
                <li className="flex items-center gap-3">✅ Semua Fitur Premium</li>
                <li className="flex items-center gap-3">✨ Galeri Foto Unlimited</li>
                <li className="flex items-center gap-3">✨ Alamat Kirim Kado Fisik</li>
                <li className="flex items-center gap-3">✨ Request Musik Custom</li>
                <li className="flex items-center gap-3 font-bold text-amber-400">✨ Custom Sub-Domain Eksklusif</li>
                <li className="flex items-center gap-3 font-bold text-amber-400">✨ Prioritas Support 24/7</li>
              </ul>
              <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Halo, saya mau pesan paket Exclusive.")}`} className="block w-full py-4 bg-slate-800 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-700 transition-colors">Pilih Exclusive</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-12 px-6 border-t border-slate-100 text-center">
        <div className="text-2xl font-serif font-bold text-slate-900 tracking-wider mb-4">
          Flux<span className="text-amber-600 italic">Wedding</span>
        </div>
        <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">Membantu pasangan membagikan kabar bahagia dengan cara yang lebih elegan, praktis, dan ramah lingkungan.</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">© {new Date().getFullYear()} FluxWedding.id. All rights reserved.</p>
      </footer>
    </div>
  );
}