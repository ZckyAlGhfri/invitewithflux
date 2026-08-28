# Pertanyaan Terbuka

Pertanyaan berikut tidak menghalangi checkpoint keamanan fondasi, tetapi harus diputuskan sebelum V2 selesai.

| ID | Pertanyaan | Rekomendasi sementara |
|---|---|---|
| `PROD-001` | Siapa yang menyetujui draft: admin saja atau klien juga? | Admin menjadi penerbit final; klien dapat memberi konfirmasi |
| `PROD-002` | Kapan masa aktif mulai dihitung? | Sejak `published_at`, bukan sejak ticket dibuat |
| `PROD-003` | Apakah edit memperpanjang masa aktif? | Tidak; perpanjangan dilakukan eksplisit oleh admin |
| `PROD-004` | Apakah RSVP tetap dapat dibaca setelah expired? | Hanya admin; halaman publik dan submit ditutup |
| `PROD-005` | Apakah slug dapat diubah setelah publish? | Tidak secara normal; admin dapat membuat redirect terkontrol |
| `BRAND-001` | Nama publik final | Gunakan InviteWithFlux sampai keputusan baru dibuat |
| `OPS-001` | Retensi data setelah expired | Tentukan sebelum pelanggan nyata: archive lalu hapus terjadwal |
| `OPS-002` | Kebijakan revisi dan refund | Dokumentasikan sebelum penjualan |

Keputusan baru harus dicatat dalam dokumen keputusan (`docs/DECISIONS`) dan dihapus dari tabel ini bila sudah final.
