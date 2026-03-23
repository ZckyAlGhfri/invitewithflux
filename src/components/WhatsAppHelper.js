'use client';
import { useState } from 'react';

export default function WhatsAppHelper({ slug, namaWanita, namaPria }) {
  const [guestName, setGuestName] = useState('');
  const [isFormal, setIsFormal] = useState(true);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const invitationUrl = `${baseUrl}/${slug}?to=${encodeURIComponent(guestName || 'Tamu Undangan')}`;

  const generateMessage = () => {
    if (isFormal) {
      return `Yth. ${guestName || 'Bapak/Ibu/Saudara/i'},\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk menghadiri acara pernikahan kami:\n\n*${namaWanita} & ${namaPria}*\n\nDetail acara dan pilihan RSVP dapat dilihat melalui tautan undangan digital berikut:\n${invitationUrl}\n\nMerupakan suatu kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.\n\nTerima kasih.`;
    } else {
      return `Halo ${guestName || 'Teman-teman'}!\n\nAda kabar bahagia nih, kami mau mengundang kamu untuk hadir di acara pernikahan kita:\n\n*${namaWanita} & ${namaPria}*\n\nInfo lengkapnya ada di link undangan ini ya:\n${invitationUrl}\n\nSampai ketemu di sana! 🙏✨`;
    }
  };

  const handleShare = () => {
    const message = encodeURIComponent(generateMessage());
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMessage());
    alert('Teks undangan berhasil disalin!');
  };

  return (
    <div className="w-full max-w-lg bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl mt-6">
      <div className="space-y-5">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Nama Tamu (Opsional)</label>
          <input 
            type="text" 
            value={guestName} 
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Contoh: Bpk. Zacky & Istri"
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-green-500 text-sm transition-all"
          />
        </div>

        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
          <button type="button" onClick={() => setIsFormal(true)} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${isFormal ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Formal</button>
          <button type="button" onClick={() => setIsFormal(false)} className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${!isFormal ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>Santai</button>
        </div>

        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 max-h-40 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-3">Preview Pesan:</p>
          <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line italic">{generateMessage()}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={handleCopy} className="py-4 bg-slate-100 text-slate-700 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all">Salin Teks</button>
          <button type="button" onClick={handleShare} className="py-4 bg-green-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-green-700 shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2">Kirim ke WA</button>
        </div>
      </div>
    </div>
  );
}