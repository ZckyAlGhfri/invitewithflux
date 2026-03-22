'use client';
import { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/cropUtils';

// Tambahkan prop aspectRatio, default 3:4 (Portrait)
export default function ImageUploader({ label, currentImage, onUploadSuccess, aspectRatio = 3/4 }) {
  const [preview, setPreview] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Render preview dari database atau file lokal
  useEffect(() => {
    if (!currentImage) {
      setPreview(null);
    } else if (typeof currentImage === 'string') {
      setPreview(currentImage); // URL dari Supabase
    } else if (currentImage instanceof Blob || currentImage instanceof File) {
      const objectUrl = URL.createObjectURL(currentImage);
      setPreview(objectUrl); // File lokal hasil crop
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [currentImage]);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setShowModal(true); // Buka modal crop
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onUploadSuccess(croppedImageBlob); // Lempar file fisik ke EditClient
      setShowModal(false);
    } catch (e) {
      console.error(e);
      alert('Gagal memotong gambar');
    }
  };

  return (
    <div className="w-full">
      {label && <label className="text-[11px] md:text-xs text-slate-500 font-bold uppercase tracking-widest mb-1.5 md:mb-2 block">{label}</label>}
      
      {/* ADJUST HP: padding h-48 md:h-56, rounded-xl sm:rounded-[2rem] */}
      <label className="relative flex flex-col items-center justify-center w-full h-48 md:h-56 border-2 border-slate-300 border-dashed rounded-2xl md:rounded-[2rem] bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all overflow-hidden group shadow-sm">
        {preview ? (
          <div className="relative w-full h-full">
            <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
            <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center z-10">
               {/* ADJUST HP: padding p-2 md:p-3, text-[10px] md:text-xs */}
               <div className="p-2 md:p-3 bg-white/20 backdrop-blur-md text-white rounded-full shadow-2xl mb-1.5 md:mb-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
               </div>
               <span className="text-white text-[10px] md:text-xs font-bold tracking-widest uppercase drop-shadow-md">Ganti & Crop</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors z-10 p-4">
            <svg className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            <p className="mb-1 text-xs md:text-sm font-bold text-slate-600 text-center">Klik untuk pilih gambar</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Maks 5MB</p>
          </div>
        )}
        <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
      </label>

      {/* MODAL CROP HITAM ELEGAN - MOBILE-FRIENDLY */}
      {showModal && (
        <div className="fixed inset-0 z-[999] bg-slate-950/95 backdrop-blur-lg flex flex-col items-center justify-center p-2 sm:p-4">
          
          {/* ADJUST HP: padding h-[50vh] sm:h-[60vh], rounded-xl sm:rounded-3xl */}
          <div className="relative w-full max-w-2xl h-[50vh] sm:h-[60vh] bg-slate-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              // Penyesuaian agar di HP tidak error saat touch
              onTouchStart={(e) => e.stopPropagation()} 
            />
          </div>

          {/* ADJUST HP: mt-4 sm:mt-6, p-4 sm:p-5 flex-col xs:flex-row */}
          <div className="w-full max-w-2xl mt-4 sm:mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/10 p-4 md:p-5 rounded-2xl backdrop-blur-lg border border-white/10">
            
            {/* Slider touch-friendly */}
            <input type="range" value={zoom} min={1} max={3} step={0.1} aria-labelledby="Zoom" onChange={(e) => setZoom(e.target.value)} className="w-full sm:w-1/2 h-4 accent-amber-500 cursor-pointer" />
            
            {/* ADJUST HP: gap-3 sm:gap-4 flex-col-reverse xs:flex-row w-full sm:w-auto */}
            <div className="flex flex-col-reverse xs:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <button type='button' onClick={() => setShowModal(false)} className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm md:text-base text-slate-300 hover:bg-white/10 transition-colors">Batal</button>
              <button type='button' onClick={showCroppedImage} className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm md:text-base text-slate-950 bg-amber-400 hover:bg-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95">
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5"/></svg>
                 Selesai Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}