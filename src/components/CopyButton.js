'use client';
import { useState } from 'react';

export default function CopyButton({ textToCopy, label, type = 'blue' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colors = {
    blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100',
    purple: 'text-purple-600 bg-purple-50 hover:bg-purple-100',
  };

  return (
    <button 
      onClick={handleCopy}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${colors[type]}`}
      title={textToCopy}
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Tersalin
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
          {label}
        </>
      )}
    </button>
  );
}