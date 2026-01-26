#!/bin/bash

# Configuration
DB_NAME="liaaka"
DB_USER="liaaka_app"
BACKUP_DIR="/var/backups/liaaka"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/$DB_NAME-$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Dump database
# Note: Ensure .pgpass or mysql config is set up for passwordless auth for cronjob
echo "Starting backup for $DB_NAME..."

# If PostgreSQL:
# pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

# If MySQL:
# mysqldump -u $DB_USER -p[PASSWORD] $DB_NAME > $BACKUP_FILE

# For SQLite (Current Dev Config):
cp server/prisma/dev.db "$BACKUP_FILE.sqlite"

# Compress
gzip $BACKUP_FILE

# Delete backups older than 7 days
find $BACKUP_DIR -type f -name "*.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE.gz"
