'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition, useState } from 'react';

export default function LiveSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [term, setTerm] = useState(searchParams.get('q') || '');

  const handleSearch = (e) => {
    const value = e.target.value;
    setTerm(value);
    
    // Gunakan URLSearchParams untuk memanipulasi parameter URL
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }
    params.set('page', '1'); // Reset ke halaman 1 tiap kali mencari

    // startTransition membuat pengetikan tidak lag (non-blocking)
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="relative w-full md:w-72">
      <input 
        type="text" 
        value={term}
        onChange={handleSearch}
        placeholder="Cari nama, slug, atau tier..." 
        className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-slate-400 focus:ring-2 focus:ring-slate-100 text-sm transition-all"
      />
      <svg className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      {isPending && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      )}
    </div>
  );
}