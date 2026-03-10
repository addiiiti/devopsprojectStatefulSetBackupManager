const API = "http://localhost:8000";

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
    await fetch(API + "/backup", {method: "POST"});
    loadBackups();
    loadHistory();
}

async function restoreBackup() {
    await fetch(API + "/restore", {method: "POST"});
    alert("Database restored");
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

