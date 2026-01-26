# BAB 2: Keamanan Server & Jaringan (Security Deep Dive) 🛡️

Bagaimana cara menjaga "Ruko Digital" (VPS) kita agar tidak kemalingan? Bab ini membahas lapisan keamanan secara mendalam.

---

## 1. Firewall (Tembok & Pintu Gerbang) 🧱

Bayangkan VPS Anda adalah sebuah gedung dengan **65.535 pintu** (Port).
Secara default, hacker bisa mencoba membuka pintu nomor berapa saja untuk mencari celah.

**UFW (Uncomplicated Firewall)** adalah tembok beton yang menutup SEMUA pintu, kecuali yang kita izinkan.

### Pintu yang Kita Buka:
1.  **Port 22 (SSH)**: Pintu khusus staff/admin (Anda) untuk masuk mengelola server. Pintu ini dijaga ketat (wajib bawa kunci/password).
2.  **Port 80 (HTTP)**: Pintu lobi utama untuk masyarakat umum yang ingin melihat website (Web Non-Secure).
3.  **Port 443 (HTTPS)**: Pintu lobi VIP yang terenkripsi (gembok hijau di browser).

### Pintu yang TERTUTUP (Rahasia):
*   **Port 3001 (Node.js API)**
*   **Port 5432 (Database)**

**Pertanyaan:** *Lho, kalau Port 3001 ditutup, bagaimana website bisa jalan?*
**Jawab:** Karena di dalam gedung ada **Nginx**. Nginx sudah berada "di dalam" tembok.
1.  Pengunjung masuk lewat Port 80 (Diizinkan Firewall).
2.  Nginx menyambut pengunjung.
3.  Nginx berjalan ke Port 3001 (Internal) untuk mengambil data.
4.  Nginx kembali ke Port 80 untuk memberikan data ke pengunjung.

Jadi, **hacker dari luar** tidak bisa menyentuh Port 3001 langsung. Mereka harus melewati Nginx dulu.

---

## 2. SSH & Autentikasi (Kunci Duplikat) 🔑

SSH (Secure Shell) adalah cara kita mengendalikan server dari jarak jauh.

### Level 1: Menggunakan Password
*   Cara: `ssh root@ip` -> Masukkan Password.
*   Risiko: Hacker bisa menebak password ("admin123", "password", dll).
*   Solusi: **Fail2Ban**. Program ini menghitung: "Jika orang ini salah password 3x, blokir IP-nya selama 24 jam!"

### Level 2: Menggunakan SSH Key (Kunci Fisik Digital)
*   Cara: Kita membuat sepasang file kunci. Satu disimpan di laptop (Private Key), satu ditaruh di server (Public Key).
*   Mekanisme: Saat mau masuk, server bertanya: "Mana kuncinya?". Laptop menunjukkan file kunci. Jika cocok, pintu terbuka.
*   Keamanan: **Sangat Tinggi**. Tidak ada password yang bisa ditebak. Hacker tidak bisa masuk kecuali dia mencuri laptop Anda.

---

## 3. Database Security (Least Privilege) 👮‍♀️

Prinsip keamanan database adalah: **"Jangan percaya siapapun, bahkan aplikasi sendiri."**

1.  **User Root**: Ini adalah "Dewa" database. Bisa menghapus semua data, bisa menghancurkan server.
    *   *Aturan:* Jangan pernah pakai user root di aplikasi Node.js!
2.  **User Aplikasi (liaaka_app)**: Kita buat user khusus yang "bodoh".
    *   Hanya boleh `SELECT` (baca), `INSERT` (tambah), `UPDATE` (edit).
    *   **TIDAK BOLEH** `DROP TABLE` (hapus tabel) atau `GRANT` (beri akses ke orang lain).

Jika hacker berhasil membajak aplikasi Node.js Anda, kerusakan yang bisa mereka buat terbatas karena user database-nya tidak punya kekuatan penuh.

---

## 4. HTTPS (Amplop Tertutup) ✉️

*   **HTTP (Tanpa S)**: Ibarat kirim surat pakai kartu pos. Tukang pos (penyedia internet/wifi kafe) bisa membaca isinya di jalan. Kalau user login, passwordnya terbaca.
*   **HTTPS (Secure)**: Ibarat kirim surat dalam brankas besi yang kuncinya hanya dipegang pengirim dan penerima. Tukang pos hanya bisa mengantar brankasnya, tapi tidak bisa buka isinya.

Sertifikat SSL (Let's Encrypt/Certbot) adalah yang memberikan "Brankas" ini secara gratis.
