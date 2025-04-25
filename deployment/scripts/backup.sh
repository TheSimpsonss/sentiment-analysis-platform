#!/bin/bash

# Set environment variables
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup"
DB_NAME="sentiment_db"
DB_USER="postgres"
DB_HOST="db"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup database
echo "Backing up PostgreSQL database..."
PGPASSWORD=postgres pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > $BACKUP_DIR/db_backup_$TIMESTAMP.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$TIMESTAMP.sql

echo "Backup completed: $BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"
