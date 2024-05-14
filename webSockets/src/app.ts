import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    const payload = {
      type: 'custom-message',
      payload: data.toString().toUpperCase(),
    };
    // ws.send(JSON.stringify(payload));

    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(payload))
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log(`Socket running on 3000`);
