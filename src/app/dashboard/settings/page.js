'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAdminProfile, updateAdminProfile } from '@/lib/actions';

export default function SettingsPage() {
  const [profile, setProfile] = useState({ display_name: '', email: '', username: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const data = await getAdminProfile();
      if (data) setProfile(data);
    }
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.target);
    const pwd1 = formData.get('newPassword');
    const pwd2 = formData.get('confirmPassword');

    if (pwd1 !== pwd2) {
      alert("Password baru dan konfirmasi tidak cocok!");
      setIsSaving(false);
      return;
    }

    try {
      await updateAdminProfile(formData);
      alert("Pengaturan berhasil disimpan! Jika Anda mengganti password, Anda akan diminta login ulang saat merefresh halaman.");
      e.target.newPassword.value = '';
      e.target.confirmPassword.value = '';
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    }
    setIsSaving(false);
  };

  return (
    <main className="p-6 md:p-8 lg:p-10 animate-[fadeIn_0.4s_ease-out]">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/dashboard" className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
              </Link>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pengaturan Sistem</h1>
            </div>
            <p className="text-slate-500 text-sm ml-12">Kelola profil admin dan konfigurasi utama keamanan Anda.</p>
          </div>
          <button onClick={() => document.getElementById('settingsForm').requestSubmit()} disabled={isSaving} className="px-8 py-3.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-purple-600 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center gap-2 disabled:opacity-50">
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: MENU */}
          <div className="lg:col-span-1 space-y-2">
            <button className="w-full flex items-center justify-between p-4 bg-white border-l-4 border-purple-500 rounded-r-2xl shadow-sm text-left">
              <div>
                <p className="font-bold text-slate-900 text-sm">Profil & Keamanan</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Kredensial Login</p>
              </div>
            </button>
          </div>

          {/* KOLOM KANAN: FORM KONTEN */}
          <div className="lg:col-span-2">
            <form id="settingsForm" onSubmit={handleSave} className="space-y-8">
              
              {/* CARD 1: INFORMASI DASAR */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <span className="p-2 bg-slate-100 rounded-lg">👤</span> Informasi Dasar
                </h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nama Tampilan</label>
                      <input type="text" name="displayName" defaultValue={profile.display_name} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-400 focus:bg-white transition-colors text-sm font-medium text-slate-800" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Username (Login)</label>
                      <input type="text" defaultValue={profile.username} disabled className="w-full px-5 py-3.5 bg-slate-100 border border-slate-200 rounded-xl outline-none text-sm font-medium text-slate-500 cursor-not-allowed" title="Username tidak dapat diubah" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Email Pemberitahuan</label>
                    <input type="email" name="email" defaultValue={profile.email} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-400 focus:bg-white transition-colors text-sm font-medium text-slate-800" />
                  </div>
                </div>
              </div>

              {/* CARD 2: GANTI PASSWORD */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-red-400"></div>
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <span className="p-2 bg-red-50 text-red-500 rounded-lg">🔑</span> Ganti Password
                </h2>
                <p className="text-xs text-slate-500 mb-6 -mt-3">Kosongkan kolom ini jika Anda tidak ingin mengubah password.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Password Baru</label>
                    <input type="password" name="newPassword" placeholder="Minimal 6 karakter" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-400 focus:bg-white transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Konfirmasi Password</label>
                    <input type="password" name="confirmPassword" placeholder="Ulangi sandi baru" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-400 focus:bg-white transition-colors text-sm" />
                  </div>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </main>
  );
}