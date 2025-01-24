import { createContext, useMemo, useState } from 'react';
import {
    EnumMessageType,
    EnumPlayerColors,
    IControlMessage,
    IPlayers,
    IScorePadMessage,
} from '../../../types';

interface IScorePadContext {
    isConnected: boolean;
    players: IPlayers;
    scorePadId: string | undefined;
    setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
    setPlayers: React.Dispatch<React.SetStateAction<IPlayers>>;
    setScorePadId: React.Dispatch<React.SetStateAction<string | undefined>>;
    startNewScorePad: (numberOfPlayers: number, startScore: number) => void;
    addPlayer: (startScore: number) => void;
}

export const ScorepadContext = createContext<IScorePadContext>(
    {} as IScorePadContext
);

const buildPlayer = (playerNumber: number, startScore: number) => {
    const randomColorIndex = Math.floor(
        Math.random() * Object.keys(EnumPlayerColors).length
    );
    const randomColorKey =
        EnumPlayerColors[
            Object.keys(EnumPlayerColors)[
                randomColorIndex
            ] as keyof typeof EnumPlayerColors
        ];

    return {
        id: crypto.randomUUID(),
        name: `Player ${playerNumber}`,
        color: randomColorKey,
        score: startScore ?? 0,
    };
};

export const ScorePadProvider = ({ children }: React.PropsWithChildren) => {
    const [isConnected, setIsConnected] = useState(false);
    const [players, setPlayers] = useState<IPlayers>({});
    const [scorePadId, setScorePadId] = useState<string | undefined>(undefined);
    const webSocket = useMemo(() => {
        const webSocket = new WebSocket('ws://localhost:3000');
        webSocket.onopen = () => {
            setIsConnected(true);
        };

        webSocket.onmessage = (event) => {
            console.log(
                'Message from the server:',
                event.data,
                typeof event.data
            );
            const parsedData = JSON.parse(event.data) as
                | IScorePadMessage
                | IControlMessage;

            const isControlMessage = (
                parsedData: unknown
            ): parsedData is IControlMessage =>
                (parsedData as IControlMessage)?.type ===
                EnumMessageType.CONTROL_MESSAGE;

            const isScorePadMessage = (
                parsedData: unknown
            ): parsedData is IScorePadMessage =>
                (parsedData as IScorePadMessage)?.type ===
                    EnumMessageType.NEW_PAD ||
                (parsedData as IScorePadMessage)?.type ===
                    EnumMessageType.UPDATE_PAD;

            if (isControlMessage(parsedData)) {
                parsedData.message && console.log(parsedData.message);
                parsedData.data && console.log(parsedData.data);
            } else if (isScorePadMessage(parsedData)) {
                switch (parsedData.type) {
                    case EnumMessageType.NEW_PAD:
                        setScorePadId(parsedData.scorePadId);
                        setPlayers(parsedData.players);
                        break;
                    case EnumMessageType.UPDATE_PAD:
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
        const players: IPlayers = {};
        for (let i = 0; i < numberOfPlayers; i++) {
            const newPlayer = buildPlayer(i + 1, startScore);
            players[newPlayer.id] = newPlayer;
        }
        const message: IScorePadMessage = {
            type: EnumMessageType.NEW_PAD,
            players: players,
        };

        webSocket.send(JSON.stringify(message));
    };

    const addPlayer = (startScore: number) => {
        const playerNames = Object.values(players).map((player) => player.name);
        let newPlayerNumber = Object.keys(players).length;

        while (playerNames.includes(`Player ${newPlayerNumber}`)) {
            newPlayerNumber++;
        }

        const newPlayer = buildPlayer(newPlayerNumber, startScore);
        const message: IScorePadMessage = {
            type: EnumMessageType.UPDATE_PAD,
            players: { ...players, newPlayer },
            scorePadId: scorePadId,
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
        addPlayer,
    };

    return (
        <ScorepadContext.Provider value={value}>
            {children}
        </ScorepadContext.Provider>
    );
};

export default ScorepadContext;
