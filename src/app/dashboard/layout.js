import { redirect } from 'next/navigation';
import { hasValidAdminSession } from '@/lib/auth/admin';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({ children }) {
  if (!(await hasValidAdminSession())) redirect('/login');
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
