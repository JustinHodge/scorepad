import { ScorePad } from './scorePad';

export class ScorePads {
    private scorePads: { [scorePadId: string]: ScorePad };

    // TODO Flush stale pads.

    constructor() {
        this.scorePads = {};
    }

    public getScorePad = (scorePadId: string) => {
        return this.scorePads[scorePadId];
    };

    public getScorePadDataById = (scorePadId: string) => {
        const scorePad = this.scorePads[scorePadId];

        if (!scorePad) {
            return {
                players: {},
                scorePadId: '',
            };
        }

        return this.scorePads[scorePadId].getScorePadData();
    };

    public createNewScorePad(
        numberOfPlayers: number,
        startScore: number
    ): ScorePad {
        const newScorePad = new ScorePad(numberOfPlayers, startScore);
        const newScorePadId = newScorePad.getScorePadId();

        this.scorePads[newScorePadId] = newScorePad;

        return this.scorePads[newScorePadId];
    }
}

export default ScorePads;
