# InviteWithFlux

InviteWithFlux adalah layanan undangan digital pernikahan yang dikelola admin. Calon klien memilih tema, menyelesaikan pemesanan melalui WhatsApp, lalu menerima link onboarding sekali pakai. Admin mengelola paket, publikasi, akses edit, dan masa aktif undangan.

> Status: pemulihan fondasi V2. Branch `main` lama belum layak digunakan untuk data pelanggan nyata atau production.

## Stack

- Next.js 16 App Router
- React 19
- Supabase (Postgres)
- Cloudinary
- Tailwind CSS 4

## Alur produk V2

1. Klien memilih tema dan menghubungi admin.
2. Admin membuat pesanan/tiket onboarding.
3. Klien mengisi onboarding satu kali.
4. Sistem membuat draft dan preview.
5. Admin melakukan pemeriksaan.
6. Undangan dipublikasikan.
7. Klien dapat menggunakan link edit terbatas sesuai paket.

Tahap draft/review masih menjadi target V2; kode legacy saat ini belum menyelesaikan seluruh lifecycle tersebut.

## Menjalankan secara lokal

Persyaratan: Node.js 24 dan npm.

```bash
npm install
cp .env.example .env.local
npm run admin:hash-password -- "password-admin-minimal-12-karakter"
npm run dev
```

Salin hasil hash ke `ADMIN_PASSWORD_HASH`. Buat `ADMIN_SESSION_SECRET` acak dengan panjang minimal 32 karakter. Jangan pernah memasukkan `.env.local`, service-role key, password, atau token pelanggan ke Git.

## Quality gates

```bash
npm test
npm run lint
npm audit --omit=dev
npm run build
```

## Environment variables

| Variable | Akses | Kegunaan |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser + server | URL proyek Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser + server | Kunci publik yang dibatasi RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Server saja | Operasi backend tepercaya |
| `CLOUDINARY_URL` | Server saja | Upload dan penghapusan media |
| `NEXT_PUBLIC_BASE_URL` | Browser + server | URL dasar aplikasi |
| `ADMIN_USERNAME` | Server saja | Username dashboard |
| `ADMIN_PASSWORD_HASH` | Server saja | Hash password `scrypt` |
| `ADMIN_SESSION_SECRET` | Server + Proxy | Penandatangan sesi admin |

## Dokumentasi proyek

- [Definisi produk](docs/PRODUCT.md)
- [Matriks paket](docs/TIER_MATRIX.md)
- [Model data](docs/DATA_MODEL.md)
- [Keamanan](docs/SECURITY.md)
- [Pertanyaan terbuka](docs/OPEN_QUESTIONS.md)
- [Keputusan selective rebuild](docs/DECISIONS/0001-selective-rebuild.md)

## Aturan kontribusi

- Jangan mengembangkan fitur baru langsung pada legacy `main`.
- Semua operasi sensitif wajib memeriksa otorisasi di server action/route handler.
- Data publik harus melewati DTO allowlist; jangan memakai `select('*')` untuk halaman publik.
- Perubahan aturan paket harus dimulai dari `src/lib/tier-policy.js` dan dilindungi test.
- Perubahan database harus berupa migration yang dapat ditinjau dan diuji.
