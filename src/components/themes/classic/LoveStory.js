'use client';
import Reveal from '@/components/Reveal';

export default function LoveStory({ data, colorVariant }) {
  if (!data || !data.love_story) return null;
  let parsedStory = [];
  try { parsedStory = typeof data.love_story === 'string' ? JSON.parse(data.love_story) : data.love_story; } catch(e){}
  if (parsedStory.length === 0) return null;

  const themeStyles = {
    emerald: { main: "text-emerald-900", muted: "text-emerald-500", accent: "text-emerald-400", border: "border-emerald-200", dot: "bg-emerald-800", line: "bg-emerald-200" },
    sapphire: { main: "text-blue-900", muted: "text-blue-500", accent: "text-blue-400", border: "border-blue-200", dot: "bg-blue-800", line: "bg-blue-200" },
    ruby: { main: "text-rose-900", muted: "text-rose-500", accent: "text-rose-400", border: "border-rose-200", dot: "bg-rose-800", line: "bg-rose-200" },
    gold: { main: "text-amber-900", muted: "text-amber-500", accent: "text-amber-400", border: "border-amber-200", dot: "bg-amber-800", line: "bg-amber-200" },
    monochrome: { main: "text-stone-900", muted: "text-stone-500", accent: "text-stone-400", border: "border-stone-200", dot: "bg-stone-800", line: "bg-stone-200" }
  };
  const c = themeStyles[colorVariant] || themeStyles.monochrome;

  return (
    <section id="lovestory" className={`py-24 bg-white relative overflow-hidden border-b ${c.border}`}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <Reveal direction="down">
            <span className={`text-[10px] font-bold tracking-[0.4em] uppercase ${c.accent} mb-4 block`}>Perjalanan Cinta</span>
            <h2 className={`text-4xl font-serif ${c.main}`}>Kisah Kami</h2>
          </Reveal>
        </div>

        <div className={`grid grid-cols-1 gap-y-12 pl-8 relative before:absolute before:inset-y-0 before:left-0 before:w-px before:${c.line} md:grid-cols-[1fr,auto,1fr] md:pl-0 md:before:left-1/2 md:before:-translate-x-1/2`}>
          {parsedStory.map((story, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-start gap-y-4 md:gap-y-0 md:gap-x-12 group relative">
                <div className={`w-3 h-3 ${c.dot} rounded-full shrink-0 order-1 md:order-none md:col-start-2 md:col-end-3 relative z-10 mt-1.5 md:mx-auto ring-4 ring-white`}></div>
                <Reveal direction={isEven ? "left" : "right"} className={`flex flex-col gap-2 bg-transparent order-2 md:order-none ${isEven ? 'md:col-start-1 md:col-end-2 md:text-right' : 'md:col-start-3 md:col-end-4 md:text-left'}`}>
                  <span className={`${c.accent} text-[10px] font-bold uppercase tracking-widest`}>{story.year}</span>
                  <h4 className={`text-xl font-serif ${c.main}`}>{story.title}</h4>
                  <p className={`${c.muted} text-sm leading-relaxed mt-2`}>{story.text}</p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}