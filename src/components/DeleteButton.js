'use client'; // Ini wajib agar bisa pakai onClick dan confirm browser
import { deleteTicket } from '@/lib/actions';

export default function DeleteButton({ id }) {
  
  const handleDelete = async () => {
    // Popup konfirmasi asli dari browser
    if (window.confirm('Yakin ingin menghapus klien ini beserta seluruh datanya secara permanen?')) {
      await deleteTicket(id); // Panggil Server Action jika ditekan OK
    }
  };

  return (
    <button 
      onClick={handleDelete}
      title="Hapus Permanen" 
      className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
    </button>
  );
}