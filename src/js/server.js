const WebSocket = require('ws');

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Handle connections
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Handle messages from client
    ws.on('message', (message) => {
        console.log('Received:', message);

        // Echo message back to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`Server received: ${message}`);
            }
        });
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server running on ws://localhost:8080');
