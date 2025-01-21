import { EnumMessageType, IPlayer, IScorePadMessage } from '../../../types';

class ScorePad {
    private players: IPlayer[];
    private scorePadId: string;

    constructor(players: IPlayer[]) {
        this.players = [];
        this.scorePadId = crypto.randomUUID();
    }

    public getScorePadId = () => {
        return this.scorePadId;
    };
}

export class ScorePads {
    private scorePads: ScorePad[];

    // TODO Flush stale pads.

    constructor() {
        this.scorePads = [];
    }

    createNewScorePad(players: IPlayer[]): IScorePadMessage {
        const newScorePad = new ScorePad(players);
        this.scorePads.push(newScorePad);
        return {
            players,
            type: EnumMessageType.NEW_PAD,
            scorePadId: newScorePad.getScorePadId(),
        };
    }
}

export default ScorePads;
