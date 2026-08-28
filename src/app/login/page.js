'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/lib/actions';

export default function LoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    const formData = new FormData(e.target);
    const user = formData.get('username');
    const pwd = formData.get('password');

    try {
      await loginAdmin(user, pwd);
      // Jika sukses, arahkan ke Ruang Kendali
      router.push('/dashboard');
    } catch (err) {
      setErrorMsg(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans selection:bg-purple-200">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30 text-3xl">🚀</div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">FluxWedding Admin</h1>
          <p className="text-sm text-slate-500">Silakan masuk ke ruang kendali.</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold text-center animate-[fadeIn_0.3s]">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Username</label>
            <input 
              type="text" 
              name="username" 
              required 
              autoComplete="username"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-400 focus:bg-white transition-colors text-sm font-medium text-slate-800" 
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              autoComplete="current-password"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-400 focus:bg-white transition-colors text-sm font-medium text-slate-800" 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-2 bg-slate-900 text-white py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-purple-600 shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Memproses...</>
            ) : 'Masuk Sistem'}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Secure Area • v1.0
        </p>
      </div>
    </div>
  );
}
