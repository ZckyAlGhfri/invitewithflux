'use client';
import Reveal from '@/components/Reveal';

export default function LoveStory({ data, colorVariant }) {
  if (!data || !data.love_story) return null;
  let parsedStory = [];
  try { parsedStory = typeof data.love_story === 'string' ? JSON.parse(data.love_story) : data.love_story; } catch(e){}
  if (parsedStory.length === 0) return null;

  const themeStyles = {
    slate: { accent: "text-slate-400", dot: "bg-slate-400", glow: "shadow-slate-400/50" },
    indigo: { accent: "text-indigo-500", dot: "bg-indigo-500", glow: "shadow-indigo-500/50" },
    rose: { accent: "text-rose-500", dot: "bg-rose-500", glow: "shadow-rose-500/50" },
    teal: { accent: "text-teal-400", dot: "bg-teal-400", glow: "shadow-teal-400/50" },
    amber: { accent: "text-amber-500", dot: "bg-amber-500", glow: "shadow-amber-500/50" }
  };
  const c = themeStyles[colorVariant] || themeStyles.slate;

  return (
    <section id="lovestory" className="py-32 bg-black text-white border-y border-white/10">
      <div className="max-w-4xl mx-auto px-6">
        <Reveal direction="down">
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-20 text-center">Our Timeline</h2>
        </Reveal>
        <div className="space-y-24 relative before:absolute before:inset-y-0 before:left-0 md:before:left-1/2 before:w-1 before:bg-stone-900 md:before:-translate-x-1/2">
          {parsedStory.map((story, i) => (
            <div key={i} className={`relative flex flex-col md:flex-row items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              {/* Titik Garis Waktu dengan Glow dinamis */}
              <div className={`absolute left-0 md:left-1/2 w-4 h-4 ${c.dot} md:-translate-x-1/2 z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${c.glow}`}></div>
              
              <div className={`w-full md:w-1/2 pl-10 md:pl-0 ${i % 2 === 0 ? 'md:pl-16 text-left' : 'md:pr-16 md:text-right'}`}>
                <Reveal direction={i % 2 === 0 ? "right" : "left"}>
                  <span className="text-4xl font-black text-white/10 block mb-2">{story.year}</span>
                  <h4 className={`text-xl font-bold uppercase tracking-tight mb-4 ${c.accent}`}>{story.title}</h4>
                  <p className="text-sm text-white/50 leading-relaxed font-medium uppercase tracking-wider">{story.text}</p>
                </Reveal>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}