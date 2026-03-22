'use client';
import Reveal from '@/components/Reveal';

export default function Gift({ data }) {
  // LOGIKA TIER: Jika paket Basic, komponen Kado tidak akan di-render sama sekali!
  if (!data || data.tier === 'basic') return null;

  return (
    <section id="gift" className="py-32 bg-amber-50 px-6 relative overflow-hidden">
      <div className="absolute -left-32 top-0 w-96 h-96 bg-amber-200/40 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <Reveal direction="down">
          <span className="text-xs font-bold tracking-[0.4em] uppercase text-amber-700 mb-4 block">Tanda Kasih</span>
          <h2 className="text-5xl md:text-6xl font-serif italic text-slate-900 mb-8">Wedding Gift</h2>
          <p className="text-slate-600 mb-16 font-light leading-relaxed text-lg max-w-2xl mx-auto">Tanpa mengurangi rasa hormat, bagi Anda yang ingin memberikan tanda kasih untuk kami, dapat melalui beberapa cara di bawah ini.</p>
        </Reveal>
        
        <div className="space-y-8">
          {/* LOOPING REKENING ASLI DARI DATABASE */}
          {data.bank_accounts && data.bank_accounts.length > 0 ? (
            data.bank_accounts.map((bank, index) => (
              <Reveal key={index} direction="up" delay={0.2 * index}>
                <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-[0_10px_50px_rgba(0,0,0,0.05)] border border-amber-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                  <div className="absolute left-0 top-0 w-2 h-full bg-amber-400"></div>
                  <div className="text-left flex-1">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-amber-700 font-bold mb-4 bg-amber-50 inline-block px-4 py-1.5 rounded-full border border-amber-200/50">
                      Transfer {bank.bank_name}
                    </p>
                    <p className="text-3xl md:text-4xl font-bold text-slate-900 my-2 font-mono tracking-wider">
                      {bank.account_number}
                    </p>
                    <p className="text-base text-slate-500 mt-2">
                      Atas Nama: <strong className="text-slate-800">{bank.account_name}</strong>
                    </p>
                  </div>
                  <button 
                    onClick={() => {navigator.clipboard.writeText(bank.account_number); alert(`No. Rekening ${bank.bank_name} disalin!`)}} 
                    className="w-full md:w-auto px-10 py-5 bg-slate-900 text-white font-bold text-xs rounded-full uppercase tracking-widest hover:bg-amber-600 transition-colors active:scale-95 shadow-xl"
                  >
                    Salin Rekening
                  </button>
                </div>
              </Reveal>
            ))
          ) : (
            <p className="text-slate-500 italic">Informasi rekening belum ditambahkan.</p>
          )}

          {data.tier === 'exclusive' && data.alamat_kado_fisik && (
            <Reveal direction="up" delay={0.4}>
              <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-[0_10px_50px_rgba(0,0,0,0.05)] border border-amber-100 text-left relative overflow-hidden">
                <div className="absolute left-0 top-0 w-2 h-full bg-amber-400"></div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-700 font-bold mb-5 bg-amber-50 inline-block px-4 py-1.5 rounded-full border border-amber-200/50">Kirim Kado Fisik</p>
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-8">
                  <p className="text-slate-700 leading-relaxed font-medium text-base">{data.alamat_kado_fisik}</p>
                </div>
                <button onClick={() => {navigator.clipboard.writeText(data.alamat_kado_fisik); alert("Alamat disalin!")}} className="w-full px-10 py-5 bg-slate-100 text-slate-800 font-bold text-xs rounded-full uppercase tracking-widest hover:bg-slate-200 transition-colors active:scale-95 text-center shadow-sm">
                  Salin Alamat Lengkap
                </button>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}