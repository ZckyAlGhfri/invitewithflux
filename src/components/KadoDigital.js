'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function KadoDigital({ invitationId, tier, alamatFisik }) {
  const [copied, setCopied] = useState(null);
  const [dataRekening, setDataRekening] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data rekening dari tabel bank_accounts berdasarkan ID undangan
  useEffect(() => {
    async function fetchBanks() {
      if (!invitationId) return;
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: true }); // Urutkan dari yang pertama diinput

      if (!error && data) {
        setDataRekening(data);
      }
      setLoading(false);
    }
    fetchBanks();
  }, [invitationId]);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) return <div className="py-24 text-center text-slate-400 font-serif italic">Menyiapkan kotak kado...</div>;
  
  // Jika tidak ada rekening dan tidak ada alamat fisik, sembunyikan section ini
  if (dataRekening.length === 0 && !alamatFisik) return null;

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-4xl font-serif italic text-slate-900 mb-4">Kado Digital</h2>
          <p className="text-slate-500 font-light max-w-lg mx-auto leading-relaxed">
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih, dapat melalui:
          </p>
        </div>

        {/* RENDER REKENING DINAMIS DARI DATABASE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {dataRekening.map((item, index) => (
            <div 
              key={item.id} 
              className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-16 h-10 bg-white rounded-lg mb-6 flex items-center justify-center shadow-inner overflow-hidden p-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase italic truncate w-full">
                  {item.bank_name}
                </span>
              </div>
              
              <p className="text-sm text-slate-500 mb-1 uppercase tracking-widest">No. Rekening</p>
              <h4 className="text-xl font-bold text-slate-800 mb-2">{item.account_number}</h4>
              <p className="text-xs text-slate-400 mb-6 italic">a.n {item.account_name}</p>

              <button 
                onClick={() => copyToClipboard(item.account_number, index)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all shadow-lg ${
                  copied === index 
                  ? 'bg-green-500 text-white shadow-green-200' 
                  : 'bg-slate-900 text-white hover:bg-slate-700 shadow-slate-200'
                }`}
              >
                {copied === index ? '✓ Tersalin' : 'Salin Nomor'}
              </button>
            </div>
          ))}
        </div>

        {/* ALAMAT FISIK (Hanya dirender jika tier exclusive DAN alamatnya diisi) */}
        {tier === 'exclusive' && alamatFisik && (
          <div className="mt-16 p-8 bg-slate-900 rounded-[2.5rem] text-white">
            <div className="flex flex-col items-center">
               <svg className="mb-4 opacity-50" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M10 14.5 16 3"/><path d="M6 3.5a2 2 0 0 1 3.2 2.1l-1.4 1.5a4 4 0 1 1 1.3 1.3l1.5-1.4a2 2 0 1 1 2.1 3.2"/><path d="m22 22-1.5-1.5"/><path d="m5.8 11.3-4.7 6.1a2 2 0 0 0 .3 2.7l1.1 1.1a2 2 0 0 0 2.7.3l6.1-4.7"/></svg>
               <h3 className="text-xl font-serif italic mb-2">Kirim Kado Fisik</h3>
               <p className="text-sm text-slate-400 font-light mb-6 max-w-md mx-auto">{alamatFisik}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}