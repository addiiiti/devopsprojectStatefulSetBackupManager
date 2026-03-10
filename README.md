# StatefulSet Backup Manager
## Overview
Stateful applications in Kubernetes require reliable backup and restore mechanisms. Stateless workloads can be recreated easily, but stateful services such as databases store persistent data that must be protected.

This project implements a simple backup management system for Kubernetes StatefulSet applications. A MySQL database is deployed using a StatefulSet with persistent storage. A Backup Manager service provides API endpoints that allow users to create backups, restore data, and view backup history. Automated backups are also scheduled using a Kubernetes CronJob.

The goal of this project is to demonstrate how Kubernetes native components can be used together to build a backup solution for stateful workloads.
## Architecture

The system consists of the following components.

### MySQL StatefulSet
Stores application data using a PersistentVolumeClaim.

### Backup Manager API
A FastAPI service that triggers backup and restore operations.

### Persistent Storage
Backups are stored in a dedicated PVC so they survive pod restarts.

### Kubernetes RBAC
Allows the Backup Manager to execute commands inside the MySQL pod.

### CronJob Scheduler
Automatically triggers periodic backups through the API.

### High Level Flow
```
User or CronJob
      |
      v
Backup Manager API
      |
      v
kubectl exec into MySQL Pod
      |
      v
mysqldump
      |
      v
Backup stored in Persistent Volume
```

### Project Structure
```devopsprojectstatefulsetbackupmanager/

src/
  main/app/
    main.py
    routes/
    services/
    models/
    utils/

src/scripts/
  backup.sh
  restore.sh

infrastructure/
  docker/
    Dockerfile
    docker-compose.yml
  kubernetes/
    mysql-statefulset.yaml
    mysql-service.yaml
    backup-manager-deployment.yaml
    backup-manager-service.yaml
    backup-manager-pvc.yaml
    cronjob.yaml
    configmap.yaml
    secret.yaml

backups/
  SQL backup files

docs/
  projectplan.md
  designdocument.md
  userguide.md
  deployment.md

tests/
monitoring/
presentations/
deliverables/
```
## Prerequisites
Before running this project, make sure the following tools are installed:

- Docker
- Docker Desktop with Kubernetes enabled
- kubectl
- Python 3.10 or higher
- Git

Verify Kubernetes is working:
`kubectl get nodes`
## Deployment Steps
### 1. Clone the repository
```
git clone <repository-url>
cd devopsprojectstatefulsetbackupmanager
```
### 2. Build the Backup Manager image
```
docker build -t backup-manager:local -f infrastructure/docker/Dockerfile .
```
### 3. Deploy Kubernetes resources
Apply the Kubernetes manifests:
```
kubectl apply -f infrastructure/kubernetes
```
Verify that pods are running:
```
kubectl get pods -n backup-manager
```
Expected pods:
```
mysql-0
backup-manager-xxxxx
```
### 4. Access the Backup Manager API
Use port forwarding to expose the service locally.
```
kubectl port-forward svc/backup-manager-service 8000:8000 -n backup-manager
```
Test the API:
```
curl http://localhost:8000/health
```
## API Endpoints
### Health Check
```
GET /health
```
Returns service status.
### List Backup Files
```
GET /backups
```
### Show available backup files
```
GET /backups
```
### Create Backup
```
POST /backup
```
Triggers a database backup using mysqldump.
### Restore Database
```
POST /restore
```
Restores the database using the most recent backup.
### Backup History
```
GET /backup-history
```
Returns metadata about previous backups including timestamp, filename, status, and file size.

Example response:
```
{
  "timestamp": "2026-03-09T19:11:43",
  "filename": "mysql-backup-20260309-191143.sql",
  "success": true,
  "size_bytes": 2061
}
```
## Automated Backups
Backups are automatically triggered using a Kubernetes CronJob.

Example schedule:
```
*/2 * * * *
```
This schedule runs a backup every two minutes for demonstration purposes. In production environments this can be changed to hourly or daily backups.

Check CronJob status:

`kubectl get cronjobs -n backup-manager`

Check generated jobs:

`kubectl get jobs -n backup-manager`
## Demonstration Flow

1. Deploy MySQL StatefulSet

2. Insert sample data into the database

3. Trigger a backup through the API

4. Delete database records

5. Restore data using the restore endpoint

6. Verify that the records are restored

7. Observe automatic backups created by the CronJob

## Future Improvements

Possible extensions for this project include:

Secret based password management
Remote backup storage such as object storage
Backup compression
Monitoring and alerting
Backup retention policies

## Conclusion

This project demonstrates how Kubernetes resources such as StatefulSets, PersistentVolumeClaims, Deployments, RBAC, and CronJobs can be combined to implement a basic backup management system for stateful workloads. It provides both manual and automated backup capabilities and tracks backup history for operational visibility.


