import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import WebSocket, { WebSocketServer } from 'ws';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/ping', (req: Request, res: Response) => {
    res.send({ pong: 'pong' });
});

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

const wss = new WebSocketServer({ server: server });

wss.on('connection', (ws, request) => {
    ws.on('error', console.error);

    ws.on('message', (data) => {
        console.log('received: %s', data);
    });

    ws.send('something');
});
