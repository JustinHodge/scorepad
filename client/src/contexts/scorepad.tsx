import { createContext } from 'react';
import {
    EnumMessageType,
    EnumPlayerColors,
    IPlayer,
    IScorePadMessage,
} from '../../../types';
interface IScorePadMessageEvent extends MessageEvent {
    data: IScorePadMessage;
}
class scorePadContext {
    private websocket: WebSocket;
    private scorePadId: string | null;
    private isConnected: boolean;

    constructor() {
        this.websocket = new WebSocket('ws://localhost:3000');
        this.scorePadId = null;
        this.isConnected = false;

        this.configureWebSocketHandlers();
    }

    private configureWebSocketHandlers = () => {
        this.websocket.onopen = () => {
            this.isConnected = true;
            console.log('Connected to the server');
        };

        this.websocket.onmessage = (event: IScorePadMessageEvent) => {
            console.log('Message from the server:', event.data);
        };

        this.websocket.onerror = (event) => {
            console.log('error: ', event);
        };

        this.websocket.onclose = () => {
            this.isConnected = false;
            console.log('Disconnected from server');
        };
    };

    public getScorepadId = () => {
        return this.isConnected ? this.scorePadId : null;
    };

    public startNewScorePad = (numberOfPlayers: number) => {
        const players: IPlayer[] = [];
        for (let i = 0; i < numberOfPlayers; i++) {
            const randomColorIndex = Math.floor(
                Math.random() * Object.keys(EnumPlayerColors).length
            );
            const randomColorKey =
                EnumPlayerColors[
                    Object.keys(EnumPlayerColors)[
                        randomColorIndex
                    ] as keyof typeof EnumPlayerColors
                ];

            players.push({
                name: `Player ${i + 1}`,
                color: randomColorKey,
                score: 0,
            });
        }
        const message: IScorePadMessage = {
            type: EnumMessageType.NEW_PAD,
            players: players,
        };

        this.websocket.send(JSON.stringify(message));
    };
}

const ScorepadContext = createContext(new scorePadContext());

export default ScorepadContext;
