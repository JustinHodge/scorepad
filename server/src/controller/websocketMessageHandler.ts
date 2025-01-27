import { WebSocket } from 'ws';
import {
    EnumMessageType,
    IRequestAddPlayerMessage,
    IRequestNewPadMessage,
    IRequestUpdatePlayerMessage,
    IRequestUpdateScoreMessage,
    IResponseMessage,
} from '../../../types';
import { ScorePads } from './scorePads';

export const websocketMessageHandler = (
    data:
        | IRequestAddPlayerMessage
        | IRequestUpdateScoreMessage
        | IRequestNewPadMessage
        | IRequestUpdatePlayerMessage,
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

    console.log(`type: ${type}, scorePadId: ${scorePadId}`);

    switch (type) {
        // TODO implement all requests
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

    console.log(response);

    webSocket.send(JSON.stringify(response));
};
