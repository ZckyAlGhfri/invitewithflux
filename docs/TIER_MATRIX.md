# Matriks Paket

File sumber kebijakan runtime: `src/lib/tier-policy.js`.

| Kemampuan | Basic | Premium | Exclusive |
|---|---:|---:|---:|
| Masa aktif target | 90 hari | 180 hari | 365 hari |
| Tema | Luxury | Luxury, Classic | Luxury, Classic, Modern |
| Galeri | Tidak ada | Maks. 5 | Maks. 10 |
| Rekening/kado digital | Tidak ada | Maks. 5 | Maks. 5 |
| RSVP | Tidak | Ya | Ya |
| Nama tamu personal | Tidak | Ya | Ya |
| Edit mandiri | Tidak | Ya | Ya |
| Love Story | Tidak | Tidak | Maks. 10 |
| Tata tertib | Tidak | Tidak | Maks. 10 |
| Video prewedding | Tidak | Tidak | Ya |
| Alamat kado fisik | Tidak | Tidak | Ya |
| Export guestbook | Tidak | Tidak | Ya |

## Aturan implementasi

- UI hanya menjelaskan kemampuan; server tetap menjadi penegak utama.
- Request yang memuat fitur di luar paket harus dipangkas atau ditolak di server.
- DTO publik hanya mengirim data yang diizinkan paket.
- Perubahan isi paket harus memperbarui kebijakan, pricing, dokumentasi, dan test dalam commit yang sama.
- Expiry 90/180/365 hari adalah target V2 dan belum boleh dianggap selesai sebelum migration serta pemeriksaan runtime tersedia.
