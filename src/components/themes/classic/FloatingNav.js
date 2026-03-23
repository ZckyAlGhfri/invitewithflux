'use client';
import { motion } from 'framer-motion';

export default function FloatingNav({ isOpened }) {
  const navItems = [
    { name: 'Home', link: '#hero', icon: 'H' },
    { name: 'Couple', link: '#couple', icon: 'C' },
    { name: 'Event', link: '#event', icon: 'E' },
    { name: 'Gift', link: '#gift', icon: 'G' },
    { name: 'RSVP', link: '#rsvp', icon: 'R' }
  ];

  return (
    <motion.nav 
      initial={{ opacity: 0, y: 100 }} animate={isOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }} transition={{ delay: 1, duration: 0.8 }}
      className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2"
    >
      <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md px-6 py-3 border border-stone-300 shadow-xl">
        {navItems.map((item) => (
          <a key={item.name} href={item.link} className="flex flex-col items-center justify-center text-stone-400 hover:text-stone-900 transition-colors">
            <span className="text-sm font-serif italic mb-0.5">{item.icon}</span>
            <span className="text-[7px] uppercase tracking-[0.2em]">{item.name}</span>
          </a>
        ))}
      </div>
    </motion.nav>
  );
}