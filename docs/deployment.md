# Deployment Guide
# StatefulSet Backup Manager

## 1. Introduction

This document describes the steps required to deploy the StatefulSet Backup Manager system. The project uses Kubernetes to deploy a MySQL database and a Backup Manager API that performs database backup and restore operations.

The system also uses persistent storage to store backup files and a CronJob to automate periodic backups.

---

## 2. Prerequisites

Before deploying the project, ensure the following tools are installed.

- Docker

- Docker Desktop with Kubernetes enabled

- kubectl

- Git

- Python 3 (optional for local development)

Verify that Kubernetes is running.
```
kubectl get nodes
```
You should see at least one node available.

---

## 3. Clone the Repository

Clone the project repository and navigate into the project directory.
```
git clone <repository-url>
cd devopsprojectstatefulsetbackupmanager
```
---
## 4. Build the Backup Manager Docker Image

The Backup Manager service is packaged as a Docker container.

Build the image using the provided Dockerfile.
```
docker build -t backup-manager:local -f infrastructure/docker/Dockerfile .
```
This image will be used by the Kubernetes deployment.

---
## 5. Deploy Kubernetes Resources

All Kubernetes manifests are located in the infrastructure directory.

Apply the manifests using kubectl.
```
kubectl apply -f infrastructure/kubernetes
```
This will deploy the following components:

MySQL StatefulSet

MySQL Service

Backup Manager Deployment

Backup Manager Service

PersistentVolumeClaims

Secrets and ConfigMaps

CronJob for automated backups

---

## 6. Verify Deployment

Check that all pods are running.
```
kubectl get pods -n backup-manager
```
Expected pods include:
```
mysql-0
backup-manager-xxxxx
```
You may also see CronJob related pods that run and complete automatically.

---
## 7. Access the Backup Manager API

Use port forwarding to expose the Backup Manager service locally.
```
kubectl port-forward svc/backup-manager-service 8000:8000 -n backup-manager
```

Once the port forward is active, the API can be accessed locally.

Test the health endpoint.
```
curl http://localhost:8000/health
```

---
## 8. Test Backup Creation

Create a backup using the API.
```
curl -X POST http://localhost:8000/backup
```
Verify the backup files.
```
curl http://localhost:8000/backups
```

---
## 9. Test Database Restore

To test restore functionality, follow these steps.

Insert sample data into the MySQL database.

Delete the data from the database.

Call the restore endpoint.
```
curl -X POST http://localhost:8000/restore
```
Verify that the data has been restored.

---
## 10. Check Backup History

The system stores metadata about backup operations.

Retrieve backup history using the API.
```
curl http://localhost:8000/backup-history
```

This endpoint returns information such as:

backup timestamp

backup filename

backup status

backup file size

---

## 11. Verify Automated Backups

The system uses a Kubernetes CronJob to schedule periodic backups.

Check CronJob status.
```
kubectl get cronjobs -n backup-manager
```

Check backup jobs.
```
kubectl get jobs -n backup-manager
```

Verify that new backup files are created automatically.

---

## 12. Troubleshooting

If the Backup Manager API is not reachable, ensure port forwarding is active.
```
kubectl port-forward svc/backup-manager-service 8000:8000 -n backup-manager
```

If a pod fails to start, inspect logs.
```
kubectl logs <pod-name> -n backup-manager
```

Check pod details.
```
kubectl describe pod <pod-name> -n backup-manager
```

---

## 13. Cleanup

To remove all deployed resources, run:
```
kubectl delete -f infrastructure/kubernetes
```
This will remove all components from the Kubernetes cluster.

---

## 14. Summary

The deployment process includes building the Backup Manager container, deploying Kubernetes resources, verifying the system components, and testing backup and restore functionality. Once deployed, the system provides both manual and automated database backup capabilities for Kubernetes StatefulSet applications.



