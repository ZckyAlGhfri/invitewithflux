'use client';
import Reveal from '@/components/Reveal';

export default function Gift({ data }) {
  if (!data || data.tier === 'basic') return null;

  // Filter bank yang benar-benar ada isinya
  const validBanks = data.bank_accounts?.filter(bank => bank.bank_name?.trim() !== '' && bank.account_number?.trim() !== '') || [];
  const hasPhysicalAddress = data.tier === 'exclusive' && data.alamat_kado_fisik?.trim() !== '';

  // Jika tidak ada rekening valid dan tidak ada alamat fisik, jangan tampilkan apa-apa
  if (validBanks.length === 0 && !hasPhysicalAddress) {
    return (
      <section id="gift" className="py-24 bg-white px-6 border-y border-stone-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-serif text-stone-900 mb-6">Tanda Kasih</h2>
          <div className="p-8 border border-stone-200 border-dashed bg-stone-50 text-stone-400 italic text-sm">
            Informasi tanda kasih belum ditambahkan oleh mempelai.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gift" className="py-24 bg-transparent px-6 border-y border-stone-200 relative">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <Reveal direction="down">
          <h2 className="text-3xl font-serif text-stone-900 mb-6">Tanda Kasih</h2>
          <p className="text-stone-500 mb-12 text-sm max-w-xl mx-auto leading-relaxed">Tanpa mengurangi rasa hormat, bagi Anda yang ingin memberikan tanda kasih, dapat melalui rekening berikut.</p>
        </Reveal>
        
        <div className="space-y-6">
          {validBanks.map((bank, index) => (
            <Reveal key={index} direction="up" delay={0.1 * index}>
              <div className="p-8 border border-stone-300 flex flex-col items-center gap-4 bg-stone-50 relative overflow-hidden group">
                {/* Ornamen Sudut Tipis */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-stone-300"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-stone-300"></div>
                
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold border-b border-stone-300 pb-2">{bank.bank_name}</p>
                <p className="text-2xl font-serif text-stone-900 tracking-widest">{bank.account_number}</p>
                <p className="text-sm text-stone-600 uppercase tracking-widest">A.N. {bank.account_name}</p>
                <button onClick={() => {navigator.clipboard.writeText(bank.account_number); alert("Disalin!")}} className="mt-4 px-6 py-2 border border-stone-800 text-stone-800 text-[10px] uppercase tracking-widest hover:bg-stone-800 hover:text-white transition-colors">Salin Rekening</button>
              </div>
            </Reveal>
          ))}

          {hasPhysicalAddress && (
            <Reveal direction="up">
              <div className="p-8 border border-stone-300 flex flex-col items-center gap-4 bg-stone-50 mt-6 relative">
                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-stone-300"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-stone-300"></div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold border-b border-stone-300 pb-2">Kirim Kado Fisik</p>
                <p className="text-sm text-stone-700 font-serif leading-relaxed italic text-center px-4">{data.alamat_kado_fisik}</p>
                <button onClick={() => {navigator.clipboard.writeText(data.alamat_kado_fisik); alert("Disalin!")}} className="mt-2 px-6 py-2 border border-stone-800 text-stone-800 text-[10px] uppercase tracking-widest hover:bg-stone-800 hover:text-white transition-colors">Salin Alamat</button>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}