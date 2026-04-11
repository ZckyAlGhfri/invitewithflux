'use client';
import Reveal from '@/components/Reveal';

export default function Gift({ data, colorVariant }) {
  if (!data || data.tier === 'basic') return null;

  const validBanks = data.bank_accounts?.filter(bank => bank.bank_name?.trim() !== '' && bank.account_number?.trim() !== '') || [];
  const hasPhysicalAddress = data.tier === 'exclusive' && data.alamat_kado_fisik?.trim() !== '';

  const themeStyles = {
    emerald: { main: "text-emerald-900", muted: "text-emerald-500", border: "border-emerald-200", borderDark: "border-emerald-300", bg: "bg-emerald-50", btn: "border-emerald-900 text-emerald-900 hover:bg-emerald-900 hover:text-white" },
    sapphire: { main: "text-blue-900", muted: "text-blue-500", border: "border-blue-200", borderDark: "border-blue-300", bg: "bg-blue-50", btn: "border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white" },
    ruby: { main: "text-rose-900", muted: "text-rose-500", border: "border-rose-200", borderDark: "border-rose-300", bg: "bg-rose-50", btn: "border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white" },
    gold: { main: "text-amber-900", muted: "text-amber-500", border: "border-amber-200", borderDark: "border-amber-300", bg: "bg-amber-50", btn: "border-amber-900 text-amber-900 hover:bg-amber-900 hover:text-white" },
    monochrome: { main: "text-stone-900", muted: "text-stone-500", border: "border-stone-200", borderDark: "border-stone-300", bg: "bg-stone-50", btn: "border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white" }
  };
  const c = themeStyles[colorVariant] || themeStyles.monochrome;

  if (validBanks.length === 0 && !hasPhysicalAddress) {
    return (
      <section id="gift" className={`py-24 bg-white px-6 border-y ${c.border}`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-3xl font-serif ${c.main} mb-6`}>Tanda Kasih</h2>
          <div className={`p-8 border ${c.border} border-dashed ${c.bg} ${c.muted} italic text-sm`}>
            Informasi tanda kasih belum ditambahkan oleh mempelai.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gift" className={`py-24 bg-transparent px-6 border-y ${c.border} relative`}>
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <Reveal direction="down">
          <h2 className={`text-3xl font-serif ${c.main} mb-6`}>Tanda Kasih</h2>
          <p className={`${c.muted} mb-12 text-sm max-w-xl mx-auto leading-relaxed`}>Tanpa mengurangi rasa hormat, bagi Anda yang ingin memberikan tanda kasih, dapat melalui rekening berikut.</p>
        </Reveal>
        
        <div className="space-y-6">
          {validBanks.map((bank, index) => (
            <Reveal key={index} direction="up" delay={0.1 * index}>
              <div className={`p-8 border ${c.borderDark} flex flex-col items-center gap-4 ${c.bg} relative overflow-hidden group`}>
                <div className={`absolute top-2 left-2 w-4 h-4 border-t border-l ${c.borderDark}`}></div>
                <div className={`absolute bottom-2 right-2 w-4 h-4 border-b border-r ${c.borderDark}`}></div>
                
                <p className={`text-[10px] uppercase tracking-[0.2em] ${c.muted} font-bold border-b ${c.borderDark} pb-2`}>{bank.bank_name}</p>
                <p className={`text-2xl font-serif ${c.main} tracking-widest`}>{bank.account_number}</p>
                <p className={`text-sm ${c.muted} uppercase tracking-widest`}>A.N. {bank.account_name}</p>
                <button onClick={() => {navigator.clipboard.writeText(bank.account_number); alert("Disalin!")}} className={`mt-4 px-6 py-2 border ${c.btn} text-[10px] uppercase tracking-widest transition-colors`}>Salin Rekening</button>
              </div>
            </Reveal>
          ))}

          {hasPhysicalAddress && (
            <Reveal direction="up">
              <div className={`p-8 border ${c.borderDark} flex flex-col items-center gap-4 ${c.bg} mt-6 relative`}>
                <div className={`absolute top-2 left-2 w-4 h-4 border-t border-l ${c.borderDark}`}></div>
                <div className={`absolute bottom-2 right-2 w-4 h-4 border-b border-r ${c.borderDark}`}></div>
                <p className={`text-[10px] uppercase tracking-[0.2em] ${c.muted} font-bold border-b ${c.borderDark} pb-2`}>Kirim Kado Fisik</p>
                <p className={`text-sm ${c.main} font-serif leading-relaxed italic text-center px-4`}>{data.alamat_kado_fisik}</p>
                <button onClick={() => {navigator.clipboard.writeText(data.alamat_kado_fisik); alert("Disalin!")}} className={`mt-2 px-6 py-2 border ${c.btn} text-[10px] uppercase tracking-widest transition-colors`}>Salin Alamat</button>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}