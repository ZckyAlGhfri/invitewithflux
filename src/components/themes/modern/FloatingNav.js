'use client';
import { motion } from 'framer-motion';

export default function FloatingNav({ isOpened, colorVariant, showRsvp = true }) {
  const navItems = [
    { name: 'HOME', link: '#hero' },
    { name: 'COUPLE', link: '#couple' },
    { name: 'EVENT', link: '#event' },
    { name: 'GIFT', link: '#gift' },
    { name: 'RSVP', link: '#rsvp' }
  ].filter((item) => showRsvp || item.name !== 'RSVP');

  const themeStyles = {
    slate: "hover:bg-slate-500",
    indigo: "hover:bg-indigo-500",
    rose: "hover:bg-rose-500",
    teal: "hover:bg-teal-500",
    amber: "hover:bg-amber-500"
  };
  const hoverBg = themeStyles[colorVariant] || themeStyles.slate;

  return (
    <motion.nav 
      initial={{ opacity: 0, y: 50 }}
      animate={isOpened ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[90] w-max"
    >
      <div className="flex bg-stone-900 border border-white/10 p-1 shadow-2xl">
        {navItems.map((item) => (
          <a 
            key={item.name} 
            href={item.link}
            className={`px-4 py-3 text-[8px] font-black text-white/40 hover:text-white ${hoverBg} transition-all tracking-[0.3em] flex items-center justify-center border-r border-white/5 last:border-0`}
          >
            {item.name}
          </a>
        ))}
      </div>
    </motion.nav>
  );
}
