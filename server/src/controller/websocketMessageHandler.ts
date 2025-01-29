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

    const scorePad = scorePads.getScorePad(scorePadId);

    const buildHandlerErrorMessage = (
        messageType: EnumMessageType,
        providedData: IRequestMessage
    ) => {
        return `Incorrect data provided to ${messageType}: ${JSON.stringify(
            providedData
        )}`;
    };

    const handlers = {
        [EnumMessageType.REQUEST_JOIN_EXISTING]: () => {
            response.data.scorePadData = scorePad.getScorePadData();
            response.data.success = true;
            response.scorePadId = scorePad.getScorePadId();
        },
        [EnumMessageType.REQUEST_NEW_PAD]: () => {
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

            response.data.scorePadData = newScorePad.getScorePadData();
            response.data.success = true;
            response.scorePadId = newScorePad.getScorePadId();
        },
        [EnumMessageType.REQUEST_ADD_PLAYER]: () => {
            const { startScore } = requestData as IRequestAddPlayerData;

            // TODO does this fail on startScore = 0?
            if (startScore === undefined) {
                throw new Error(
                    buildHandlerErrorMessage(
                        EnumMessageType.REQUEST_ADD_PLAYER,
                        data
                    )
                );
            }
            scorePad.addPlayer(startScore);
            response.data.success = true;
            response.data.scorePadData = scorePad.getScorePadData();
            response.scorePadId = scorePad.getScorePadId();
        },
        [EnumMessageType.REQUEST_UPDATE_PLAYER]: () => {
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
            scorePad.updatePlayer({ playerId, newName, newColor });
            response.data.success = true;
            response.data.scorePadData = scorePad.getScorePadData();
            response.scorePadId = scorePad.getScorePadId();
        },
        [EnumMessageType.REQUEST_UPDATE_SCORE]: () => {
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
            scorePad.updatePlayerScore(playerId, newScore);
            response.data.success = true;
            response.data.scorePadData = scorePad.getScorePadData();
            response.scorePadId = scorePad.getScorePadId();
        },
    };

    if (handlers[type]) {
        handlers[type]();
    }

    scorePad.sendBroadcastMessage(response);
};
