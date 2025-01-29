import { WebSocket } from 'ws';
import {
    EnumMessageType,
    IRequestMessage,
    IRequestAddPlayerData,
    IRequestNewPadData,
    IRequestUpdatePlayerData,
    IRequestUpdateScoreData,
    IResponseMessage,
} from '../../../types';
import { ScorePads } from '../class/scorePads';
import { ScorePad } from '../class/scorePad';

export const websocketMessageHandler = (
    data: IRequestMessage,
    scorePads: ScorePads,
    sourceWebSocket: WebSocket
) => {
    const { type, data: requestData, scorePadId } = data;
    let response: IResponseMessage = {
        type: EnumMessageType.RESPONSE_MESSAGE,
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
        messageType: EnumMessageType,
        providedData: IRequestMessage
    ) => {
        return `Incorrect data provided to ${messageType}: ${JSON.stringify(
            providedData
        )}`;
    };

    const handlers = {
        [EnumMessageType.REQUEST_JOIN_EXISTING]: (): ScorePad => {
            // TODO implement this correctly. need to add websocket to scorepads list
            existingScorePad.joinGame(sourceWebSocket);
            return existingScorePad;
        },
        [EnumMessageType.REQUEST_NEW_PAD]: (): ScorePad => {
            const { numberOfPlayers, startScore } =
                requestData as IRequestNewPadData;

            if (!numberOfPlayers || startScore === undefined) {
                throw new Error(
                    buildHandlerErrorMessage(
                        EnumMessageType.REQUEST_NEW_PAD,
                        data
                    )
                );
            }

            const newScorePad = scorePads.createNewScorePad(
                numberOfPlayers,
                startScore,
                sourceWebSocket
            );

            return newScorePad;
        },
        [EnumMessageType.REQUEST_ADD_PLAYER]: (): ScorePad => {
            const { startScore } = requestData as IRequestAddPlayerData;

            if (startScore === undefined) {
                throw new Error(
                    buildHandlerErrorMessage(
                        EnumMessageType.REQUEST_ADD_PLAYER,
                        data
                    )
                );
            }

            existingScorePad.addPlayer(startScore);

            return existingScorePad;
        },
        [EnumMessageType.REQUEST_UPDATE_PLAYER]: (): ScorePad => {
            const { playerId, newName, newColor } =
                requestData as IRequestUpdatePlayerData;

            if (!playerId) {
                throw new Error(
                    buildHandlerErrorMessage(
                        EnumMessageType.REQUEST_UPDATE_PLAYER,
                        data
                    )
                );
            }

            existingScorePad.updatePlayer({ playerId, newName, newColor });

            return existingScorePad;
        },
        [EnumMessageType.REQUEST_UPDATE_SCORE]: (): ScorePad => {
            const { playerId, newScore } =
                requestData as IRequestUpdateScoreData;

            if (!playerId || !newScore) {
                throw new Error(
                    buildHandlerErrorMessage(
                        EnumMessageType.REQUEST_UPDATE_SCORE,
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
