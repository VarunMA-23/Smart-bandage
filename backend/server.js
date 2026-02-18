const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('../frontend'));

// Store data for history page
let historyData = []; // array of { time: Date, temperature: Number, moisture: Number }
const INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
let lastSaved = 0;

// Connect to Arduino
const port = new SerialPort({ path: 'COM4', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

parser.on('data', line => {
    const tempMatch = line.match(/Temperature: ([0-9.]+)/);
    const moistMatch = line.match(/Moisture: (\d+)/);

    if (tempMatch && moistMatch) {
        const data = {
            temperature: parseFloat(tempMatch[1]),
            moisture: parseInt(moistMatch[1]),
            time: Date.now()
        };

        io.emit('sensorData', data); // live data for main dashboard

        // Store for history every 5 minutes
        if (Date.now() - lastSaved >= INTERVAL) {
            historyData.push(data);
            lastSaved = Date.now();

            // Keep last 25 readings
            if (historyData.length > 25) historyData.shift();
        }
    }
});

// Endpoint to get last 25 readings
app.get('/history-data', (req, res) => {
    res.json(historyData);
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
