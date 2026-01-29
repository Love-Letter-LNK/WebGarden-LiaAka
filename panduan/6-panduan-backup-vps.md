# BAB 6: Panduan Backup VPS 💾

Backup adalah ASURANSI JIWA website Anda. Bab ini menjelaskan cara menyimpan cadangan agar tidak kehilangan segalanya jika terjadi bencana.

---

## 1. Apa yang Perlu Di-Backup? 📦

| Komponen | Lokasi | Pentingnya |
|----------|--------|------------|
| **Database** | `/var/www/WebGarden-LiaAka/server/prisma/prod.db` (SQLite) atau PostgreSQL | ⭐⭐⭐⭐⭐ KRITIS |
| **File Upload** | `/var/www/WebGarden-LiaAka/server/uploads/` | ⭐⭐⭐⭐⭐ KRITIS |
| **Environment** | `/var/www/WebGarden-LiaAka/server/.env` | ⭐⭐⭐⭐ PENTING |
| **Nginx Config** | `/etc/nginx/sites-available/aka-lia` | ⭐⭐⭐ BISA DIBUAT ULANG |
| **Kode Sumber** | Semua folder | ⭐⭐ AMAN DI GITHUB |

---

## 2. Backup Manual (Cepat) ⚡

### A. Backup Database SQLite
```bash
cd /var/www/WebGarden-LiaAka/server
cp prisma/prod.db ~/backup/prod_$(date +%Y%m%d_%H%M).db
```

### B. Backup Database PostgreSQL
```bash
pg_dump -U liaaka_user -h localhost liaaka_db > ~/backup/liaaka_$(date +%Y%m%d).sql
```

### C. Backup File Upload
```bash
cd /var/www/WebGarden-LiaAka/server
tar -czvf ~/backup/uploads_$(date +%Y%m%d).tar.gz uploads/
```

### D. Backup Environment
```bash
cp /var/www/WebGarden-LiaAka/server/.env ~/backup/.env.backup
```

---

## 3. Script Backup Otomatis 🤖

> ⚠️ **PENTING**: Script ini dijalankan **di VPS (Linux)** via SSH, BUKAN di Windows PowerShell!
> 
> Cara akses VPS:
> ```powershell
> # Di Windows PowerShell/CMD:
> ssh root@195.88.XX.XX
> ```

Buat file `/var/www/WebGarden-LiaAka/server/scripts/backup-all.sh`:

```bash
#!/bin/bash
# ====================================
# BACKUP SCRIPT - Aka & Lia Digital Garden
# ====================================

BACKUP_DIR="$HOME/backup"
APP_DIR="/var/www/WebGarden-LiaAka"
DATE=$(date +%Y%m%d_%H%M%S)

# Buat folder backup jika belum ada
mkdir -p $BACKUP_DIR

echo "🔄 Starting backup..."

# 1. Backup Database
echo "📦 Backing up database..."
cp $APP_DIR/server/prisma/prod.db $BACKUP_DIR/db_$DATE.db 2>/dev/null || echo "SQLite not found, skipping..."
# Untuk PostgreSQL:
# pg_dump -U liaaka_user liaaka_db > $BACKUP_DIR/db_$DATE.sql

# 2. Backup Uploads
echo "📷 Backing up uploads..."
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C $APP_DIR/server uploads/ 2>/dev/null || echo "No uploads folder"

# 3. Backup .env
echo "🔐 Backing up environment..."
cp $APP_DIR/server/.env $BACKUP_DIR/env_$DATE.txt

# 4. Hapus backup lama (simpan 7 hari terakhir)
echo "🧹 Cleaning old backups..."
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "✅ Backup complete! Files saved to $BACKUP_DIR"
ls -lh $BACKUP_DIR
```

### Cara Pakai:
```bash
chmod +x /var/www/WebGarden-LiaAka/server/scripts/backup-all.sh
./scripts/backup-all.sh
```

---

## 4. Backup Otomatis dengan Cron ⏰

Jalankan backup otomatis setiap hari jam 3 pagi:

```bash
# Edit crontab
crontab -e

# Tambahkan baris ini:
0 3 * * * /var/www/WebGarden-LiaAka/server/scripts/backup-all.sh >> ~/backup/cron.log 2>&1
```

---

## 5. Download Backup ke Laptop 💻

Dari laptop/PC lokal (bukan di VPS):

```bash
# Download semua backup
scp -r root@195.88.XX.XX:~/backup ./backup-vps/

# Download file spesifik
scp root@195.88.XX.XX:~/backup/db_20260130.db ./
```

---

## 6. Restore dari Backup 🔄

### A. Restore Database SQLite
```bash
cd /var/www/WebGarden-LiaAka/server
cp ~/backup/db_20260130.db prisma/prod.db
pm2 restart liaaka-server
```

### B. Restore Database PostgreSQL
```bash
psql -U liaaka_user -h localhost liaaka_db < ~/backup/liaaka_20260130.sql
pm2 restart liaaka-server
```

### C. Restore Upload Files
```bash
cd /var/www/WebGarden-LiaAka/server
tar -xzvf ~/backup/uploads_20260130.tar.gz
```

---

## 7. Checklist Backup Mingguan ✅

- [ ] Cek folder `~/backup/` - ada file terbaru?
- [ ] Download backup ke laptop/cloud
- [ ] Test restore di environment lokal (opsional)
- [ ] Hapus backup sangat lama (>30 hari)

---

## 8. Backup ke Cloud (Opsional) ☁️

### Google Drive dengan rclone
```bash
# Install rclone
curl https://rclone.org/install.sh | sudo bash

# Setup (ikuti wizard)
rclone config

# Upload backup
rclone copy ~/backup gdrive:VPS-Backup/
```

### Alternatif Gratis
- **GitHub Private Repo**: Untuk kode + .env (JANGAN database besar)
- **Mega.nz**: 20GB gratis
- **Google Drive**: 15GB gratis

---

> 💡 **Tips**: Jadikan backup sebagai kebiasaan. Lebih baik punya 100 backup yang tidak terpakai daripada 1 kali butuh tapi tidak punya!
