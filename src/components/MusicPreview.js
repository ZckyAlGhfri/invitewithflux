'use client';
import { useState, useRef, useEffect } from 'react';

export default function MusicPreview({ url }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Jika URL berubah (user memilih lagu lain), hentikan lagu sebelumnya
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioRef.current.load();
    }
  }, [url]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Jika tidak ada URL atau custom, jangan tampilkan preview
  if (!url || url === 'custom') return null;

  return (
    <div className="flex items-center gap-4 mt-4 p-4 bg-purple-50 rounded-2xl border border-purple-100 transition-all">
      <audio ref={audioRef} src={url} onEnded={() => setIsPlaying(false)} />
      <button
        type="button"
        onClick={togglePlay}
        className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg hover:bg-purple-700 hover:scale-105 transition-all shrink-0"
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        ) : (
          <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        )}
      </button>
      <div>
        <p className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-1">Preview Audio</p>
        <p className="text-sm text-purple-900 font-medium">
          {isPlaying ? 'Sedang Memutar...' : 'Dengarkan Lagu Pengiring'}
        </p>
      </div>
    </div>
  );
}