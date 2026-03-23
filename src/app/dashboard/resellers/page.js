import Link from 'next/link';

export default function ResellerPage() {
  const resellers = [
    { id: 1, name: 'Zacky Partner', code: 'ZCKY10', sales: 45, commission: 'Rp 4.500.000', status: 'Active', lastActive: '2 jam lalu' },
    { id: 2, name: 'WO Berkah', code: 'WO-BRK', sales: 128, commission: 'Rp 12.800.000', status: 'Active', lastActive: '1 hari lalu' },
    { id: 3, name: 'Studio Abadi', code: 'ABADI-PIC', sales: 12, commission: 'Rp 1.200.000', status: 'Inactive', lastActive: '2 minggu lalu' },
  ];

  return (
    <main className="p-6 md:p-8 lg:p-10 animate-[fadeIn_0.4s_ease-out]">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/dashboard" className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
              </Link>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reseller & Afiliasi</h1>
            </div>
            <p className="text-slate-500 text-sm ml-12">Pantau performa mitra penjualan dan kelola komisi mereka.</p>
          </div>
          <button className="px-6 py-3.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-purple-600 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5.5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
            Rekrut Mitra Baru
          </button>
        </div>

        {/* STATISTIK RESELLER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg shadow-purple-500/20">
            <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2">Total Penjualan Mitra</p>
            <p className="text-4xl font-black tracking-tighter mb-4">185 <span className="text-base font-medium">Undangan</span></p>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="w-[75%] h-full bg-amber-400"></div>
            </div>
            <p className="text-[10px] text-white/60 mt-3 font-medium text-right">+24% dari bulan lalu</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Estimasi Komisi Belum Cair</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">Rp 3.450.000</p>
            <button className="mt-4 text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 w-fit">Bayar Komisi →</button>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Mitra Aktif</p>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-slate-900 tracking-tight">12</p>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
              </span>
            </div>
          </div>
        </div>

        {/* TABEL MITRA */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Daftar Mitra Penjualan</h2>
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" placeholder="Cari nama atau kode..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-50 w-64" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="p-5 pl-6">Profil Mitra</th>
                  <th className="p-5">Kode Kupon / Ref</th>
                  <th className="p-5 text-center">Undangan Terjual</th>
                  <th className="p-5 text-right">Total Komisi</th>
                  <th className="p-5 pr-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resellers.map((mitra) => (
                  <tr key={mitra.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-5 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                          {mitra.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">{mitra.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${mitra.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                            {mitra.lastActive}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors text-xs font-bold text-slate-700 tracking-wider">
                        {mitra.code}
                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                      </button>
                    </td>
                    <td className="p-5 text-center">
                      <span className="text-xl font-bold text-slate-800">{mitra.sales}</span>
                    </td>
                    <td className="p-5 text-right">
                      <span className="text-sm font-bold text-emerald-600">{mitra.commission}</span>
                    </td>
                    <td className="p-5 pr-6 text-right">
                      <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}