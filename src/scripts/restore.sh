#!/bin/bash

NAMESPACE="backup-manager"
POD_NAME="mysql-0"
DB_NAME="testdb"
DB_USER="root"
PROJECT_ROOT="${PROJECT_ROOT:-$HOME/devopsprojectstatefulsetbackupmanager}"
BACKUP_DIR="$PROJECT_ROOT/backups"

LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/*.sql 2>/dev/null | head -n 1)

if [ -z "$LATEST_BACKUP" ]; then
  echo "No backup file found in $BACKUP_DIR"
  exit 1
fi

echo "Starting restore..."
echo "Using backup file: $LATEST_BACKUP"
echo "Target pod: $POD_NAME"
echo "Target database: $DB_NAME"

cat "$LATEST_BACKUP" | kubectl exec -i -n $NAMESPACE $POD_NAME -- \
  sh -c "mysql -u$DB_USER -ppassword123 $DB_NAME"

if [ $? -eq 0 ]; then
  echo "Restore completed successfully."
else
  echo "Restore failed."
  exit 1
fi
