# ADR 0001: Selective Rebuild V2

- Status: diterima
- Tanggal: 2026-08-28

## Konteks

Project legacy telah berhenti dikembangkan beberapa bulan, sebagian konteks keputusan hilang, data Supabase hanya demo, dan audit menemukan kelemahan pada autentikasi, token, akses data, upload, serta integritas mutasi. Di sisi lain, landing page, tema, form, dan konsep produk masih bernilai.

## Keputusan

Gunakan selective rebuild pada branch terpisah:

- Pertahankan UI, tema, serta alur bisnis yang masih relevan sebagai referensi.
- Bangun ulang auth, data access, database/RLS, token, upload, transaksi, dan lifecycle.
- Fokus hanya pada undangan pernikahan untuk V2 pertama.
- Jadikan dokumentasi, migration, dan test sebagai sumber kebenaran.
- Jangan mengembangkan fitur pertumbuhan pada legacy `main`.

## Konsekuensi

Positif:

- Tidak perlu mengulang seluruh pengalaman visual.
- Risiko legacy tidak diteruskan tanpa pemeriksaan.
- Konteks proyek dapat dipulihkan tanpa mengandalkan ingatan pembuat.

Biaya:

- Beberapa fitur yang tampak selesai harus dibangun ulang secara internal.
- Migration per alur dan test membutuhkan waktu sebelum fitur baru ditambahkan.
- Legacy dan V2 harus dibedakan dengan jelas sampai migrasi selesai.
