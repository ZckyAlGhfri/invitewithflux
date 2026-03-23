'use client';
import { useState, useEffect } from 'react'; // <--- TAMBAHKAN INI
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutAdmin, getAdminProfile} from '@/lib/actions';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  // State untuk menyimpan nama admin, default 'Admin'
  const [adminName, setAdminName] = useState('Admin');

  // Ambil data profil saat sidebar pertama kali dimuat
  useEffect(() => {
    async function loadProfile() {
      const data = await getAdminProfile();
      if (data && data.display_name) {
        setAdminName(data.display_name);
      }
    }
    loadProfile();
  }, []);

  // Fungsi untuk mengeksekusi logout
  const handleLogout = async () => {
    if (confirm("Yakin ingin keluar dari Ruang Kendali?")) {
      await logoutAdmin();
      router.push('/login');
    }
  };

  const navItems = [
    { 
      name: 'Ruang Kendali', 
      href: '/dashboard', 
      exact: true,
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
    },
    { 
      name: 'Reseller & Afiliasi', 
      href: '/dashboard/resellers', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
    },
    { 
      name: 'Galeri Template', 
      href: '/dashboard/templates', 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zM9 11V8M15 11V8M9 16v-2M15 16v-2"/>
    },
    { 
      name: 'Pengaturan Sistem', 
      href: '/dashboard/settings', 
      icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></>
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col border-r border-slate-800 shrink-0">
      <div className="p-6 border-b border-slate-800">
        <div className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">🚀</div>
          FluxWedding
        </div>
      </div>
      
      <nav className="p-4 flex-1 space-y-2">
        {navItems.map((item) => {
          // Logika Penentu Menu Aktif
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                isActive 
                  ? 'bg-white/10 text-white font-bold shadow-inner border border-white/5' 
                  : 'font-medium text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <svg className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'opacity-70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {item.icon}
              </svg>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-red-500/10 rounded-xl transition-colors group text-left"
        >
          <div className="flex items-center gap-3">
            {/* AMBIL HURUF PERTAMA DARI NAMA */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-sm font-bold shadow-lg uppercase">
              {adminName.charAt(0)}
            </div>
            <div>
              {/* TAMPILKAN NAMA LENGKAP */}
              <p className="text-sm font-bold text-white leading-tight">{adminName}</p>
              <p className="text-[10px] text-red-400 uppercase tracking-widest font-bold mt-0.5 group-hover:text-red-500 transition-colors">Keluar (Logout)</p>
            </div>
          </div>
          
          <svg className="w-4 h-4 text-slate-500 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        </button>
      </div>
    </aside>
  );
}