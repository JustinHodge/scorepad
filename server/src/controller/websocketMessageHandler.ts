import { WebSocket } from 'ws';
import {
    EnumMessageType,
    IRequestAddPlayerMessage,
    IRequestJoinExistingMessage,
    IRequestNewPadMessage,
    IRequestUpdatePlayerMessage,
    IRequestUpdateScoreMessage,
    IResponseMessage,
} from '../../../types';
import { ScorePads } from '../class/scorePads';

export const websocketMessageHandler = (
    data:
        | IRequestAddPlayerMessage
        | IRequestUpdateScoreMessage
        | IRequestNewPadMessage
        | IRequestUpdatePlayerMessage
        | IRequestJoinExistingMessage,
    scorePads: ScorePads,
    webSocket: WebSocket
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

    switch (type) {
        case EnumMessageType.REQUEST_JOIN_EXISTING:
            response.data.scorePadData = scorePad.getScorePadData();
            response.data.success = true;
            response.scorePadId = scorePad.getScorePadId();
            break;
        case EnumMessageType.REQUEST_NEW_PAD:
            const newScorePad = scorePads.createNewScorePad(
                requestData.numberOfPlayers,
                requestData.startScore
            );

            response.data.scorePadData = newScorePad.getScorePadData();
            response.data.success = true;
            response.scorePadId = newScorePad.getScorePadId();
            break;
        case EnumMessageType.REQUEST_ADD_PLAYER:
            scorePad.addPlayer(requestData.startScore);
            response.data.success = true;
            response.data.scorePadData = scorePad.getScorePadData();
            response.scorePadId = scorePad.getScorePadId();
            break;
        case EnumMessageType.REQUEST_UPDATE_PLAYER:
            scorePad.updatePlayer(requestData);
            response.data.success = true;
            response.data.scorePadData = scorePad.getScorePadData();
            response.scorePadId = scorePad.getScorePadId();
            break;
        case EnumMessageType.REQUEST_UPDATE_SCORE:
            scorePad.updatePlayerScore(
                requestData.playerId,
                requestData.newScore
            );
            response.data.success = true;
            response.data.scorePadData = scorePad.getScorePadData();
            response.scorePadId = scorePad.getScorePadId();
            break;
        default:
            break;
    }

    webSocket.send(JSON.stringify(response));
};
