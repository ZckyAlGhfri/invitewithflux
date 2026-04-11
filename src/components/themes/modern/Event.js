'use client';
import Reveal from '@/components/Reveal';

export default function Event({ data, timeLeft, colorVariant }) {
  if (!data) return null;

  const themeStyles = {
    slate: { textMain: "text-slate-400", border: "border-slate-400", bgHover: "hover:bg-slate-700" },
    indigo: { textMain: "text-indigo-500", border: "border-indigo-500", bgHover: "hover:bg-indigo-600" },
    rose: { textMain: "text-rose-500", border: "border-rose-500", bgHover: "hover:bg-rose-600" },
    teal: { textMain: "text-teal-400", border: "border-teal-400", bgHover: "hover:bg-teal-600" },
    amber: { textMain: "text-amber-500", border: "border-amber-500", bgHover: "hover:bg-amber-600" }
  };
  const c = themeStyles[colorVariant] || themeStyles.slate;

  const getDay = (date) => new Date(date).getDate();
  const getMonthYear = (date) => new Date(date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }).toUpperCase();
  const isPremiumOrAbove = data.tier === 'premium' || data.tier === 'exclusive';

  const EventCard = ({ title, date, time, loc, link }) => (
    <div className={`group relative bg-stone-900 p-10 border-t-4 ${c.border} ${c.bgHover} transition-all duration-500 h-full flex flex-col`}>
      <h3 className="text-xs font-black uppercase tracking-[0.5em] text-white/40 group-hover:text-white/60 mb-10 transition-colors">
        {title}
      </h3>
      <div className="flex items-start gap-4 mb-10">
        <span className="text-7xl font-black leading-none tracking-tighter text-white">{getDay(date)}</span>
        <div className="flex flex-col">
          <span className={`text-lg font-bold ${c.textMain} group-hover:text-white transition-colors`}>{getMonthYear(date)}</span>
          <span className="text-xs font-medium text-white/50 group-hover:text-white/70 uppercase tracking-widest">{time} WIB</span>
        </div>
      </div>
      <p className="text-sm font-bold uppercase tracking-tight text-white mb-12 flex-1">{loc}</p>
      <a href={link} target="_blank" className="inline-block w-full py-4 border-2 border-white/20 text-white text-center text-[10px] font-black uppercase tracking-[0.3em] group-hover:border-white transition-all">
        Open Maps
      </a>
    </div>
  );

  return (
    <section id="event" className="py-32 bg-black text-white px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 flex flex-col justify-center">
            <Reveal direction="down">
              <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-12">
                Countdown <br/> <span className="text-white/20">to the day</span>
              </h2>
            </Reveal>
            {timeLeft && (
              <div className="grid grid-cols-2 gap-4">
                {[{l:'Days', v:timeLeft.days}, {l:'Hrs', v:timeLeft.hours}, {l:'Min', v:timeLeft.minutes}, {l:'Sec', v:timeLeft.seconds}].map((t, i) => (
                  <div key={i} className="bg-stone-900 p-6 flex flex-col border border-white/5">
                    <span className={`text-3xl font-black ${c.textMain}`}>{String(t.v).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase font-bold tracking-widest text-white/30">{t.l}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Reveal direction="right" className="lg:col-span-1">
            <EventCard title="The Ceremony" date={data.tanggal_akad} time={data.waktu_akad} loc={data.tempat_akad} link={data.map_link_akad} />
          </Reveal>
          <Reveal direction="right" delay={0.2} className="lg:col-span-1">
            <EventCard title="The Celebration" date={data.tanggal_resepsi} time={data.waktu_resepsi} loc={data.tempat_resepsi} link={data.map_link_resepsi} />
          </Reveal>

        </div>
      </div>
    </section>
  );
}