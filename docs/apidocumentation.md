# API Documentation

The Backup Manager service exposes several REST endpoints.

## Health Check

GET /health

Returns service status.

Example:

curl http://localhost:8000/health

Response:

{
  "status": "ok",
  "service": "statefulset-backup-manager"
}

---

## List Backups

GET /backups

Returns the list of available backup files.

Example:

curl http://localhost:8000/backups

---

## Create Backup

POST /backup

Creates a new database backup.

Example:

curl -X POST http://localhost:8000/backup

---

## Restore Database

POST /restore

Restores the database using the latest backup file.

Example:

curl -X POST http://localhost:8000/restore

---

## Backup History

GET /backup-history

Returns metadata about previous backups.

Example:

curl http://localhost:8000/backup-history
