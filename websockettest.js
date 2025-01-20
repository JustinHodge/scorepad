const websocket = new WebSocket('ws://localhost:3000');

websocket.onopen = () => {
    console.log('Connected to the server');
    websocket.send('Hello from the client');
};
