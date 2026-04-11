'use client';
import { useEffect } from 'react';

export default function useSecurity() {
  useEffect(() => {
    // 1. Blokir Klik Kanan
    const handleContextMenu = (e) => e.preventDefault();
    
    // 2. Blokir Shortcut Keyboard Hacker (F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, Ctrl+C)
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || 
        (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'c'))
      ) {
        e.preventDefault();
        return false;
      }
    };

    // 3. Blokir Drag & Drop Gambar
    const handleDragStart = (e) => {
      if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);
}