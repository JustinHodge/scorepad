import { createContext, useMemo, useState } from 'react';
import {
    EnumMessageType,
    EnumPlayerColors,
    IControlMessage,
    IPlayer,
    IScorePadMessage,
} from '../../../types';

interface IScorePadContext {
    isConnected: boolean;
    players: IPlayer[];
    scorePadId: string | undefined;
    setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
    setPlayers: React.Dispatch<React.SetStateAction<IPlayer[]>>;
    setScorePadId: React.Dispatch<React.SetStateAction<string | undefined>>;
    startNewScorePad: (numberOfPlayers: number, startScore: number) => void;
}

export const ScorepadContext = createContext<IScorePadContext>(
    {} as IScorePadContext
);

export const ScorePadProvider = ({ children }: React.PropsWithChildren) => {
    const [isConnected, setIsConnected] = useState(false);
    const [players, setPlayers] = useState<IPlayer[]>([]);
    const [scorePadId, setScorePadId] = useState<string | undefined>(undefined);
    const webSocket = useMemo(() => {
        const webSocket = new WebSocket('ws://localhost:3000');
        webSocket.onopen = () => {
            setIsConnected(true);
        };

        webSocket.onmessage = (event) => {
            console.log('Message from the server:', event.data);
            const parsedData = JSON.parse(event.data) as
                | IScorePadMessage
                | IControlMessage;

            const isControlMessage = (
                parsedData: unknown
            ): parsedData is IControlMessage =>
                (parsedData as IControlMessage).type ===
                EnumMessageType.CONTROL_MESSAGE;

            const isScorePadMessage = (
                parsedData: unknown
            ): parsedData is IScorePadMessage =>
                (parsedData as IScorePadMessage).type ===
                EnumMessageType.NEW_PAD;

            if (isControlMessage(parsedData)) {
                parsedData.message && console.log(parsedData.message);
                parsedData.data && console.log(parsedData.data);
            } else if (isScorePadMessage(parsedData)) {
                switch (parsedData.type) {
                    case EnumMessageType.NEW_PAD:
                        setScorePadId(parsedData.scorePadId);
                        setPlayers(parsedData.players);
                        break;
                    case EnumMessageType.PLAYERS:
                        if (scorePadId !== parsedData.scorePadId) {
                            throw new Error('Invalid scorePadId');
                        }
                        setPlayers(parsedData.players);
                        break;
                    case EnumMessageType.SCORE:
                        if (scorePadId !== parsedData.scorePadId) {
                            throw new Error('Invalid scorePadId');
                        }
                        setPlayers(parsedData.players);
                        break;
                    default:
                        break;
                }
            } else {
                throw new Error(`Invalid message ${parsedData}`);
            }
        };

        webSocket.onerror = (event) => {
            console.log('error: ', event);
        };

        webSocket.onclose = () => {
            setIsConnected(false);
            console.log('Disconnected from server');
        };
        return webSocket;
    }, [scorePadId]);

    const startNewScorePad = async (
        numberOfPlayers: number,
        startScore: number
    ) => {
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
                score: startScore ?? 0,
            });
        }
        const message: IScorePadMessage = {
            type: EnumMessageType.NEW_PAD,
            players: players,
        };

        webSocket.send(JSON.stringify(message));
    };

    const value = {
        isConnected,
        players,
        scorePadId,
        setIsConnected,
        setPlayers,
        setScorePadId,
        startNewScorePad,
    };

    return (
        <ScorepadContext.Provider value={value}>
            {children}
        </ScorepadContext.Provider>
    );
};

export default ScorepadContext;
