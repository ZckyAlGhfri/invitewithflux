'use client';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function SortDropdown({ defaultSort }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (e) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams);
    
    // Set parameter sort yang baru
    params.set('sort', val);
    
    // Opsional: Reset ke halaman 1 setiap kali ganti urutan
    params.set('page', '1'); 

    // Update URL agar server menangkapnya
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-slate-500 font-medium">Urutkan:</label>
      <select 
        defaultValue={defaultSort} 
        onChange={handleChange}
        className="text-xs font-bold bg-white border border-slate-200 px-3 py-2 rounded-lg outline-none cursor-pointer focus:ring-2 focus:ring-purple-400"
      >
        <option value="newest">Tanggal Dibuat (Terbaru)</option>
        <option value="oldest">Tanggal Dibuat (Terlama)</option>
        <option value="updated_new">Perubahan Terakhir (Terbaru)</option>
        <option value="updated_old">Perubahan Terakhir (Terlama)</option>
        <option value="name_asc">Nama Klien (A - Z)</option>
        <option value="name_desc">Nama Klien (Z - A)</option>
        <option value="tier_desc">Tier (Tertinggi - Terendah)</option>
        <option value="tier_asc">Tier (Terendah - Tertinggi)</option>
      </select>
    </div>
  );
}