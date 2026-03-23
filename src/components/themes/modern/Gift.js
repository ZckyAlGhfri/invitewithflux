'use client';
import Reveal from '@/components/Reveal';

export default function Gift({ data }) {
  if (!data || data.tier === 'basic') return null;

  return (
    <section id="gift" className="py-32 bg-black px-6">
      <div className="max-w-4xl mx-auto">
        <Reveal direction="down">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-white mb-20 text-center">Digital Gift</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.bank_accounts?.map((bank, i) => (
            <div key={i} className="bg-stone-900 p-10 border border-white/5 relative group">
              <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/30 mb-8 block">{bank.bank_name}</span>
              <p className="text-2xl font-bold text-white tracking-tighter mb-2">{bank.account_number}</p>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-10">A.N. {bank.account_name}</p>
              <button 
                onClick={() => {navigator.clipboard.writeText(bank.account_number); alert("Copied!")}}
                className="w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-amber-500 hover:text-white transition-colors"
              >
                Copy Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}