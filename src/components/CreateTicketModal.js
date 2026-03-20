'use client';
import { useState } from 'react';
import { createTicket } from '@/lib/actions';

export default function CreateTicketModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    await createTicket(formData);
    setIsOpen(false);
    setIsSubmitting(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md active:scale-95 whitespace-nowrap flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        Buat Klien Baru
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full animate-slide-up">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Pilih Paket Klien</h2>
            <p className="text-sm text-slate-500 mb-6">Tentukan tier untuk klien ini. Ini akan mempengaruhi fitur apa saja yang mereka dapatkan.</p>
            
            <form action={handleSubmit} className="space-y-4">
              <select name="tier" className="w-full bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 font-medium">
                <option value="basic">⭐ Paket Basic (Tanpa Kado & Buku Tamu)</option>
                <option value="premium">🌟 Paket Premium (Fitur Standar)</option>
                <option value="exclusive">👑 Paket Exclusive (+Alamat Kado)</option>
              </select>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-3 rounded-xl text-slate-500 font-bold bg-slate-100 hover:bg-slate-200 w-full transition-colors">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-3 rounded-xl text-white font-bold bg-slate-900 hover:bg-slate-800 w-full transition-colors">
                  {isSubmitting ? 'Memproses...' : 'Buat Tiket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}