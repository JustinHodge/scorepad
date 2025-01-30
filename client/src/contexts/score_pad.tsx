import { createContext, useMemo, useState } from 'react';
import {
    EnumMessageType,
    IRequestAddPlayerMessage,
    IRequestJoinExistingMessage,
    IRequestLeaveExistingMessage,
    IRequestNewPadMessage,
    IResponseMessage,
    IScorePadData,
    ISystemMessage,
} from '../../../types';

interface IScorePadContext {
    isConnected: boolean;
    scorePadData: IScorePadData;
    startNewScorePad: (numberOfPlayers: number, startScore: number) => void;
    addPlayer: (startScore: number) => void;
    requestJoinExisting: (scorePadId: string) => void;
    requestLeaveExisting: () => void;
}

export const ScorepadContext = createContext<IScorePadContext>(
    {} as IScorePadContext
);

export const ScorePadProvider = ({ children }: React.PropsWithChildren) => {
    const [isConnected, setIsConnected] = useState(false);
    const [scorePadData, setScorePadData] = useState<IScorePadData>({
        players: {},
        scorePadId: '',
    });

    const webSocket = useMemo(() => {
        const webSocket = new WebSocket('ws://localhost:3000');
        webSocket.onopen = () => {
            setIsConnected(true);
        };

        webSocket.onmessage = (event) => {
            const parsedData = JSON.parse(event.data) as
                | IResponseMessage
                | ISystemMessage;
            console.log(parsedData);

            if (parsedData.type === EnumMessageType.SYSTEM_MESSAGE) {
                console.log(parsedData.data.message);
                return;
            }

            const {
                type,
                data: {
                    success,
                    request,
                    scorePadData: newScorePadData,
                    message,
                },
            } = JSON.parse(event.data) as IResponseMessage;

            if (type !== EnumMessageType.RESPONSE_MESSAGE) {
                console.error(
                    `Received a non-response message from the server: ${event.data}`
                );
                return;
            }

            if (!success) {
                console.log(`Failed ${request.type} request. ${message}`);
                return;
            }

            console.log('newScorePadData: ', newScorePadData);
            setScorePadData(newScorePadData);
        };

        webSocket.onerror = (event) => {
            console.log('error: ', event);
        };

        webSocket.onclose = () => {
            setIsConnected(false);
            console.log('Disconnected from server');
        };

        return webSocket;
    }, []);

    const startNewScorePad = async (
        numberOfPlayers: number,
        startScore: number
    ) => {
        const message: IRequestNewPadMessage = {
            type: EnumMessageType.REQUEST_NEW_PAD,
            scorePadId: scorePadData.scorePadId,
            data: {
                numberOfPlayers,
                startScore,
            },
        };

        webSocket.send(JSON.stringify(message));
    };

    const addPlayer = (startScore: number) => {
        const message: IRequestAddPlayerMessage = {
            type: EnumMessageType.REQUEST_ADD_PLAYER,
            scorePadId: scorePadData.scorePadId,
            data: {
                startScore,
            },
        };

        webSocket.send(JSON.stringify(message));
    };

    const requestJoinExisting = (scorePadId: string) => {
        const message: IRequestJoinExistingMessage = {
            type: EnumMessageType.REQUEST_JOIN_EXISTING,
            scorePadId,
            data: {},
        };

        webSocket.send(JSON.stringify(message));
    };

    const requestLeaveExisting = () => {
        const message: IRequestLeaveExistingMessage = {
            type: EnumMessageType.REQUEST_LEAVE_EXISTING,
            scorePadId: scorePadData.scorePadId,
            data: {},
        };

        webSocket.send(JSON.stringify(message));
    };

    const value = {
        isConnected,
        scorePadData,
        startNewScorePad,
        addPlayer,
        requestJoinExisting,
        requestLeaveExisting,
    };

    return (
        <ScorepadContext.Provider value={value}>
            {children}
        </ScorepadContext.Provider>
    );
};

export default ScorepadContext;
