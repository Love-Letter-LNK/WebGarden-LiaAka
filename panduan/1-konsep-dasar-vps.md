# BAB 1: Konsep Dasar VPS & Teknologi (The Big Picture) 🌍

Dokumen ini menjelaskan secara mendalam apa itu VPS, bagaimana ia bekerja, dan teknologi apa saja yang menjadikannya sebuah "Server".

---

## 1. Apa itu VPS? (Bayangkan "Kavling Tanah Digital")

**VPS (Virtual Private Server)** ibarat Anda menyewa sebuah **Kavling Tanah** di dunia internet.
- **Shared Hosting (Murah)**: Ibarat tinggal di Kos-kosan. Kamar mandi gantian, parkiran sempit. Kalau tetangga berisik (website tetangga berat), Anda ikut terganggu. Anda tidak boleh merenovasi kamar sembarangan.
- **VPS (Milik Anda)**: Ibarat menyewa Ruko Ruko sendiri. Anda bebas mengecat tembok, menjebol pintu, memasang CCTV, atau menjadikan toko apapun yang Anda mau. Tetangga tidak akan mengganggu performa Ruko Anda.

### Kenapa VPS?
Karena kita butuh **kontrol penuh**. Aplikasi modern (seperti Lia & Zekk Garden) butuh program khusus (Node.js) yang seringkali tidak diizinkan berjalan di Shared Hosting biasa.

---

## 2. Tim Pekerja di Dalam VPS Anda

Agar VPS bisa melayani pengunjung website, kita merekrut "tim pekerja". Berikut profil lengkap mereka:

### A. Node.js (Si Koki / Mesin Utama) 👨‍🍳
*   **Peran**: Mengolah pesanan.
*   **Tugas**: Di aplikasi kita, Node.js adalah otak yang berpikir.
    *   "Ambil data kenangan dari database!"
    *   "Cek apakah password admin benar!"
    *   "Simpan pesan yang dikirim pengunjung!"
*   **Karakteristik**: Dia bekerja di "Dapur" (Port 3001). Pengunjung tidak boleh langsung masuk ke dapur.

### B. Nginx (Si Resepsionis & Satpam) 👮‍♂️
*   **Peran**: Menerima tamu di pintu depan.
*   **Tugas**:
    1.  **Menyapa Tamu**: Saat orang mengetik `liaazekk.com`, Nginx yang pertama menjawab.
    2.  **Membagi Tugas (Reverse Proxy)**:
        *   "Oh, Anda mau lihat gambar? Silakan lihat di rak pajangan (Folder Static)."
        *   "Oh, Anda mau login? Silakan bicara sama Koki di dapur (Node.js)."
    3.  **Keamanan**: Memastikan tidak ada orang iseng yang melempar batu langsung ke dapur.
*   **Kenapa tidak langsung ke Node.js?** Node.js jago masak, tapi tidak jago menyambut tamu serbuan (DDoS). Nginx sangat kuat menangani ribuan tamu sekaligus.

### C. PM2 (Si Mandor yang Galak) 👷‍♂️
*   **Peran**: Mengawasi Koki (Node.js).
*   **Tugas**:
    *   Memastikan Node.js bekerja 24 jam.
    *   **Auto-Restart**: Jika Node.js tiba-tiba pingsan (error/crash), PM2 akan menyiramnya dengan air (restart) dalam hitungan milidetik agar bangun lagi.
    *   **Startup**: Jika VPS mati lampu (reboot), PM2 memastikan Node.js otomatis absen kerja lagi saat lampu menyala.

---

## 3. Bagaimana Jika Pakai Bahasa Lain? 🐍🐘

Konsep "Tim Pekerja" ini berlaku universal, hanya nama pegawainya yang beda:

| Posisi | Node.js (JavaScript) | Laravel (PHP) | Django (Python) | Golang |
| :--- | :--- | :--- | :--- | :--- |
| **Koki (Mesin)** | Node.exe | PHP-FPM | Gunicorn / Uvicorn | Binary App |
| **Mandor** | PM2 | Supervisor | Gunicorn / Systemd | Systemd |
| **Resepsionis** | **Nginx** | **Nginx** | **Nginx** | **Nginx** |
| **Database** | Postgres/MySQL | MySQL | Postgres | Postgres |

**Kesimpulan:**
Apapun bahasa pemrogramannya, Anda hampir selalu butuh **Nginx** sebagai resepsionis dan sebuah **Database**. Yang berubah hanya siapa yang memasak di dapur.
