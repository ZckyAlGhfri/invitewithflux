'use client';
import Reveal from '@/components/Reveal';

export default function Gift({ data, colorVariant }) {
  if (!data || data.tier === 'basic') return null;

  const themeStyles = {
    slate: { accent: "text-slate-400", bgHover: "hover:bg-slate-500", borderHover: "group-hover:border-slate-500" },
    indigo: { accent: "text-indigo-500", bgHover: "hover:bg-indigo-500", borderHover: "group-hover:border-indigo-500" },
    rose: { accent: "text-rose-500", bgHover: "hover:bg-rose-500", borderHover: "group-hover:border-rose-500" },
    teal: { accent: "text-teal-400", bgHover: "hover:bg-teal-500", borderHover: "group-hover:border-teal-500" },
    amber: { accent: "text-amber-500", bgHover: "hover:bg-amber-500", borderHover: "group-hover:border-amber-500" }
  };
  const c = themeStyles[colorVariant] || themeStyles.slate;

  const validBanks = data.bank_accounts?.filter(bank => bank.bank_name?.trim() !== '' && bank.account_number?.trim() !== '') || [];
  const hasPhysicalAddress = data.tier === 'exclusive' && data.alamat_kado_fisik?.trim() !== '';

  if (validBanks.length === 0 && !hasPhysicalAddress) return null;

  return (
    <section id="gift" className="py-32 bg-black px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <Reveal direction="down">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-white mb-20 text-center">Digital Gift</h2>
        </Reveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {validBanks.map((bank, i) => (
            <Reveal key={i} direction="up" delay={i * 0.1}>
              <div className={`bg-stone-900 p-10 border border-white/5 relative group transition-colors ${c.borderHover}`}>
                <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/30 mb-8 block">{bank.bank_name}</span>
                <p className="text-2xl font-bold text-white tracking-tighter mb-2">{bank.account_number}</p>
                <p className={`text-[10px] font-bold ${c.accent} uppercase tracking-widest mb-10`}>A.N. {bank.account_name}</p>
                <button 
                  onClick={() => {navigator.clipboard.writeText(bank.account_number); alert("Copied!")}}
                  className={`w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] ${c.bgHover} hover:text-white transition-colors`}
                >
                  Copy Details
                </button>
              </div>
            </Reveal>
          ))}

          {hasPhysicalAddress && (
            <Reveal direction="up" className="md:col-span-2">
               <div className={`bg-stone-900 p-10 border border-white/5 relative group transition-colors ${c.borderHover} text-center`}>
                 <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white/30 mb-6 block">Physical Gift Address</span>
                 <p className="text-sm font-medium text-white/80 uppercase tracking-widest leading-relaxed max-w-2xl mx-auto mb-8">{data.alamat_kado_fisik}</p>
                 <button 
                    onClick={() => {navigator.clipboard.writeText(data.alamat_kado_fisik); alert("Address Copied!")}}
                    className={`px-12 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] ${c.bgHover} hover:text-white transition-colors`}
                  >
                    Copy Address
                  </button>
               </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}