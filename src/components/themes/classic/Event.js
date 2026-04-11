'use client';
import Reveal from '@/components/Reveal';

export default function Event({ data, timeLeft, colorVariant }) {
  if (!data) return null;

  // ================= KAMUS WARNA =================
  const themeStyles = {
    emerald: { main: "text-emerald-900", muted: "text-emerald-600", accent: "text-emerald-500", borderLight: "border-emerald-200", borderDark: "border-emerald-300", bgLight: "bg-emerald-50", btn: "bg-emerald-900 hover:bg-emerald-800 text-white", btnOutline: "border-emerald-900 text-emerald-900 hover:bg-emerald-900 hover:text-white" },
    sapphire: { main: "text-blue-900", muted: "text-blue-600", accent: "text-blue-500", borderLight: "border-blue-200", borderDark: "border-blue-300", bgLight: "bg-blue-50", btn: "bg-blue-900 hover:bg-blue-800 text-white", btnOutline: "border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white" },
    ruby: { main: "text-rose-900", muted: "text-rose-600", accent: "text-rose-500", borderLight: "border-rose-200", borderDark: "border-rose-300", bgLight: "bg-rose-50", btn: "bg-rose-900 hover:bg-rose-800 text-white", btnOutline: "border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white" },
    gold: { main: "text-amber-900", muted: "text-amber-600", accent: "text-amber-500", borderLight: "border-amber-200", borderDark: "border-amber-300", bgLight: "bg-amber-50", btn: "bg-amber-900 hover:bg-amber-800 text-white", btnOutline: "border-amber-900 text-amber-900 hover:bg-amber-900 hover:text-white" },
    monochrome: { main: "text-stone-900", muted: "text-stone-500", accent: "text-stone-400", borderLight: "border-stone-200", borderDark: "border-stone-300", bgLight: "bg-stone-50", btn: "bg-stone-800 hover:bg-stone-600 text-white", btnOutline: "border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white" }
  };
  const c = themeStyles[colorVariant] || themeStyles.monochrome;
  // ===============================================

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  let parsedRules = [];
  try { parsedRules = data.house_rules ? (typeof data.house_rules === 'string' ? JSON.parse(data.house_rules) : data.house_rules) : []; } catch(e){}
  const isPremiumOrAbove = data.tier === 'premium' || data.tier === 'exclusive';
  
  const generateGCalLink = (title, date, time, location) => {
    if (!date || !time) return '#';
    try {
      const startDt = new Date(`${date}T${time}:00+07:00`); 
      const endDt = new Date(startDt.getTime() + 2 * 60 * 60 * 1000);
      const formatDt = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDt(startDt)}/${formatDt(endDt)}&location=${encodeURIComponent(location)}`;
    } catch(e) { return '#'; }
  };

  return (
    <section id="event" className={`py-24 bg-transparent ${c.main} relative`}>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <Reveal direction="down">
          <div className="text-center mb-16">
            <span className={`text-[10px] font-bold tracking-[0.4em] uppercase ${c.accent} mb-4 block`}>Save The Date</span>
            <h2 className={`text-4xl md:text-5xl font-serif ${c.main}`}>Momen Bersejarah</h2>
          </div>
        </Reveal>

        {timeLeft && (
          <div className="flex justify-center gap-4 md:gap-8 mb-24">
            {[{l: 'Hari', v: timeLeft.days}, {l: 'Jam', v: timeLeft.hours}, {l: 'Menit', v: timeLeft.minutes}, {l: 'Detik', v: timeLeft.seconds}].map((t, i) => (
              <Reveal key={i} direction="up" delay={i * 0.1}>
                <div className={`flex flex-col items-center justify-center p-4 border-y ${c.borderDark} w-16 md:w-24 bg-white/50`}>
                  <span className={`text-3xl md:text-4xl font-serif ${c.main} mb-1`}>{String(t.v).padStart(2, '0')}</span>
                  <span className={`text-[8px] md:text-[10px] uppercase tracking-widest ${c.muted} font-bold`}>{t.l}</span>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[{ title: 'Akad Nikah', date: data.tanggal_akad, time: data.waktu_akad, loc: data.tempat_akad, link: data.map_link_akad },
            { title: 'Resepsi', date: data.tanggal_resepsi, time: data.waktu_resepsi, loc: data.tempat_resepsi, link: data.map_link_resepsi }].map((ev, i) => (
            <Reveal key={i} direction={i === 0 ? "right" : "left"}>
              <div className={`bg-white border ${c.borderLight} p-10 text-center shadow-sm relative overflow-hidden h-full flex flex-col`}>
                <div className={`absolute top-2 left-2 right-2 bottom-2 border ${c.borderLight} opacity-50 pointer-events-none`}></div>
                <h3 className={`text-3xl font-serif mb-6 ${c.main} relative z-10`}>{ev.title}</h3>
                <p className={`${c.muted} font-bold uppercase tracking-widest text-xs mb-2 relative z-10`}>{formatDate(ev.date)}</p>
                <p className={`text-xl ${c.main} font-serif italic mb-8 relative z-10`}>Pukul {ev.time || formatTime(ev.date)} WIB</p>
                <p className={`${c.muted} font-medium text-sm mb-10 leading-relaxed max-w-sm mx-auto relative z-10`}>{ev.loc}</p>
                
                <div className="mt-auto flex flex-col sm:flex-row gap-3 justify-center relative z-10">
                  <a href={ev.link} target="_blank" className={`px-6 py-3 border ${c.btnOutline} text-[10px] font-bold uppercase tracking-widest transition-colors`}>Google Maps</a>
                  {isPremiumOrAbove && (
                    <a href={generateGCalLink(`${ev.title} ${data.nama_wanita}&${data.nama_pria}`, ev.date, ev.time, ev.loc)} target="_blank" className={`px-6 py-3 ${c.btn} text-[10px] font-bold uppercase tracking-widest transition-colors`}>Simpan Kalender</a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {parsedRules.length > 0 && (
          <div className={`mt-24 border-t ${c.borderLight} pt-20`}>
            <Reveal direction="up">
              <h3 className={`text-2xl font-serif ${c.main} text-center mb-12`}>Tata Tertib Acara</h3>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
              {parsedRules.map((r, i) => (
                <Reveal key={i} delay={i*0.1} direction="up">
                  <div className="flex flex-col items-center">
                    <p className={`${c.muted} text-sm uppercase tracking-widest border-b ${c.borderDark} pb-2`}>{r.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}