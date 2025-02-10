import { WebSocket } from 'ws';
import {
    IRequestMessage,
    IRequestAddPlayerData,
    IRequestNewPadData,
    IRequestUpdatePlayerData,
    IRequestUpdateScoreData,
    IResponseMessage,
} from '../types';
import { ScorePads } from '../class/scorePads';
import { ScorePad } from '../class/scorePad';
import { MESSAGE_TYPE } from '../globalConstants';

export const websocketMessageHandler = (
    data: IRequestMessage,
    scorePads: ScorePads,
    sourceWebSocket: WebSocket
) => {
    const { type, data: requestData, scorePadId } = data;
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

    const buildHandlerErrorMessage = (
        messageType: keyof typeof MESSAGE_TYPE,
        providedData: IRequestMessage
    ) => {
        return `Incorrect data provided to ${messageType}: ${JSON.stringify(
            providedData
        )}`;
    };

    const handlers = {
        [MESSAGE_TYPE.REQUEST_JOIN_EXISTING]: (): ScorePad => {
            // TODO: better error handling for invalid scorePadId
            if (!existingScorePad) {
                throw new Error(
                    buildHandlerErrorMessage(
                        MESSAGE_TYPE.REQUEST_JOIN_EXISTING,
                        data
                    )
                );
            }
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

            if (!numberOfPlayers || startScore === undefined) {
                throw new Error(
                    buildHandlerErrorMessage(MESSAGE_TYPE.REQUEST_NEW_PAD, data)
                );
            }

            const newScorePad = scorePads.createNewScorePad(
                numberOfPlayers,
                startScore,
                sourceWebSocket
            );

            return newScorePad;
        },
        [MESSAGE_TYPE.REQUEST_ADD_PLAYER]: (): ScorePad => {
            const { startScore } = requestData as IRequestAddPlayerData;

            if (startScore === undefined) {
                throw new Error(
                    buildHandlerErrorMessage(
                        MESSAGE_TYPE.REQUEST_ADD_PLAYER,
                        data
                    )
                );
            }

            existingScorePad.addPlayer(startScore);

            return existingScorePad;
        },
        [MESSAGE_TYPE.REQUEST_UPDATE_PLAYER]: (): ScorePad => {
            const { playerId, newName, newColor } =
                requestData as IRequestUpdatePlayerData;

            if (!playerId) {
                throw new Error(
                    buildHandlerErrorMessage(
                        MESSAGE_TYPE.REQUEST_UPDATE_PLAYER,
                        data
                    )
                );
            }

            existingScorePad.updatePlayer({ playerId, newName, newColor });

            return existingScorePad;
        },
        [MESSAGE_TYPE.REQUEST_UPDATE_SCORE]: (): ScorePad => {
            const { playerId, newScore } =
                requestData as IRequestUpdateScoreData;

            if (!playerId || !newScore) {
                throw new Error(
                    buildHandlerErrorMessage(
                        MESSAGE_TYPE.REQUEST_UPDATE_SCORE,
                        data
                    )
                );
            }
            existingScorePad.updatePlayerScore(playerId, newScore);

            return existingScorePad;
        },
    };

    if (handlers[type]) {
        const scorePad = handlers[type]();
        if (!(scorePad instanceof ScorePad)) {
            throw new Error(
                `Incorrect return value of message handler function for type ${type}.`
            );
        }

        response.data.success = true;
        response.data.scorePadData = scorePad.getScorePadData();
        response.scorePadId = scorePad.getScorePadId();

        scorePad.sendBroadcastMessage(response);
        return;
    }

    throw new Error(`No handler found for type ${type}`);
};
