'use client';
import Reveal from '@/components/Reveal';

export default function Event({ data, timeLeft }) {
  if (!data) return null;

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  
  // Helper Icon Tata Tertib
  const getRuleIcon = (iconName) => {
    switch (iconName) {
      case 'clock': return <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>;
      case 'kids': return <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"/></svg>;
      case 'camera': return <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"/></svg>;
      case 'dress': return <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/></svg>;
      case 'mask': return <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z"/></svg>;
      case 'phone': return <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/></svg>;
      case 'gift': return <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"/></svg>;
      case 'food': return <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L4.2 15.3m15.6 0v1.473c0 .51-.392.931-.893.992a22.65 22.65 0 0 1-13.814 0c-.5-.06-.893-.482-.893-.992V15.3m15.6 0a48.666 48.666 0 0 0-15.6 0"/></svg>;
      case 'warning': return <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z"/></svg>;
      case 'info': return <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"/></svg>;
      case 'love': return <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/></svg>;
      default: return <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>;
    }
  };

  // Parsing JSONB
  let parsedRules = [];
  if (data.house_rules) {
    try { parsedRules = typeof data.house_rules === 'string' ? JSON.parse(data.house_rules) : data.house_rules; } 
    catch (e) { parsedRules = []; }
  }

  // TIER LOGIC
  const isPremiumOrAbove = data.tier === 'premium' || data.tier === 'exclusive';

  // GENERATOR GOOGLE CALENDAR LINK
  const generateGCalLink = (title, date, time, location) => {
    if (!date || !time) return '#';
    try {
      const startDt = new Date(`${date}T${time}:00+07:00`); 
      const endDt = new Date(startDt.getTime() + 2 * 60 * 60 * 1000); // Acara 2 jam
      const formatDt = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDt(startDt)}/${formatDt(endDt)}&location=${encodeURIComponent(location)}`;
    } catch(e) { return '#'; }
  };

  return (
    <section id="event" className="py-32 bg-slate-950 text-white relative">
      <div className="absolute inset-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>    
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-20">
          <Reveal direction="down">
            <span className="text-xs font-bold tracking-[0.4em] uppercase text-amber-400 mb-4 block">Save The Date</span>
            <h2 className="text-5xl md:text-6xl font-serif italic text-white">Momen Bersejarah</h2>
          </Reveal>
        </div>
          
        {/* THE GRAND COUNTDOWN */}
        {timeLeft && (
          <div className="flex justify-center gap-4 md:gap-10 mb-28">
            {[
              { label: 'Hari', value: timeLeft.days }, { label: 'Jam', value: timeLeft.hours },
              { label: 'Menit', value: timeLeft.minutes }, { label: 'Detik', value: timeLeft.seconds }
            ].map((time, idx) => (
              <Reveal key={idx} direction="up" delay={idx * 0.1}>
                <div className="w-20 h-24 md:w-32 md:h-36 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-amber-400/50 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <span className="text-4xl md:text-5xl font-serif text-amber-300 mb-2">{String(time.value || 0).padStart(2, '0')}</span>
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/50 font-bold">{time.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* KARTU ACARA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Reveal direction="right">
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-8 md:p-14 rounded-[3rem] text-center shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-colors duration-500 flex flex-col h-full justify-center">
              <div className="w-1 h-full bg-amber-500 absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="w-16 h-16 mx-auto mb-6 text-amber-400/30">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.1-.96-2.11-1.66H8.1c.04 1.52 1.04 2.73 2.8 3.12V20h2.36v-1.66c1.83-.31 3.01-1.4 3.01-3.1 0-2.2-1.73-2.8-3.96-3.35z"/></svg>
              </div>
              <h3 className="text-4xl md:text-5xl font-serif mb-6 text-amber-100">Akad Nikah</h3>
              <div className="space-y-3 mb-10">
                <p className="text-amber-400 font-bold uppercase tracking-widest text-sm">{formatDate(data.tanggal_akad)}</p>
                <p className="text-2xl text-white font-light">Pukul {data.waktu_akad || formatTime(data.tanggal_akad)} WIB</p>
              </div>
              <p className="text-slate-400 font-medium mb-12 leading-relaxed text-sm md:text-base max-w-sm mx-auto">{data.tempat_akad}</p>
              
              {/* BUTTON GROUP */}
              <div className="mt-auto flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={data.map_link_akad} target="_blank" className="w-full sm:w-auto px-8 py-4 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-slate-900 transition-colors shadow-lg shadow-amber-900/50">Google Maps</a>
                {isPremiumOrAbove && (
                  <a href={generateGCalLink(`Akad Nikah ${data.nama_wanita} & ${data.nama_pria}`, data.tanggal_akad, data.waktu_akad, data.tempat_akad)} target="_blank" className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-slate-700 transition-colors border border-slate-700 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> Save to Calendar
                  </a>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal direction="left">
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-8 md:p-14 rounded-[3rem] text-center shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-colors duration-500 flex flex-col h-full justify-center">
              <div className="w-1 h-full bg-amber-500 absolute left-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="w-16 h-16 mx-auto mb-6 text-amber-400/30">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
              </div>
              <h3 className="text-4xl md:text-5xl font-serif mb-6 text-amber-100">Resepsi</h3>
              <div className="space-y-3 mb-10">
                <p className="text-amber-400 font-bold uppercase tracking-widest text-sm">{formatDate(data.tanggal_resepsi)}</p>
                <p className="text-2xl text-white font-light">Pukul {data.waktu_resepsi || formatTime(data.tanggal_resepsi)} WIB</p>
              </div>
              <p className="text-slate-400 font-medium mb-12 leading-relaxed text-sm md:text-base max-w-sm mx-auto">{data.tempat_resepsi}</p>
              
              {/* BUTTON GROUP */}
              <div className="mt-auto flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={data.map_link_resepsi} target="_blank" className="w-full sm:w-auto px-8 py-4 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-slate-900 transition-colors shadow-lg shadow-amber-900/50">Google Maps</a>
                {isPremiumOrAbove && (
                  <a href={generateGCalLink(`Resepsi Nikah ${data.nama_wanita} & ${data.nama_pria}`, data.tanggal_resepsi, data.waktu_resepsi, data.tempat_resepsi)} target="_blank" className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-slate-700 transition-colors border border-slate-700 flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> Save to Calendar
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        {/* TATA TERTIB ACARA */}
        {parsedRules && parsedRules.length > 0 && (
          <div className="mt-32 max-w-4xl mx-auto px-4">
            <Reveal direction="up">
              <div className="text-center mb-16">
                <p className="text-xs font-bold tracking-[0.4em] uppercase text-amber-400 mb-4 block">House Rules</p>
                <h3 className="text-3xl md:text-4xl font-serif italic text-white">Tata Tertib Acara</h3>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {parsedRules.map((rule, idx) => (
                <Reveal key={idx} delay={idx * 0.1} direction="up">
                  <div className="flex flex-col items-center text-center p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-[2rem] hover:bg-slate-800/50 transition-colors h-full">
                    <div className="w-12 h-12 mb-5 text-amber-500 opacity-80">
                      {getRuleIcon(rule.icon)}
                    </div>
                    <p className="text-slate-300 text-sm font-medium leading-relaxed">{rule.text}</p>
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