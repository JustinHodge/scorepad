import { WebSocket } from 'ws';
import {
    IRequestMessage,
    IRequestAddPlayerData,
    IRequestNewPadData,
    IRequestUpdatePlayerData,
    IRequestUpdateScoreData,
    IResponseMessage,
    ISystemMessage,
} from '../types';
import { ScorePads } from '../class/scorePads';
import { ScorePad } from '../class/scorePad';
import { MESSAGE_TYPE } from '../globalConstants';

export const websocketMessageHandler = (
    data: IRequestMessage | ISystemMessage,
    scorePads: ScorePads,
    sourceWebSocket: WebSocket
) => {
    const { type } = data;
    if (type === MESSAGE_TYPE.SYSTEM_MESSAGE) {
        let response: ISystemMessage = {
            type: MESSAGE_TYPE.SYSTEM_MESSAGE,
            data: {
                message: '',
            },
        };

        if (data.data.message === 'ping') {
            response.data.message = 'pong';
        }

        sourceWebSocket.send(JSON.stringify(response));

        return;
    }

    const { data: requestData, scorePadId } = data;
    let response: IResponseMessage = {
        type: MESSAGE_TYPE.RESPONSE_MESSAGE,
        scorePadId: scorePadId,
        data: {
            success: false,
            request: {
                type: data.type,
            },
            scorePadData: scorePads.getScorePadDataById(scorePadId),
        },
    };

    const existingScorePad = scorePads.getScorePad(scorePadId);

    const handlers = {
        [MESSAGE_TYPE.REQUEST_JOIN_EXISTING]: (): ScorePad => {
            // TODO: better error handling for invalid scorePadId
            existingScorePad.joinGame(sourceWebSocket);

            return existingScorePad ?? { players: {}, scorePadId: '' };
        },
        [MESSAGE_TYPE.REQUEST_LEAVE_EXISTING]: (): ScorePad => {
            existingScorePad.leaveGame(sourceWebSocket);
            return existingScorePad;
        },
        [MESSAGE_TYPE.REQUEST_NEW_PAD]: (): ScorePad => {
            const { numberOfPlayers, startScore } =
                requestData as IRequestNewPadData;

            const newScorePad = scorePads.createNewScorePad(
                numberOfPlayers || 0,
                startScore || 0,
                sourceWebSocket
            );
            return newScorePad;
        },
        [MESSAGE_TYPE.REQUEST_ADD_PLAYER]: (): ScorePad => {
            const { startScore } = requestData as IRequestAddPlayerData;

            if (startScore !== undefined) {
                existingScorePad.addPlayer(startScore);
            }

            return existingScorePad;
        },
        [MESSAGE_TYPE.REQUEST_UPDATE_PLAYER]: (): ScorePad => {
            const { playerId, newName, newColor } =
                requestData as IRequestUpdatePlayerData;

            if (playerId) {
                existingScorePad.updatePlayer({ playerId, newName, newColor });
            }

            return existingScorePad;
        },
        [MESSAGE_TYPE.REQUEST_UPDATE_SCORE]: (): ScorePad => {
            const { playerId, newScore } =
                requestData as IRequestUpdateScoreData;

            if (playerId && newScore) {
                existingScorePad.updatePlayerScore(playerId, newScore);
            } else {
                console.error(
                    'No playerId or newScore provided to update score'
                );
            }

            return existingScorePad;
        },
    };

    if (handlers[type]) {
        const scorePad = handlers[type]();

        response.data.success = true;
        response.data.scorePadData = scorePad.getScorePadData();
        response.scorePadId = scorePad.getScorePadId();

        scorePad.sendBroadcastMessage(response);
        return;
    }

    console.error(`No handler found for type ${type}`);
};
