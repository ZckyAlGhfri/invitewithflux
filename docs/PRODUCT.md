# Definisi Produk V2

## Tujuan

InviteWithFlux membantu admin menjual dan mengelola undangan digital pernikahan dengan proses onboarding yang terstruktur, hasil yang konsisten, dan kontrol akses yang aman.

## Pengguna

- **Pengunjung:** melihat landing page dan katalog tema.
- **Admin:** mengelola pesanan, paket, status, publikasi, dan dukungan klien.
- **Klien:** mengisi onboarding dan, bila paket mengizinkan, memperbarui data melalui link terbatas.
- **Tamu:** membuka undangan, menggunakan nama tamu personal, dan mengirim RSVP bila tersedia.

## Alur utama

1. Pengunjung memilih tema.
2. Harga dan pembayaran dibicarakan melalui WhatsApp.
3. Admin membuat pesanan dan link onboarding satu kali.
4. Klien mengisi data serta media.
5. Sistem membuat draft yang dapat dipreview.
6. Admin memeriksa dan memublikasikan undangan.
7. Admin dapat mengunci atau mencabut akses.
8. Undangan berakhir otomatis sesuai masa aktif paket.

## Batas V2 pertama

Termasuk:

- Landing page dan katalog tiga tema.
- Login dan sesi admin yang aman.
- Ticket onboarding sekali pakai.
- Draft, preview, review, dan publish.
- Link edit yang dapat dicabut.
- Lock dan expiry.
- RSVP serta moderasi.
- Upload gambar tervalidasi.
- Test alur kritis, migration, RLS, logging, dan staging.

Tidak termasuk:

- Payment gateway.
- Reseller atau affiliate.
- Banyak peran staff.
- Page builder bebas.
- Jenis acara selain pernikahan.
- Custom domain otomatis.
- Aplikasi mobile.

## Prinsip keputusan

- Produk tetap wedding-first, tetapi model event tidak boleh menghalangi ekspansi di masa depan.
- Admin tetap mengendalikan publikasi; onboarding tidak langsung menjadi halaman publik final.
- Kode legacy adalah referensi visual dan perilaku, bukan sumber kebenaran keamanan.
- Dokumen, migration, dan test menggantikan ingatan percakapan sebagai sumber kebenaran.
