import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { websocketMessage } from './controller/websocketMessage';
import ScorePads from './controller/scorePads';
import { WebSocketServer } from 'ws';
import { IScorePadMessage } from '../../types';

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
const scorePads = new ScorePads();

wss.on('connection', (ws, request) => {
    ws.on('error', console.error);

    ws.on('message', (data: string | ArrayBuffer | Blob) => {
        if (typeof data !== 'string') {
            console.error(`Received non string websocket message. ${data}`);
            return;
        }

        const parsedData = JSON.parse(data);
        const response = websocketMessage(parsedData, scorePads);

        if (response) {
            ws.send(response);
        }
    });

    ws.send('something');
});
