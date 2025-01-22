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

    public setPlayers = (players: IPlayer[]) => {
        this.players = players;
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

    updateScorePad(players: IPlayer[], scorePadId: string): IScorePadMessage {
        const scorePad = this.scorePads.find((scorePad) => {
            return scorePad.getScorePadId() === scorePadId;
        });

        if (!scorePad) {
            console.log('ScorePad not found');
            return {
                players,
                type: EnumMessageType.NEW_PAD,
            };
        }

        scorePad.setPlayers(players);

        return {
            players,
            type: EnumMessageType.UPDATE_PAD,
            scorePadId: scorePad.getScorePadId(),
        };
    }
}

export default ScorePads;
