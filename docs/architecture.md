# System Architecture

The following diagram shows the high level architecture of the StatefulSet Backup Manager system.
```
User / CronJob
|
v
Backup Manager API (FastAPI)
|
v
kubectl exec
|
v
MySQL StatefulSet Pod
|
v
mysqldump
|
v
Backup File
|
v
Persistent Volume (PVC)
```

## Components

User / CronJob  
Triggers backup requests manually or automatically.

Backup Manager API  
Handles API requests and executes backup or restore scripts.

MySQL StatefulSet  
Stores application data in persistent storage.

Persistent Volume  
Stores backup files so they remain available after pod restarts.