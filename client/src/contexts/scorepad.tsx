import { createContext } from 'react';
import { IScorePadMessage } from '../../../types';

interface IScorePadMessageEvent extends MessageEvent {
    data: IScorePadMessage;
}
class scorePad {
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
}

const ScorepadContext = createContext(new scorePad());

export default ScorepadContext;
