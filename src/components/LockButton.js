'use client';
import { toggleLock } from '@/lib/actions';
import { useTransition } from 'react';

export default function LockButton({ id, isLocked }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleLock(id, !!isLocked); // Pastikan boolean
    });
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      title={isLocked ? "Buka Kunci" : "Kunci Undangan"} 
      className={`p-2 rounded-lg transition-colors ${
        isLocked 
          ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' 
          : 'bg-green-100 text-green-600 hover:bg-green-200'
      } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
    >
      {isLocked ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      )}
    </button>
  );
}