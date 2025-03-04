import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { websocketMessageHandler } from './controller/websocketMessageHandler';
import ScorePads from './class/scorePads';
import { WebSocketServer } from 'ws';
import { ISystemMessage } from './types';
import { MESSAGE_TYPE } from './globalConstants';
import path from 'path';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

const wss = new WebSocketServer({ server: server });
const scorePads = new ScorePads();

app.use(cors());

app.use(express.static(path.resolve(__dirname + '/public')));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname + '/public/index.html'));
});

app.get('/scorepads', (req: Request, res: Response) => {
    process.env.NODE_ENV === 'development'
        ? res.send(scorePads.getScorePads())
        : res.status(403).send('Forbidden');
});

wss.on('connection', (websocket, request) => {
    websocket.on('error', console.error);

    websocket.on('message', (data: string) => {
        const parsedData = JSON.parse(data);
        websocketMessageHandler(parsedData, scorePads, websocket);
    });

    const message: ISystemMessage = {
        type: MESSAGE_TYPE.SYSTEM_MESSAGE,
        data: {
            message: 'Successfully Connected',
        },
    };

    websocket.send(JSON.stringify(message));
});
