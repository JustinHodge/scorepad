import { IPlayer, IScorePadMessage } from '../../../types';
import { EnumMessageType } from '../../../types';
import { ScorePads } from './scorePads';

export const websocketMessage = (
    data: IScorePadMessage,
    scorePads: ScorePads
) => {
    const { type, players } = data;
    console.log(`data: ${data}`);

    let response = null;

    const handleNewPad = (players: IPlayer[]) => {
        response = scorePads.createNewScorePad(players);
    };

    switch (type) {
        case EnumMessageType.NEW_PAD:
            handleNewPad(players);
            break;

        default:
            break;
    }

    console.log(response);

    return response;
};
