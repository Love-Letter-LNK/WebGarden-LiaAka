# BAB 3: Struktur File & Konfigurasi (Peta Harta Karun) 🗺️

Di bab ini, kita akan membedah file-file "sakti" yang mengatur hidup-matinya aplikasi Anda. Jangan sunting file ini sembarangan tanpa tahu fungsinya.

---

## 1. `.env` (Environment Variables) 🗝️

**Lokasi:** `/var/www/html/server/.env`
**Fungsi:** Menyimpan rahasia negara.

```env
PORT=3001                  # Pintu "Dapur" internal
DATABASE_URL="..."         # Alamat & Password Database
JWT_SECRET="rahasia..."    # "Stempel" untuk tiket login user
CORS_ORIGIN="http://..."   # Siapa yang boleh akses API ini? (Wajib IP/Domain VPS)
```

**Kenapa harus ada file ini?**
Agar kode program (`index.js`) bersifat **Agnostik**. Artinya, kode program tidak perlu tahu password asli. Dia hanya memanggil `process.env.DATABASE_URL`.
Ini memungkinkan kode yang SAMA dipakai di Laptop (Dev) dan di VPS (Prod) dengan password yang BERBEDA.

---

## 2. `ecosystem.config.js` (Surat Perintah Kerja) 📋

**Lokasi:** `/var/www/html/server/ecosystem.config.js`
**Fungsi:** Instruksi untuk PM2 (Mandor).

```javascript
module.exports = {
  apps: [{
    name: "liaaka-server",   // Nama di papan pengumuman PM2
    script: "./index.js",    // File mana yang harus dijalankan?
    env: {
      NODE_ENV: "production" // Mode: Serius (Matikan fitur debug, optimalkan performa)
    }
  }]
}
```

Jika Anda mengubah nama di sini, Anda harus menghapus proses lama di PM2 dan start ulang.

---

## 3. Nginx Config (Rambu Lalu Lintas) 🚦

**Lokasi:** `/etc/nginx/sites-available/liaazekk`
**Fungsi:** Peta jalan untuk Nginx.

```nginx
server {
    listen 80;               # Dengar di port umum
    server_name 195.88...;   # Jika ada yang panggil nama ini...

    # BLOK 1: Frontend (Static)
    location / {
        root /var/www/.../dist;  # Ambil file di folder ini
        try_files $uri /index.html; # Kalau file gak ketemu, kasih index.html (SPA)
    }

    # BLOK 2: Backend (API)
    location /api/ {
        proxy_pass http://localhost:3001; # Oper ke Node.js
    }
}
```

**Penjelasan "Static vs Dynamic" di Nginx:**
*   **Static (`/`)**: Nginx melayani SENDIRI. "Nih file gambarnya, nih file HTML-nya." (Sangat Cepat).
*   **Dynamic (`/api`)**: Nginx TIDAK BISA melayani. Dia harus minta tolong Node.js. "Eh Node, ada yang minta login nih, tolong prosesin." (Butuh waktu proses).

---

## 4. `package.json` (Daftar Belanja & Resep) 🛒

**Lokasi:** `/var/www/html/server/package.json`

1.  **Dependencies**: Daftar "bahan baku" yang harus dibeli (di-download) agar aplikasi jalan. Contoh: `express`, `prisma`, `bcrypt`.
    *   Saat Anda ketik `npm install`, Node.js membaca daftar ini dan belanja otomatis.
2.  **Scripts**: Resep cara masak.
    *   `"start": "node index.js"` -> Cara menyalakan normal.
    *   `"db:seed": "node prisma/seed.js"` -> Cara mengisi data awal.

**Tips:** Jika Anda menambah library baru di laptop, file ini berubah. Makanya di VPS kita harus `npm install` lagi agar VPS "belanja" library baru tersebut.
