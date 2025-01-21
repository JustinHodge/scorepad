import { IPlayer } from '../../../types';

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

    createNewScorePad(players: IPlayer[]) {
        const newScorePad = new ScorePad(players);
        console.log(`newScorePad: ${newScorePad}`);
        this.scorePads.push(newScorePad);
        return newScorePad.getScorePadId();
    }
}

export default ScorePads;
