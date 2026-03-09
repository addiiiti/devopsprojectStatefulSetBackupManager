#!/bin/bash

NAMESPACE="backup-manager"
POD_NAME="mysql-0"
DB_NAME="testdb"
DB_USER="root"
PROJECT_ROOT="${PROJECT_ROOT:-$HOME/devopsprojectstatefulsetbackupmanager}"
BACKUP_DIR="$PROJECT_ROOT/backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/mysql-backup-$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

echo "Starting backup of database: $DB_NAME"
echo "Target pod: $POD_NAME"
echo "Backup file: $BACKUP_FILE"

kubectl exec -n $NAMESPACE $POD_NAME -- \
  sh -c "mysqldump -u$DB_USER -ppassword123 $DB_NAME" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "Backup completed successfully."
  echo "Backup saved at: $BACKUP_FILE"
else
  echo "Backup failed."
  exit 1
fi
