'use client';
import { motion } from 'framer-motion';

export default function FloatingNav({ isOpened, colorVariant }) {
  // ================= KAMUS WARNA =================
  const themeStyles = {
    gold: { textHover: "hover:text-amber-600" },
    silver: { textHover: "hover:text-slate-600" },
    'rose-gold': { textHover: "hover:text-rose-600" }
  };
  const currentStyle = themeStyles[colorVariant] || themeStyles.gold;
  // ===============================================

  const navItems = [
    { name: 'Home', link: '#countdown', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    )},
    { name: 'Couple', link: '#couple', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
    )},
    { name: 'Event', link: '#event', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
    )},
    { name: 'Gift', link: '#gift', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="6" rx="2"/><line x1="12" x2="12" y1="6" y2="20"/><line x1="2" x2="22" y1="12" y2="12"/></svg>
    )},
    { name: 'RSVP', link: '#guestbook', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    )}
  ];

  return (
    <motion.nav 
      initial={{ opacity: 0, y: 100 }}
      animate={isOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2"
    >
      <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md px-3 py-2 rounded-full shadow-2xl border border-slate-100">
        {navItems.map((item) => (
          <a 
            key={item.name} 
            href={item.link}
            className={`flex flex-col items-center justify-center text-slate-500 ${currentStyle.textHover} px-3 py-1 rounded-full transition-colors group`}
          >
            <span className="scale-100 group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="text-[8px] uppercase tracking-tighter mt-1 font-medium">{item.name}</span>
          </a>
        ))}
      </div>
    </motion.nav>
  );
}