'use client';
import { useState, useEffect } from 'react';

export default function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeBox = (value, label) => (
    <div className="flex flex-col items-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm min-w-20 md:min-w-25 border border-slate-100">
      <span className="text-3xl md:text-4xl font-serif text-slate-800 font-bold">{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{label}</span>
    </div>
  );

  return (
    <div className="flex gap-3 md:gap-6 justify-center py-10 animate-fade-in">
      {timeBox(timeLeft.days, 'Hari')}
      {timeBox(timeLeft.hours, 'Jam')}
      {timeBox(timeLeft.minutes, 'Menit')}
      {timeBox(timeLeft.seconds, 'Detik')}
    </div>
  );
}