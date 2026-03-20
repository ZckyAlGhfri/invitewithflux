'use client';
import { useState } from 'react';
import { uploadImage } from '@/lib/cloudinary';

export default function ImageUploader({ label, imageUrl, onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    setError('');
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    const response = await uploadImage(formData);

    if (response.success) {
      onUploadSuccess(response.url);
    } else {
      setError('Gagal mengunggah gambar. Coba lagi.');
    }

    setIsUploading(false);
  };

  return (
    <div className="w-full">
      <label className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 block">
        {label}
      </label>
      
      <div className="relative flex items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 overflow-hidden hover:bg-slate-100 transition-all cursor-pointer group">
        
        {isUploading && (
          <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin mb-2"></div>
            <p className="text-xs font-bold text-slate-600 animate-pulse">Mengunggah...</p>
          </div>
        )}

        {imageUrl ? (
          <div className="relative w-full h-full">
            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-bold bg-slate-900/80 px-4 py-2 rounded-lg backdrop-blur-md">Ganti Foto</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <svg className="w-8 h-8 mb-2 opacity-50 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span className="text-sm font-medium">Klik untuk pilih gambar</span>
            <span className="text-[10px] uppercase tracking-widest mt-1 opacity-70">Maks 5MB</span>
          </div>
        )}

        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
      </div>
      
      {error && <p className="text-xs font-bold text-red-500 mt-2">{error}</p>}
    </div>
  );
}