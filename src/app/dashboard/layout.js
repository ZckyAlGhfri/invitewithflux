import Link from 'next/link'; // <--- INI YANG HILANG
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* PANGGIL KOMPONEN SIDEBAR DI SINI */}
      <Sidebar />

      {/* KONTEN UTAMA DARI SETIAP HALAMAN */}
      <div className="flex-1 h-screen overflow-y-auto">
        {children}
      </div>
      
    </div>
  );
}