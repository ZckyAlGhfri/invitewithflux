import { getDashboardData, getDashboardStats, deleteTicket } from '@/lib/actions';
import CopyButton from '@/components/CopyButton';
import DeleteButton from '@/components/DeleteButton';
import LockButton from '@/components/LockButton';
import LiveSearch from '@/components/LiveSearch';
import CreateTicketModal from '@/components/CreateTicketModal';
import SortDropdown from '@/components/SortDropdown';
import Link from 'next/link';
import Form from 'next/form';

export default async function AdminDashboard(props) {
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const baseUrl = rawBaseUrl.replace(/\/$/, "");
  const searchParams = await props.searchParams; 
  const query = searchParams?.q || '';
  const currentPage = Number(searchParams?.page) || 1;
  const sortParam = searchParams?.sort || 'newest';
  const limit = 5;

  // Fetch Data Table & Real Stats bersamaan
  const [tableData, stats] = await Promise.all([
    getDashboardData(query, currentPage, limit, sortParam),
    getDashboardStats()
  ]);

  const { data: invitations, totalPages, totalItems } = tableData;

  const tierColors = {
    basic: 'bg-slate-100 text-slate-600',
    premium: 'bg-blue-100 text-blue-700',
    exclusive: 'bg-amber-100 text-amber-700 font-bold border border-amber-200'
  };

  // Logika Advanced Pagination Pindah Halaman Langsung
  const renderPagination = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Link 
          key={i} 
          href={`/dashboard?page=${i}${query ? `&q=${query}` : ''}&sort=${sortParam}`}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
            currentPage === i ? 'bg-purple-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100'
          }`}
        >
          {i}
        </Link>
      );
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* SIDEBAR TEMA GELAP (Premium SaaS Look) */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">🚀</div>
            FluxWedding
          </div>
        </div>
        <nav className="p-4 flex-1 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-xl font-bold text-sm shadow-inner">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Ruang Kendali
          </Link>
          <Link href="/dashboard/resellers" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 hover:text-white rounded-xl font-medium text-sm transition-colors">
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            Reseller & Afiliasi
          </Link>
          <Link href="/dashboard/templates" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 hover:text-white rounded-xl font-medium text-sm transition-colors">
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7zM9 11V8M15 11V8M9 16v-2M15 16v-2"/></svg>
            Galeri Template
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 hover:text-white rounded-xl font-medium text-sm transition-colors">
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Pengaturan Sistem
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center text-sm font-bold shadow-lg">A</div>
            <div>
              <p className="text-sm font-bold text-white">Admin Flux</p>
              <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold">Superuser</p>
            </div>
          </div>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Manajemen Klien</h1>
              <p className="text-slate-500 text-sm">Kelola pesanan, ubah status, dan pantau aktivitas undangan.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <LiveSearch />
              <CreateTicketModal />
            </div>
          </div>

          {/* REAL STAT CARD */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Total Klien</p>
              <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Onboarding</p>
              <p className="text-3xl font-bold text-amber-500">{stats.onboarding}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Aktif (Live)</p>
              <p className="text-3xl font-bold text-green-500">{stats.published}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Terkunci</p>
              <p className="text-3xl font-bold text-red-500">{stats.locked}</p>
            </div>
          </div>

          {/* FILTER & SORTING */}
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-bold text-slate-800">Daftar Undangan</h2>
            <SortDropdown defaultSort={sortParam} />
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <th className="p-5 pl-6">Informasi Klien</th>
                    <th className="p-5">Paket</th>
                    <th className="p-5">Status</th>
                    <th className="p-5">Akses Link</th>
                    <th className="p-5 pr-6 text-right">Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invitations.map((inv) => {
                    const isOnboarding = inv.status === 'onboarding';
                    const tierStyle = tierColors[inv.tier] || tierColors.basic;
                    
                    return (
                      <tr key={inv.id} className={`hover:bg-slate-50/50 transition-colors ${inv.is_locked ? 'bg-red-50/30' : ''}`}>
                        <td className="p-5 pl-6">
                          {isOnboarding ? (
                            <div className="flex items-center gap-3 opacity-60">
                              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">?</div>
                              <div>
                                <p className="font-bold text-slate-500 italic">Menunggu Klien</p>
                                <p className="text-[10px] text-slate-400">Token: ...{inv.onboard_token?.substring(0,6)}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                <img src={inv.foto_wanita || "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=150"} alt="Avatar" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className={`font-bold text-sm md:text-base ${inv.is_locked ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                  {inv.nama_wanita} & {inv.nama_pria}
                                </p>
                                <a href={`/${inv.slug}`} target="_blank" className="text-[10px] text-blue-600 hover:underline font-bold uppercase tracking-wider">Buka Undangan ↗</a>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest ${tierStyle}`}>{inv.tier}</span>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            {inv.is_locked ? (
                              <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-1 rounded-md flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> TERKUNCI</span>
                            ) : (
                              <>
                                <div className={`w-2 h-2 rounded-full ${isOnboarding ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`}></div>
                                <span className={`text-[10px] uppercase tracking-wider font-bold ${isOnboarding ? 'text-amber-600' : 'text-green-600'}`}>
                                  {inv.status}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-5">
                          {isOnboarding ? (
                            <CopyButton 
                              textToCopy={`${baseUrl}/onboarding/${inv.onboard_token}`} 
                              label="Link Form" 
                              type="blue" 
                            />
                          ) : (
                            <CopyButton 
                              textToCopy={`${baseUrl}/edit/${inv.edit_token}`} 
                              label="Magic Edit" 
                              type="purple" 
                            />
                          )}
                        </td>
                        <td className="p-5 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/dashboard/edit/${inv.id}`} title="Edit Data/Tier" className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </Link>
                            <LockButton id={inv.id} isLocked={inv.is_locked} />
                            <DeleteButton id={inv.id} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ADVANCED PAGINATION (Angka Halaman Langsung) */}
            {totalPages > 1 && (
              <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Halaman {currentPage} dari {totalPages}</span>
                <div className="flex gap-2">
                  {currentPage > 1 && (
                    <Link href={`/dashboard?page=${currentPage - 1}${query ? `&q=${query}` : ''}&sort=${sortParam}`} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
                      ←
                    </Link>
                  )}
                  {/* Render Nomor Halaman */}
                  <div className="flex gap-1">
                    {renderPagination()}
                  </div>
                  {currentPage < totalPages && (
                    <Link href={`/dashboard?page=${currentPage + 1}${query ? `&q=${query}` : ''}&sort=${sortParam}`} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
                      →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}