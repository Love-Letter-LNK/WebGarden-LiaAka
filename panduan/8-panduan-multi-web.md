# BAB 8: Hosting Banyak Website di 1 VPS 🏢

Pertanyaan sering muncul: *"Bisakah saya punya 2 website (misal: `aka-lia.love` dan `zakaria-portfolio.com`) dalam 1 VPS murah yang sama?"*

**JAWABANNYA: BISA BANGET! ✅**

VPS itu seperti gedung apartemen. Anda bisa menyewakan banyak kamar (website) di dalamnya, selama "listrik dan air" (RAM & CPU) cukup.

Berikut konsep dasarnya:

---

## 1. Konsep "Pintu Kamar" (Port) 🚪

Setiap aplikasi Node.js butuh "pintu" (Port) yang unik supaya tidak tabrakan.

*   **Website 1 (Aka & Lia):** Jalan di Port `3001`.
*   **Website 2 (Portfolio):** Jalan di Port `3002`.
*   **Website 3 (Toko Online):** Jalan di Port `3003`.

**Caranya:**
Di setiap project, edit file `server/ecosystem.config.js` atau `.env` untuk membedakan port.

```javascript
// ecosystem.config.js (Website 2)
module.exports = {
  apps: [{
    name: "portfolio-server", // Nama HARUS beda
    script: "./index.js",
    env: {
      PORT: 3002, // Port HARUS beda
    }
  }]
}
```

---

## 2. Konsep "Resepsionis" (Nginx) 👩‍💼

Nginx bertugas sebagai resepsionis yang mengarahkan tamu ke kamar yang benar berdasarkan nama domain yang mereka sebut.

Anda perlu membuat **2 file konfigurasi Nginx** berbeda.

**File 1: `/etc/nginx/sites-available/aka-lia`**
```nginx
server {
    server_name aka-lia.love;
    location / {
        proxy_pass http://localhost:3001; # Arahkan ke pintu 3001
    }
}
```

**File 2: `/etc/nginx/sites-available/portfolio`**
```nginx
server {
    server_name zakaria-portfolio.com;
    location / {
        proxy_pass http://localhost:3002; # Arahkan ke pintu 3002
    }
}
```

---

## 3. Langkah-Langkah Menambah Website Baru 🛠️

Misal Anda mau upload website kedua bernama `toko-baju`.

1.  **Siapkan Folder:**
    Buat folder baru di sebelah folder lama.
    ```bash
    cd /var/www
    mkdir toko-baju
    # Upload kode ke sini via Git
    ```

2.  **Install & Build:**
    Lakukan `npm install` dan `npm run build` seperti biasa di folder baru itu.

3.  **Jalankan Backend (PM2):**
    ```bash
    cd /var/www/toko-baju/server
    pm2 start ecosystem.config.js
    ```
    Sekarang kalau ketik `pm2 list`, Anda akan lihat 2 baris:
    *   `liaaka-server` (Online)
    *   `toko-baju` (Online)

4.  **Setting Nginx:**
    Copy config lama biar cepat:
    ```bash
    sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/toko-baju
    sudo nano /etc/nginx/sites-available/toko-baju
    ```
    *Ubah `server_name` jadi domain baru, dan `proxy_pass` ke port baru (misal 3002).*

5.  **Aktifkan:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/toko-baju /etc/nginx/sites-enabled/
    sudo systemctl restart nginx
    sudo certbot --nginx -d tokobaju.com  # Pasang HTTPS
    ```

---

## 4. Recap Update Website (Mantra Sakti) 🔄

Untuk menjawab pertanyaan pertama Anda: *"Bagaimana cara update?"*

Selalu gunakan urutan ini ("Mantra Sakti") setiap kali habis push ke GitHub:

1.  **Masuk Kandang:** `cd /var/www/WebGarden-LiaAka`
2.  **Tarik Kode:** `git pull`
3.  **Bangun Ulang (Frontend):**
    ```bash
    cd client
    npm install
    npm run build
    ```
4.  **Restart Mesin (Backend):**
    ```bash
    cd ../server
    pm2 restart all
    ```

Kalau punya 2 website, pastikan masuk ke folder yang benar dulu sebelum menjalankan mantra ini!
