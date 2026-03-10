const API = "http://localhost:8000";
function showNotification(message, type) {

    const box = document.getElementById("notification");

    box.innerText = message;
    box.className = type;
    box.style.display = "block";

    setTimeout(() => {
        box.style.display = "none";
    }, 3000);
}
async function loadHealth() {
    const res = await fetch(API + "/health");
    const data = await res.json();
    document.getElementById("health").innerText = data.status;
}

async function loadBackups() {
    const res = await fetch(API + "/backups");
    const data = await res.json();

    const list = document.getElementById("backups");
    list.innerHTML = "";

    data.backups.forEach(file => {
        const li = document.createElement("li");
        li.innerText = file;
        list.appendChild(li);
    });
}

async function loadHistory() {
    const res = await fetch(API + "/backup-history");
    const data = await res.json();

    const table = document.getElementById("history");
    table.innerHTML = "";

    data.history.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.timestamp}</td>
            <td>${item.filename}</td>
            <td>${item.success}</td>
            <td>${item.size_bytes}</td>
        `;

        table.appendChild(row);
    });
}

async function createBackup() {

    const res = await fetch(API + "/backup", {method: "POST"});
    const data = await res.json();

    if (data.success) {
        showNotification("Backup created successfully", "success");
    } else {
        showNotification("Backup failed", "error");
    }

    loadBackups();
    loadHistory();
}

async function restoreBackup() {

    const res = await fetch(API + "/restore", {method: "POST"});
    const data = await res.json();

    if (data.success) {
        showNotification("Database restored successfully", "success");
    } else {
        showNotification("Restore failed", "error");
    }
}
async function loadPods() {

    const res = await fetch(API + "/pods");
    const data = await res.json();

    const list = document.getElementById("pods");
    list.innerHTML = "";

    data.items.forEach(pod => {

        const name = pod.metadata.name;
        const status = pod.status.phase;

        const li = document.createElement("li");
        li.innerText = name + " : " + status;

        list.appendChild(li);

    });

}
function init() {
    loadHealth();
    loadBackups();
    loadHistory();
    loadPods();
}

init();

setInterval(() => {
    loadHealth();
    loadBackups();
    loadHistory();
    loadPods();
}, 5000);

