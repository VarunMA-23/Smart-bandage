// Fetch history data from backend
async function fetchHistory() {
    const response = await fetch('/history-data');
    const data = await response.json();
    return data;
}

// Setup charts
const tempData = { labels: [], datasets: [{ label: 'Temperature', data: [], borderColor: '#ff4d4d', fill: false, tension: 0.3 }] };
const moistData = { labels: [], datasets: [{ label: 'Moisture', data: [], borderColor: '#1e90ff', fill: false, tension: 0.3 }] };

const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { title: { display: true, text: 'Time' } }, y: { beginAtZero: true } }
};

const tempChart = new Chart(document.getElementById('tempHistoryChart').getContext('2d'), { type: 'line', data: tempData, options });
const moistChart = new Chart(document.getElementById('moistHistoryChart').getContext('2d'), { type: 'line', data: moistData, options });

// Load data
async function loadHistory() {
    const history = await fetchHistory();
    tempData.labels = history.map(d => new Date(d.time).toLocaleTimeString());
    tempData.datasets[0].data = history.map(d => d.temperature);
    moistData.labels = history.map(d => new Date(d.time).toLocaleTimeString());
    moistData.datasets[0].data = history.map(d => d.moisture);

    tempChart.update();
    moistChart.update();
}

// Initial load
loadHistory();
