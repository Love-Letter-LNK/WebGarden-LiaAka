# BAB 5: Kitab Suci Git (Panduan Pemula & Penyelamat) 🐙

Git adalah "Mesin Waktu" untuk kode Anda.
Dokumen ini menjelaskan perintah-perintah dasar yang wajib dikuasai dan **apa yang harus dilakukan jika terjadi bencana (salah koding)**.

---

## 1. Konsep Dasar: Apa itu Commit & Push? 📦

Bayangkan Anda sedang menulis Novel.

*   **File Koding**: Halaman kertas tempat Anda menulis.
*   **`git add`**: Anda memilih halaman mana yang mau disimpan ke dalam amplop.
*   **`git commit`**: Anda menutup amplop itu, memberinya **Label Resi** (Pesan), dan menyimpannya di Laci Meja Anda (Local Repo).
    *   *Filosofi:* Commit adalah "Save Point" (Checkpoint). Kalau codingan error, Anda bisa kembali ke titik ini.
*   **`git push`**: Anda mengirim amplop dari Laci Meja ke **Gudang Pusat** (GitHub).
    *   *Filosofi:* Publikasi. Setelah di-push, teman tim Anda (atau VPS) bisa melihat amplop itu.

---

## 2. Kamus Perintah Terminal (Wajib Hafal) ⌨️

Sebelum ke Git, Anda harus tahu cara jalan-jalan di terminal.

| Perintah | Bahasa Manusia | Contoh |
| :--- | :--- | :--- |
| `ls` | "List". Tunjukkan apa saja isi folder ini. | `ls` |
| `cd` | "Change Directory". Pindah masuk ke folder lain. | `cd client` (Masuk ke client) |
| `cd ..` | "Mundur". Keluar dari folder saat ini ke folder induk. | `cd ..` |
| `pwd` | "Posisi". Saya sedang berdiri di folder mana? | `pwd` |
| `clear` | "Bersih". Hapus semua tulisan di layar terminal. | `clear` |

---

## 3. Mantra Harian Git (Rutinitas) 🔄

Setiap kali Anda selesai ngoding satu fitur (misal: "Ganti warna header"), lakukan 3 langkah ini:

### Langkah 1: Bungkus (`add`)
```bash
git add .
```
*(Titik `.` artinya "Semua file yang berubah").*

### Langkah 2: Stempel (`commit`)
```bash
git commit -m "Mengubah warna header jadi pink"
```
*(Pesan dalam tanda kutip harus jelas. Jangan cuma tulis "fix").*

### Langkah 3: Kirim (`push`)
```bash
git push
```
*(Mengirim ke GitHub. Setelah ini, kode aman).*

---

## 4. Bekerja dengan Cabang (`branch`) 🌳

Bayangkan Anda ingin bereksperimen "Membuat Fitur Dark Mode", tapi takut merusak kode utama yang sedang berjalan lancar.
Gunakan **Branch**.

*   **`main`**: Jalur utama. Kode sakral yang harus selalu bersih & jalan.
*   **`experiment`**: Jalur alternatif. Tempat Anda mengacau bebas.

### Cara Pakai:
1.  **Buat Cabang Baru**:
    ```bash
    git checkout -b fitur-dark-mode
    ```
    *(Artinya: Buat cabang bernama `fitur-dark-mode` dan pindah ke sana).*

2.  **Ngoding Bebas**:
    Lakukan perubahan kode sesuka hati di sini. Kode di `main` tidak akan terganggu.

3.  **Simpan di Cabang**:
    ```bash
    git add .
    git commit -m "Selesai dark mode"
    git push origin fitur-dark-mode
    ```

4.  **Balik ke Jalan Benar (Merge)**:
    Jika eksperimen berhasil, gabungkan ke utama.
    ```bash
    git checkout main       # Pindah ke main
    git merge fitur-dark-mode # Gabungkan kode dari cabang tadi
    git push                # Update main di GitHub
    ```

---

## 5. Fetch vs Pull (Apa Bedanya?) 📥

*   **`git fetch`**: "Cek ombak".
    *   Hanya melihat: "Eh GitHub, ada update baru gak ya dari teman?"
    *   Kode di laptop Anda **BELUM** berubah. Cuma dikasih tahu statusnya.
*   **`git pull`**: "Ambil paksa".
    *   Langsung ambil kode terbaru dari GitHub dan **TIMPA** kode di laptop Anda.
    *   **Gunakan ini 99% waktu.** Jarang kita pakai fetch manual kecuali sedang debug rumit.

---

## 6. P3K: Pertolongan Pertama Pada Kecelakaan 🚑

Ini bagian terpenting. Apa yang harus dilakukan jika...

### A. "Saya salah ngoding, error semua! Mau balik ke kondisi tadi pagi!"
Selama Anda **belum commit**, jalankan ini:
```bash
git checkout .
```
*Efek: Membuang semua perubahan yang belum di-save (commit) dan mengembalikan file seperti terakhir kali commit.*

### B. "Saya terlanjur Commit, tapi belum Push. Mau batalin!"
```bash
git reset --soft HEAD~1
```
*Efek: Membatalkan stempel "Commit" terakhir. File kodingan Anda TETAP ADA (tidak hilang), statusnya kembali jadi "belum di-commit". Anda bisa edit lagi lalu commit ulang.*

### C. "SAYA TERLANJUR PUSH! Kode error sudah masuk GitHub!" 😱
Jangan panik. Jangan hapus repo. Gunakan `revert`.

1.  Cek ID commit yang error (misal ID-nya `a1b2c3d`):
    ```bash
    git log --oneline
    ```
2.  Buat commit baru yang "membalikkan" efek commit itu:
    ```bash
    git revert a1b2c3d
    ```
3.  Push perbaikan itu:
    ```bash
    git push
    ```
*Efek: GitHub akan mencatat "Commit Koreksi". Sejarah tetap ada (bahwa Anda pernah salah), tapi kodenya sudah kembali benar.*

---

## Rangkuman Perintah
*   `git status` : "Kondisi saya sekarang gimana? Ada yang belum di-save?"
*   `git log` : "Lihat sejarah perubahan."
*   `git pull` : "Ambil update dari internet."
*   `git push` : "Kirim update ke internet."
