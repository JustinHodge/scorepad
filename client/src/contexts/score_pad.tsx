import { createContext, useMemo, useState } from 'react';
import {
    IRequestAddPlayerMessage,
    IRequestJoinExistingMessage,
    IRequestLeaveExistingMessage,
    IRequestNewPadMessage,
    IRequestUpdatePlayerData,
    IRequestUpdatePlayerMessage,
    IRequestUpdateScoreData,
    IRequestUpdateScoreMessage,
    IResponseMessage,
    IScorePadData,
    ISystemMessage,
} from '../../../types';
import { MESSAGE_TYPE } from '../../../globalConstants';

interface IScorePadContext {
    isConnected: boolean;
    scorePadData: IScorePadData;
    startNewScorePad: (numberOfPlayers: number, startScore: number) => void;
    addPlayer: (startScore: number) => void;
    requestJoinExisting: (scorePadId: string) => void;
    requestLeaveExisting: () => void;
    requestUpdatePlayerData: (requestData: IRequestUpdatePlayerData) => void;
    requestUpdatePlayerScore: (requestData: IRequestUpdateScoreData) => void;
    attemptReconnect: () => void;
}

const HEARTBEAT_TIMER_MS = 30000 as const;

export const ScorepadContext = createContext<IScorePadContext>(
    {} as IScorePadContext
);

export const ScorePadProvider = ({ children }: React.PropsWithChildren) => {
    const [isConnected, setIsConnected] = useState(false);
    const [scorePadData, setScorePadData] = useState<IScorePadData>({
        players: {},
        scorePadId: '',
    });
    const [connectCount, setConnectCount] = useState(1);

    const connectToServer = () => {
        const hostURL = import.meta.env.VITE_SERVER_URL || window.location.host;
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

        const webSocket = new WebSocket(`${protocol}://${hostURL}`);
        webSocket.onopen = () => {
            setIsConnected(webSocket.readyState === 1);

            setInterval(() => {
                webSocket.send(
                    JSON.stringify({
                        type: MESSAGE_TYPE.SYSTEM_MESSAGE,
                        data: { message: 'ping' },
                    })
                );
            }, HEARTBEAT_TIMER_MS);
            console.log('Connected to the server');
        };

        webSocket.onmessage = (event) => {
            const parsedData = JSON.parse(event.data) as
                | IResponseMessage
                | ISystemMessage;

            if (parsedData.type === MESSAGE_TYPE.SYSTEM_MESSAGE) {
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

            if (type !== MESSAGE_TYPE.RESPONSE_MESSAGE) {
                console.error(
                    `Received a non-response message from the server: ${event.data}`
                );
                return;
            }

            if (!success) {
                console.log(`Failed ${request.type} request. ${message}`);
                return;
            }

            setScorePadData(newScorePadData);

            if (
                request.type === MESSAGE_TYPE.REQUEST_JOIN_EXISTING &&
                scorePadData.scorePadId === ''
            ) {
                const currentUrl = new URL(window.location.toString());
                currentUrl.searchParams.delete('pad_id');
                window.location.replace(currentUrl.toString());
            }

            if (request.type === MESSAGE_TYPE.REQUEST_NEW_PAD) {
                const currentUrl = new URL(window.location.toString());
                currentUrl.searchParams.set(
                    'pad_id',
                    newScorePadData.scorePadId
                );
                window.location.replace(currentUrl.toString());
            }

            if (request.type === MESSAGE_TYPE.REQUEST_LEAVE_EXISTING) {
                const currentUrl = new URL(window.location.toString());
                currentUrl.searchParams.delete('pad_id');
                window.location.replace(currentUrl.toString());
            }
        };

        webSocket.onerror = (event) => {
            setIsConnected(webSocket.readyState === 1);
            console.log('error: ', event);
        };

        webSocket.onclose = () => {
            setIsConnected(webSocket.readyState === 1);
            console.log('Disconnected from server');
        };

        return webSocket;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const webSocket = useMemo(connectToServer, [connectCount]);

    const startNewScorePad = async (
        numberOfPlayers: number,
        startScore: number
    ) => {
        const message: IRequestNewPadMessage = {
            type: MESSAGE_TYPE.REQUEST_NEW_PAD,
            scorePadId: scorePadData.scorePadId,
            data: {
                numberOfPlayers,
                startScore,
            },
        };

        webSocket.send(JSON.stringify(message));
    };

    const attemptReconnect = () => {
        webSocket && webSocket.close();
        setConnectCount((c) => c + 1);
    };

    const requestAddPlayer = (startScore: number) => {
        const message: IRequestAddPlayerMessage = {
            type: MESSAGE_TYPE.REQUEST_ADD_PLAYER,
            scorePadId: scorePadData.scorePadId,
            data: {
                startScore,
            },
        };

        webSocket.send(JSON.stringify(message));
    };

    const requestJoinExisting = (scorePadId: string) => {
        const message: IRequestJoinExistingMessage = {
            type: MESSAGE_TYPE.REQUEST_JOIN_EXISTING,
            scorePadId,
            data: {},
        };

        webSocket.send(JSON.stringify(message));
    };

    const requestLeaveExisting = () => {
        const message: IRequestLeaveExistingMessage = {
            type: MESSAGE_TYPE.REQUEST_LEAVE_EXISTING,
            scorePadId: scorePadData.scorePadId,
            data: {},
        };

        webSocket.send(JSON.stringify(message));
    };

    const requestUpdatePlayerData = (
        updatedPlayerData: IRequestUpdatePlayerData
    ) => {
        const message: IRequestUpdatePlayerMessage = {
            type: MESSAGE_TYPE.REQUEST_UPDATE_PLAYER,
            scorePadId: scorePadData.scorePadId,
            data: updatedPlayerData,
        };

        webSocket.send(JSON.stringify(message));
    };

    const requestUpdatePlayerScore = (
        updatedPlayerScore: IRequestUpdateScoreData
    ) => {
        const message: IRequestUpdateScoreMessage = {
            type: MESSAGE_TYPE.REQUEST_UPDATE_SCORE,
            scorePadId: scorePadData.scorePadId,
            data: updatedPlayerScore,
        };

        webSocket.send(JSON.stringify(message));
    };

    const value = {
        isConnected,
        scorePadData,
        startNewScorePad,
        addPlayer: requestAddPlayer,
        requestJoinExisting,
        requestLeaveExisting,
        requestUpdatePlayerData,
        requestUpdatePlayerScore,
        attemptReconnect,
    };

    return (
        <ScorepadContext.Provider value={value}>
            {children}
        </ScorepadContext.Provider>
    );
};

export default ScorepadContext;
