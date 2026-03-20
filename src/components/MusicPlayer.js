'use client';
import { useState, useEffect, useRef } from 'react';

export default function MusicPlayer({ audioUrl, isPlaying, setIsPlaying }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log("Autoplay diblokir browser"));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <>
      <audio ref={audioRef} src={audioUrl} loop />
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="fixed bottom-6 left-6 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-slate-200 hover:scale-110 transition-all group"
      >
        {isPlaying ? (
          <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
        ) : (
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
        )}
      </button>
    </>
  );
}