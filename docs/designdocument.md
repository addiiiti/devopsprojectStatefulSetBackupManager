# Design Document
## StatefulSet Backup Manager

## 1. Introduction

Stateful applications running in Kubernetes require reliable data backup and recovery mechanisms. Unlike stateless services, stateful workloads such as databases depend on persistent storage. If the data is lost or corrupted, the application cannot recover without a backup.

This project implements a backup and restore system for Kubernetes StatefulSet applications. The system focuses on a MySQL database deployed using a StatefulSet and provides a Backup Manager service that allows users to create backups, restore data, and monitor backup history.

The goal of this design is to demonstrate how Kubernetes resources and containerized services can be combined to implement a simple backup management solution.

---

## 2. System Goals

The main goals of the system are:

Provide manual and automated database backups.

Allow database restoration from stored backup files.

Store backups in persistent storage so that they survive pod restarts.

Provide an API interface for triggering backup and restore operations.

Maintain metadata about previous backups.

Demonstrate integration of Kubernetes components such as StatefulSets, Deployments, PersistentVolumeClaims, RBAC, and CronJobs.

---

## 3. System Architecture

The system consists of multiple components deployed in a Kubernetes cluster.

### MySQL StatefulSet

The MySQL database is deployed using a Kubernetes StatefulSet. StatefulSets are designed for applications that require stable network identities and persistent storage.

Each MySQL pod uses a PersistentVolumeClaim to store database data. This ensures that the database state is preserved even if the pod restarts.

### Backup Manager API

The Backup Manager is implemented using FastAPI and runs as a Kubernetes Deployment.

The service exposes REST endpoints that allow users to:

create backups  
restore database data  
view available backup files  
view backup history  

The API internally executes backup and restore scripts that interact with the MySQL pod.

### Backup Scripts

Two shell scripts perform the actual database operations.

backup.sh  
Uses mysqldump to create a database backup.

restore.sh  
Restores database data from the latest backup file.

These scripts are executed by the Backup Manager service.

### Persistent Backup Storage

Backup files are stored in a dedicated PersistentVolumeClaim. This storage is mounted into the Backup Manager container.

Because the storage is persistent, backups remain available even if the container restarts.

### Kubernetes RBAC

The Backup Manager service requires permission to interact with Kubernetes resources. RBAC is used to allow the service to execute commands inside the MySQL pod.

This permission allows the system to run mysqldump inside the database container.

### CronJob Scheduler

A Kubernetes CronJob triggers periodic backups. The CronJob sends requests to the Backup Manager API to create backups automatically.

For demonstration purposes the backup schedule runs every few minutes. In production systems the schedule can be adjusted to run hourly or daily.

---

## 4. Data Flow

The backup and restore processes follow a simple flow.

### Backup Flow

User or CronJob sends request to Backup Manager API

Backup Manager runs the backup script

The script executes mysqldump inside the MySQL pod

The database dump is written to a backup file

The file is stored in the persistent backup volume

Backup metadata is recorded in a history file

### Restore Flow

User sends restore request to the Backup Manager API

The restore script identifies the latest backup file

The script executes a MySQL restore command

Database state is restored from the backup file

---

## 5. API Design

The Backup Manager exposes several REST endpoints.

GET /health  
Returns the health status of the service.

GET /backups  
Lists available backup files.

POST /backup  
Triggers a database backup.

POST /restore  
Restores the database from the latest backup.

GET /backup-history  
Returns metadata about previously created backups.

---

## 6. Deployment Design

The system is deployed using Kubernetes manifests located in the infrastructure directory.

The deployment includes:

MySQL StatefulSet  
MySQL service  
Backup Manager deployment  
Backup Manager service  
PersistentVolumeClaims  
Secrets for database credentials  
ConfigMap for configuration  
CronJob for scheduled backups  

Docker is used to build the Backup Manager container image.

---

## 7. Failure Handling

The system handles several possible failure scenarios.

If the Backup Manager container restarts, backup files remain available because they are stored in a persistent volume.

If a backup operation fails, the API response indicates failure and the metadata records the unsuccessful attempt.

If the MySQL pod restarts, the database data remains intact because it is stored in the StatefulSet persistent volume.

---

## 8. Security Considerations

Database credentials are stored using Kubernetes Secrets.

RBAC permissions are restricted so that the Backup Manager can only perform the actions required for backup operations.

Sensitive files such as environment variables and backup data are excluded from version control using a .gitignore file.

---

## 9. Future Improvements

Several enhancements can improve the system.

Integration with remote storage services such as object storage.

Compression of backup files.

Backup retention policies to remove old backups.

Monitoring integration using Prometheus or Grafana.

Alerting when backup operations fail.

---

## 10. Conclusion

This project demonstrates how Kubernetes components can be combined to implement a simple backup management system for stateful workloads. By using StatefulSets, persistent volumes, API driven operations, and scheduled jobs, the system provides both manual and automated backup capabilities for database applications running in Kubernetes.
