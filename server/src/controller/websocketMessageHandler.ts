import { WebSocket } from 'ws';
import { IScorePadMessage } from '../../../types';
import { EnumMessageType } from '../../../types';
import { ScorePads } from './scorePads';

export const websocketMessageHandler = (
    data: IScorePadMessage,
    scorePads: ScorePads,
    webSocket: WebSocket
) => {
    const { type, players, scorePadId } = data;

    let response: IScorePadMessage | null = null;

    switch (type) {
        case EnumMessageType.NEW_PAD:
            response = scorePads.createNewScorePad(players);
            break;
        case EnumMessageType.UPDATE_PAD:
            response = scorePads.updateScorePad(players, scorePadId ?? '');
            break;
        default:
            break;
    }

    webSocket.send(JSON.stringify(response));
};
