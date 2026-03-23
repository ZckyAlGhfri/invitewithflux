import Link from 'next/link';

export default function TemplatesGallery() {
  const templates = [
    {
      id: 'luxury',
      name: 'Luxury Dark',
      tier: 'Basic',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
      description: 'Nuansa gelap elegan dengan aksen emas yang mewah. Cocok untuk pernikahan malam hari (Night Reception).',
      features: ['Gold Accents', 'Smooth Fade', 'Dark Mode']
    },
    {
      id: 'classic',
      name: 'Royal Classic',
      tier: 'Premium',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800',
      description: 'Terang, formal, dan berwibawa khas gaya keraton dengan tekstur kertas mahal dan ukiran floral.',
      features: ['Ivory White', 'Serif Typography', 'Floral Watermark']
    },
    {
      id: 'modern',
      name: 'Urban Modern',
      tier: 'Exclusive',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800',
      description: 'Bold, minimalis, dan sangat kekinian. Menggunakan tipografi raksasa dan kontras warna yang ekstrem.',
      features: ['High Contrast', 'Giant Typography', 'Asymmetric Grid']
    }
  ];

  const tierStyles = {
    Basic: 'bg-slate-100 text-slate-600',
    Premium: 'bg-blue-100 text-blue-700',
    Exclusive: 'bg-amber-100 text-amber-700 font-bold border border-amber-200'
  };

  return (
    <main className="p-6 md:p-8 lg:p-10 animate-[fadeIn_0.4s_ease-out]">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/dashboard" className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
              </Link>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Galeri Template</h1>
            </div>
            <p className="text-slate-500 text-sm ml-12">Kelola desain undangan yang tersedia untuk klien Anda.</p>
          </div>
          <button className="px-6 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-amber-600 transition-colors shadow-lg active:scale-95 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            Tambah Tema Baru
          </button>
        </div>

        {/* GRID TEMPLATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((tpl) => (
            <div key={tpl.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col">
              
              {/* IMAGE PREVIEW */}
              <div className="aspect-[4/3] w-full relative overflow-hidden bg-slate-100">
                <img 
                  src={tpl.image} 
                  alt={tpl.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm backdrop-blur-md bg-white/90 ${tierStyles[tpl.tier]}`}>
                    {tpl.tier}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-green-500 text-white shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> {tpl.status}
                  </span>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-bold text-slate-900 mb-2">{tpl.name}</h2>
                <p className="text-xs text-slate-500 leading-relaxed mb-6 flex-1">
                  {tpl.description}
                </p>
                
                {/* FEATURES BADGES */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {tpl.features.map((feat, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-wider rounded-lg">
                      {feat}
                    </span>
                  ))}
                </div>

                {/* ACTIONS */}
                <div className="grid grid-cols-2 gap-3 mt-auto pt-6 border-t border-slate-100">
                  <button className="py-2.5 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors">
                    Edit Detail
                  </button>
                  <button className="py-2.5 bg-white text-red-500 hover:bg-red-50 border border-red-100 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors">
                    Nonaktifkan
                  </button>
                </div>
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}