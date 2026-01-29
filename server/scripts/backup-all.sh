#!/bin/bash
# ====================================
# BACKUP SCRIPT - Aka & Lia Digital Garden
# Jalankan di VPS via SSH, BUKAN di Windows!
# ====================================

BACKUP_DIR="$HOME/backup"
APP_DIR="/var/www/WebGarden-LiaAka"
DATE=$(date +%Y%m%d_%H%M%S)

# Buat folder backup jika belum ada
mkdir -p $BACKUP_DIR

echo "🔄 Starting backup..."
echo "📅 Date: $(date)"
echo ""

# 1. Backup Database
echo "📦 Backing up database..."
if [ -f "$APP_DIR/server/prisma/prod.db" ]; then
    cp $APP_DIR/server/prisma/prod.db $BACKUP_DIR/db_$DATE.db
    echo "   ✅ SQLite database backed up"
else
    echo "   ⚠️ SQLite not found, skipping..."
fi

# Untuk PostgreSQL (uncomment jika pakai):
# pg_dump -U liaaka_user liaaka_db > $BACKUP_DIR/db_$DATE.sql
# echo "   ✅ PostgreSQL database backed up"

# 2. Backup Uploads
echo "📷 Backing up uploads..."
if [ -d "$APP_DIR/server/uploads" ]; then
    tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz -C $APP_DIR/server uploads/
    echo "   ✅ Uploads backed up"
else
    echo "   ⚠️ No uploads folder found"
fi

# 3. Backup .env
echo "🔐 Backing up environment..."
if [ -f "$APP_DIR/server/.env" ]; then
    cp $APP_DIR/server/.env $BACKUP_DIR/env_$DATE.txt
    echo "   ✅ Environment file backed up"
else
    echo "   ⚠️ No .env file found"
fi

# 4. Hapus backup lama (simpan 7 hari terakhir)
echo ""
echo "🧹 Cleaning old backups (older than 7 days)..."
find $BACKUP_DIR -name "db_*.db" -mtime +7 -delete 2>/dev/null
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +7 -delete 2>/dev/null
find $BACKUP_DIR -name "env_*.txt" -mtime +7 -delete 2>/dev/null
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete 2>/dev/null

echo ""
echo "✅ Backup complete!"
echo "📁 Files saved to: $BACKUP_DIR"
echo ""
echo "Current backups:"
ls -lh $BACKUP_DIR 2>/dev/null || echo "No backups found"
