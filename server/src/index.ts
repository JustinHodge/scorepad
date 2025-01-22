import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { websocketMessageHandler } from './controller/websocketMessageHandler';
import ScorePads from './controller/scorePads';
import { WebSocketServer } from 'ws';
import {
    EnumMessageType,
    IControlMessage,
    IScorePadMessage,
} from '../../types';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req: Request, res: Response) => {
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
        ? res.send('')
        : res.send('Development Server. Use Vite Frontend.');
});

const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

const wss = new WebSocketServer({ server: server });
const scorePads = new ScorePads();

wss.on('connection', (websocket, request) => {
    websocket.on('error', console.error);

    websocket.on('message', (data: string) => {
        const parsedData = JSON.parse(data);
        websocketMessageHandler(parsedData, scorePads, websocket);

        // if (response) {
        //     ws.send(response);
        // }
    });

    const message: IControlMessage = {
        type: EnumMessageType.CONTROL_MESSAGE,
        message: 'Successfully Connected',
    };

    websocket.send(JSON.stringify(message));
});
