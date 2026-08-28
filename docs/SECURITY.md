# Keamanan

## Model kepercayaan

- Browser, query string, form, cookie, dan metadata file selalu dianggap tidak tepercaya.
- Supabase anon key boleh tampil di browser hanya bila seluruh tabel terkait dilindungi RLS.
- Service-role key dan kredensial Cloudinary hanya boleh digunakan dari modul `server-only`.
- Proxy membantu navigasi, tetapi setiap operasi sensitif tetap wajib mengotorisasi dirinya sendiri.

## Kontrol yang sudah diterapkan pada branch fondasi

- Sesi admin HMAC-SHA256 dengan cookie `HttpOnly`, `SameSite=Lax`, dan masa aktif 8 jam.
- Password admin diverifikasi menggunakan salted `scrypt` hash dari environment.
- Server actions dashboard memanggil pemeriksaan admin.
- Halaman publik memakai select dan DTO allowlist; token serta ID internal tidak ikut dikirim.
- Lock/status diperiksa sebelum undangan dan RSVP dilayani.
- Tier ditegakkan di server dan payload publik.
- ID, slug, token, search, dan RSVP divalidasi.
- Upload hanya menerima JPEG/PNG/WebP hingga 5 MB dan memeriksa magic bytes.
- Upload/delete Cloudinary memerlukan konteks admin atau token undangan yang valid.
- Test regresi melindungi kontrol inti tersebut.

## Konfigurasi wajib

- Gunakan secret berbeda untuk local, staging, dan production.
- `ADMIN_SESSION_SECRET` minimal 32 karakter acak.
- `ADMIN_PASSWORD_HASH` dibuat melalui `npm run admin:hash-password`.
- Rotasi seluruh token legacy sebelum menerima data pelanggan nyata.
- Jangan menggunakan service-role key pada variabel `NEXT_PUBLIC_*`.
- Jangan menyalin credential ke issue, PR, screenshot, atau chat.

## Stop-ship yang masih terbuka

Branch ini belum layak dipromosikan ke production sampai seluruh item berikut selesai:

- Migration Supabase yang dapat direproduksi.
- RLS policy beserta test allow/deny.
- RPC/transaksi untuk onboarding dan pembaruan multi-tabel.
- Token onboarding/edit yang di-hash, memiliki expiry, dan rate limit.
- Ownership media yang tersimpan di database.
- Draft/review/publish serta expiry lifecycle lengkap.
- Logging, alerting, backup, dan recovery test.
- E2E test pada project staging nyata.
- Rate limit terdistribusi untuk login, validasi token, upload, dan RSVP.

## Pelaporan masalah

Jangan membuka detail kerentanan atau credential pada issue publik. Catat reproduksi tanpa data rahasia dan lakukan rotasi credential bila ada kemungkinan terekspos.
