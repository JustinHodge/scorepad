import { EnumMessageType, IPlayers, IScorePadMessage } from '../../../types';

class ScorePad {
    private players: IPlayers;
    private scorePadId: string;

    constructor(players: IPlayers) {
        this.players = players ?? {};
        this.scorePadId = crypto.randomUUID();
    }

    public getScorePadId = () => {
        return this.scorePadId;
    };

    public setPlayers = (players: IPlayers) => {
        this.players = players;
    };

    public getScorePadData = () => {
        return {
            players: this.players,
            scorePadId: this.scorePadId,
        };
    };
}

export class ScorePads {
    private scorePads: { [scorePadId: string]: ScorePad };

    // TODO Flush stale pads.

    constructor() {
        this.scorePads = {};
    }

    createNewScorePad(players: IPlayers): IScorePadMessage {
        const newScorePad = new ScorePad(players);
        const newScorePadId = newScorePad.getScorePadId();

        this.scorePads[newScorePadId] = newScorePad;

        return {
            scorePadData: newScorePad.getScorePadData(),
            type: EnumMessageType.NEW_PAD,
        };
    }

    updateScorePad(players: IPlayers, scorePadId: string): IScorePadMessage {
        const scorePad = this.scorePads[scorePadId];

        if (!scorePad) {
            console.log('ScorePad not found');
            return {
                scorePadData: { players: {}, scorePadId: '' },
                type: EnumMessageType.NEW_PAD,
            };
        }

        scorePad.setPlayers(players);

        return {
            scorePadData: scorePad.getScorePadData(),
            type: EnumMessageType.UPDATE_PAD,
        };
    }
}

export default ScorePads;
