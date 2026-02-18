const socket = io();

// Table elements
const tempVal = document.getElementById('tempVal');
const moistVal = document.getElementById('moistVal');

// Chart data
const tempData = {
    labels: [],
    datasets: [
        {
            label: 'Temperature',
            data: [],
            borderColor: '#ff4d4d',
            fill: false,
            tension: 0.3
        },
        {
            label: 'Optimal Temp',
            data: [],
            borderColor: '#888',
            borderDash: [5,5],
            fill: false,
            tension: 0.3
        }
    ]
};

const moistData = {
    labels: [],
    datasets: [
        {
            label: 'Moisture',
            data: [],
            borderColor: '#1e90ff',
            fill: false,
            tension: 0.3
        },
        {
            label: 'Optimal Moisture',
            data: [],
            borderColor: '#888',
            borderDash: [5,5],
            fill: false,
            tension: 0.3
        }
    ]
};

// Chart options
const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: { title: { display: true, text: 'Time' } },
        y: { beginAtZero: true }
    }
};

// Create charts
const tempChart = new Chart(document.getElementById('tempChart').getContext('2d'), {
    type: 'line',
    data: tempData,
    options
});

const moistChart = new Chart(document.getElementById('moistChart').getContext('2d'), {
    type: 'line',
    data: moistData,
    options
});

// Keep last N points
function keepLastN(array, n){
    while(array.length > n) array.shift();
}

// Receive data
socket.on('sensorData', data => {
    const time = new Date().toLocaleTimeString();

    // Update table
    tempVal.textContent = data.temperature.toFixed(1);
    moistVal.textContent = data.moisture;

    // Update Temperature Chart
    tempData.labels.push(time);
    tempData.datasets[0].data.push(data.temperature);
    tempData.datasets[1].data.push(37.0); // Optimal
    keepLastN(tempData.labels, 10);
    keepLastN(tempData.datasets[0].data, 10);
    keepLastN(tempData.datasets[1].data, 10);
    tempChart.update();

    // Update Moisture Chart
    moistData.labels.push(time);
    moistData.datasets[0].data.push(data.moisture);
    moistData.datasets[1].data.push(50); // Optimal
    keepLastN(moistData.labels, 10);
    keepLastN(moistData.datasets[0].data, 10);
    keepLastN(moistData.datasets[1].data, 10);
    moistChart.update();
});
