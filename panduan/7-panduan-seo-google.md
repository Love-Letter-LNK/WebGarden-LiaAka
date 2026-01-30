# BAB 7: Panduan SEO & Indexing Google 🔍

Sekarang website Anda sudah punya "Peta" (`sitemap.xml`) dan undangan resmi untuk Google (`robots.txt`).
Langkah selanjutnya adalah **Mendaftarkan Website ke Google Search Console (GSC)** agar muncul di pencarian.

---

## Langkah 1: Daftar Google Search Console 📝

1.  Buka [Google Search Console](https://search.google.com/search-console).
2.  Login dengan akun Google (Gmail) Anda.
3.  Pilih tipe properti **"URL Prefix"** (Sebelah kanan).
4.  Masukkan URL website Anda: `https://aka-lia.love`
5.  Klik **Continue**.

---

## Langkah 2: Verifikasi Kepemilikan ✅

Google butuh bukti kalau ini website Anda. Ada banyak cara, pilih **HTML Tag** (paling gampang).

1.  Pilih opsi **HTML Tag**.
2.  Copy kode `<meta name="google-site-verification" ... />` yang muncul.
3.  **Halaman Admin:** Karena kita belum punya fitur input meta tag di admin, Anda perlu kirim kode ini ke saya (atau paste di `index.html` seperti tadi).
    *   *Alternatif:* Gunakan metode **DNS Record** (jika Anda punya akses ke Cloudflare/Penyedia Domain). Ini lebih bersih.

---

## Langkah 3: Submit Sitemap (Peta Situs) 🗺️

Setelah terverifikasi:

1.  Di menu kiri GSC, klik **Sitemaps**.
2.  Di kolom "Add a new sitemap", ketik: `sitemap.xml`
3.  Klik **Submit**.
4.  Status harusnya **"Success"**.
    *   *Kalau error:* Tunggu 24 jam, Google kadang butuh waktu.

**Apa gunanya?**
Ini memberi tahu Google: *"Hei, ini daftar semua halaman di website saya (berita, kenangan, profil). Tolong baca semuanya ya!"*

---

## Langkah 4: Request Indexing Manual (Deploy Manual) 🚀

Kalau Anda baru saja posting **Berita Penting** dan ingin muncul di Google *sekarang juga* (tanpa nunggu berhari-hari):

1.  Di GSC, klik kolom pencarian di atas **("Inspect any URL")**.
2.  Paste URL halaman baru tersebut (misal: `https://aka-lia.love/news/kejutan-ultah`).
3.  Tekan Enter.
4.  Tunggu loading... lalu klik tombol **"REQUEST INDEXING"**.
5.  Selesai! Google akan memprioritaskan antrian untuk halaman itu.

---

## Ringkasan: Otomatis vs Manual

*   **Otomatis:** Setiap kali Anda `npm run build` di VPS, `sitemap.xml` di website ikut terupdate (tanggalnya). Google akan mampir sendiri secara berkala (mingguan).
*   **Manual:** Pakai fitur **"Request Indexing"** di GSC kalau Anda tidak sabar.

---

**Tips:**
SEO butuh waktu. Setelah submit sitemap, biasanya butuh **3-7 hari** sampai website Anda muncul kalau diketik "Aka dan Lia" di Google. Bersabar ya! 🌱
