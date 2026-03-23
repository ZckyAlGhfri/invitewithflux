'use client';
import Reveal from '@/components/Reveal';

export default function LoveStory({ data }) {
  if (!data || !data.love_story) return null;
  let parsedStory = [];
  try { parsedStory = typeof data.love_story === 'string' ? JSON.parse(data.love_story) : data.love_story; } catch(e){}
  if (parsedStory.length === 0) return null;

  return (
    <section id="lovestory" className="py-24 bg-white relative overflow-hidden border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <Reveal direction="down">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-stone-400 mb-4 block">Perjalanan Cinta</span>
            <h2 className="text-4xl font-serif text-stone-900">Kisah Kami</h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-y-12 pl-8 relative before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-stone-300 md:grid-cols-[1fr,auto,1fr] md:pl-0 md:before:left-1/2 md:before:-translate-x-1/2">
          {parsedStory.map((story, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-start gap-y-4 md:gap-y-0 md:gap-x-12 group relative">
                <div className="w-3 h-3 bg-stone-800 rounded-full shrink-0 order-1 md:order-none md:col-start-2 md:col-end-3 relative z-10 mt-1.5 md:mx-auto ring-4 ring-white"></div>
                <Reveal direction={isEven ? "left" : "right"} className={`flex flex-col gap-2 bg-transparent order-2 md:order-none ${isEven ? 'md:col-start-1 md:col-end-2 md:text-right' : 'md:col-start-3 md:col-end-4 md:text-left'}`}>
                  <span className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">{story.year}</span>
                  <h4 className="text-xl font-serif text-stone-900">{story.title}</h4>
                  <p className="text-stone-500 text-sm leading-relaxed mt-2">{story.text}</p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}