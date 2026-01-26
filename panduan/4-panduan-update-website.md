# BAB 4: Panduan Update Website (Dinamis vs Statis) 🔄

Ini adalah bab **PALING PENTING** untuk operasional harian Anda.
Banyak orang bingung: *"Saya sudah ubah kode di laptop, kok di VPS gak berubah?"*

Jawabannya tergantung: Apa yang Anda ubah?

---

## KASUS A: Update Konten Dinamis (Berita, Memori, User) 📝

Jika Anda hanya ingin:
*   Menambah berita baru.
*   Upload foto kenangan baru.
*   Edit profil biodata.

**TIDAK PERLU CODING / RESTART SERVER.**
Cukup login ke Admin Panel (`/__admin/login`) dan edit dari sana. Perubahan langsung tersimpan di Database dan langsung muncul di website detik itu juga.

---

## KASUS B: Update Tampilan / Fitur (Ganti Warna, Tambah Tombol, Ubah Layout) 🎨

Ini disebut **Perubahan Kode (Code Changes)**.
Karena React (Frontend) adalah folder "Static" yang harus "Dibangun Ulang" (Rebuild), alurnya lebih panjang.

### Langkah 1: Di Laptop (Coding) 💻
1.  Edit kode di VS Code (misal warnain tombol jadi merah).
2.  Test di laptop (`npm run dev`), pastikan oke.
3.  **Kirim ke GitHub:**
    ```bash
    git add .
    git commit -m "Ubah warna tombol jadi merah"
    git push
    ```

### Langkah 2: Di VPS (Deployment) ☁️
Masuk ke terminal VPS via SSH, lalu ikuti mantra ini:

#### 1. Tarik Kode Terbaru
```bash
cd /var/www/html
git pull
```
*Sekarang kode di VPS sudah sama dengan GitHub. TAPI... tampilan di browser belum berubah. Kenapa? Karena kita belum "membangun" ulang.*

#### 2. Install Library (Hanya jika ada library baru)
Jaga-jaga kalau Anda menambah fitur yang butuh alat baru.
```bash
cd client && npm install
cd ../server && npm install
```

#### 3. BUILD ULANG Frontend (Wajib untuk Tampilan!) 🏗️
Ini langkah kunci. React harus mengubah kode `jsx` menjadi `html/css` biasa yang dimengerti browser.
```bash
cd /var/www/html/client
npm run build
```
*Tunggu prosesnya selesai. Setelah selesai, Nginx akan otomatis menyajikan file tampilan yang baru.*

#### 4. Restart Backend (Hanya jika ubah Logic/API) 🔄
Jika yang Anda ubah adalah file di folder `server` (misal logika login, rumus data), Anda wajib restart mesin Node.js.
```bash
pm2 restart all
```

---

## Ringkasan Prosedur Update ("Mantra Sakti") ✨

Setiap kali Anda habis coding di laptop dan mau update di VPS, jalankan urutan ini di VPS:

```bash
# 1. Masuk Folder
cd /var/www/html

# 2. Ambil Kode
git pull

# 3. Update Frontend (Tampilan)
cd client
npm install
npm run build

# 4. Update Backend (Otak/Mesin) - Opsional kalau cuma ubah CSS
cd ../server
npm install
npx prisma db push   # (Hanya jika ubah struktur database)
pm2 restart all
```

**Tips:** Buatlah kopi sambil menunggu `npm run build`, karena proses ini butuh 1-2 menit tergantung kecepatan VPS.

---

## FAQ: Pertanyaan Penting ❓

### 1. Apakah database saya hilang saat update?
**JAWABAN: TIDAK.**
Saat Anda melakukan `git pull`, `npm install`, atau `pm2 restart`, database Anda (berita, user, kenangan) **100% AMAN.**
Database disimpan di file terpisah (`prod.db` atau server MySQL/Postgres) yang tidak ditimpa oleh Git.

**Pengecualian (HATI-HATI):**
Database HANYA akan hilang jika Anda menjalankan perintah:
*   `rm prisma/prod.db` (Menghapus file manual)
*   `npx prisma migrate reset` (Perintah reset total)

Jadi selama Anda hanya menjalankan "Mantra Sakti" di atas, data aman.

### 2. Bagaimana kalau saya mau backup dulu sebelum update?
Sangat disarankan! Jalankan perintah backup yang sudah kita buat:
```bash
# Backup dulu
cd /var/www/html/server
./scripts/backup-db.sh

# Baru update
git pull ...
```

### 3. Website sempat mati gak pas update?
*   Saat `git pull`: **Hidup**
*   Saat `npm run build`: **Hidup** (Pengunjung masih lihat versi lama sampai selesai)
*   Saat `pm2 restart`: **Mati sebentar (1-2 detik)** lalu hidup lagi.
*   Inilah kenapa kita pakai PM2, biar matinya cuma kedip mata.

### 4. Bagaimana dengan file Gambar/Lagu yang saya upload?
**JAWABAN: AMAN.**
File yang Anda upload lewat Admin Panel disimpan di folder khusus: `/var/www/html/server/uploads`.

Folder ini **DIABAIKAN** oleh Git (kita sudah setting `.gitignore`).
Artinya:
*   Saat `git pull`: Folder ini TIDAK disentuh.
*   Saat update kode: File foto/lagu Anda TETAP ADA.

**Penting:** Jika Anda pindah ke VPS baru, Anda harus memindahkan folder `uploads` ini secara manual karena isinya tidak ada di GitHub.
