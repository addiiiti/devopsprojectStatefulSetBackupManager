from fastapi import FastAPI
from datetime import datetime
import subprocess
import os
import glob
import json

app = FastAPI(title="StatefulSet Backup Manager")

PROJECT_ROOT = os.getenv("PROJECT_ROOT", os.path.expanduser("~/devopsprojectstatefulsetbackupmanager"))
SCRIPTS_DIR = os.path.join(PROJECT_ROOT, "src", "scripts")
BACKUP_DIR = os.path.join(PROJECT_ROOT, "backups")
HISTORY_FILE = os.path.join(BACKUP_DIR, "backup_history.json")


def ensure_backup_dir():
    os.makedirs(BACKUP_DIR, exist_ok=True)


def load_backup_history():
    ensure_backup_dir()
    if not os.path.exists(HISTORY_FILE):
        return []
    with open(HISTORY_FILE, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []


def save_backup_history(history):
    ensure_backup_dir()
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "statefulset-backup-manager",
        "timestamp": datetime.now().isoformat(),
        "project_root": PROJECT_ROOT
    }


@app.get("/backups")
def list_backups():
    ensure_backup_dir()
    backup_files = sorted(glob.glob(os.path.join(BACKUP_DIR, "*.sql")), reverse=True)
    return {
        "count": len(backup_files),
        "backups": [os.path.basename(file) for file in backup_files]
    }


@app.get("/backup-history")
def get_backup_history():
    history = load_backup_history()
    return {
        "count": len(history),
        "history": history
    }


@app.post("/backup")
def create_backup():
    ensure_backup_dir()
    script_path = os.path.join(SCRIPTS_DIR, "backup.sh")

    before_files = set(glob.glob(os.path.join(BACKUP_DIR, "*.sql")))

    result = subprocess.run(
        ["bash", script_path],
        capture_output=True,
        text=True
    )

    after_files = set(glob.glob(os.path.join(BACKUP_DIR, "*.sql")))
    new_files = sorted(list(after_files - before_files))

    backup_filename = None
    backup_size = 0

    if new_files:
        latest_file = new_files[-1]
        backup_filename = os.path.basename(latest_file)
        backup_size = os.path.getsize(latest_file)

    history = load_backup_history()
    history.append({
        "timestamp": datetime.now().isoformat(),
        "filename": backup_filename,
        "success": result.returncode == 0,
        "size_bytes": backup_size
    })
    save_backup_history(history)

    return {
        "success": result.returncode == 0,
        "stdout": result.stdout,
        "stderr": result.stderr,
        "script_path": script_path,
        "filename": backup_filename,
        "size_bytes": backup_size
    }


@app.post("/restore")
def restore_backup():
    script_path = os.path.join(SCRIPTS_DIR, "restore.sh")

    result = subprocess.run(
        ["bash", script_path],
        capture_output=True,
        text=True
    )

    return {
        "success": result.returncode == 0,
        "stdout": result.stdout,
        "stderr": result.stderr,
        "script_path": script_path
    }
