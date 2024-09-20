const LOGS_FILE_KEY = 'logsData';

function saveLogs(logs) {
    localStorage.setItem(LOGS_FILE_KEY, JSON.stringify(logs));
}

function loadLogs() {
    const logs = localStorage.getItem(LOGS_FILE_KEY);
    if (logs) {
        return JSON.parse(logs);
    } else {
        return [];
    }
}

function addLog(action, username) {
    const logs = loadLogs();
    const timestamp = new Date().toLocaleString();
    logs.push({ timestamp, action, username });
    saveLogs(logs);
}

function viewLogs() {
    const logs = loadLogs();
    let logOutput = '<h2>Журнал дій:</h2>';
    logs.forEach(log => {
        logOutput += `<p>${log.timestamp} - ${log.action} - ${log.username}</p>`;
    });
    document.getElementById('logs-content').innerHTML = logOutput;
    document.getElementById('logs-modal').classList.remove('hidden');
}

function closeLogsModal() {
    document.getElementById('logs-modal').classList.add('hidden');
}
