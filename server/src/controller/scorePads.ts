import {
    EnumMessageType,
    EnumPlayerColors,
    IPlayers,
    IRequestUpdatePlayerMessageData,
    IScorePadData,
} from '../../../types';

class ScorePad {
    private players: IPlayers;
    private scorePadId: string;

    constructor(numberOfPlayers: number, startScore: number) {
        this.players = {};
        this.scorePadId = crypto.randomUUID();
        this.buildPlayers(startScore, numberOfPlayers);
    }

    private getPlayer = (playerId: string) => {
        const player = this.players[playerId];

        if (!player) {
            throw new Error('Player not found');
        }

        return player;
    };

    private buildPlayer = (startScore: number) => {
        this.buildPlayers(startScore, 1);
    };

    private buildPlayers = (startScore: number, numberToBuild: number) => {
        for (let i = 0; i < numberToBuild; i++) {
            const randomColorIndex = Math.floor(
                Math.random() * Object.keys(EnumPlayerColors).length
            );
            const randomColorKey =
                EnumPlayerColors[
                    Object.keys(EnumPlayerColors)[
                        randomColorIndex
                    ] as keyof typeof EnumPlayerColors
                ];
            const playerId = crypto.randomUUID();

            const playerNames = Object.values(this.players).map(
                (player) => player.name
            );
            let newPlayerNumber = Object.keys(this.players).length;

            while (playerNames.includes(`Player ${newPlayerNumber}`)) {
                newPlayerNumber++;
            }

            this.players[playerId] = {
                id: playerId,
                color: randomColorKey,
                name: `Player ${newPlayerNumber}`,
                score: startScore,
            };
        }
    };

    public getScorePadId = () => {
        return this.scorePadId;
    };

    public addPlayer = (startScore: number) => {
        this.buildPlayer(startScore);
    };

    public getScorePadData = () => {
        return {
            players: this.players,
            scorePadId: this.scorePadId,
        };
    };

    public updatePlayer = ({
        playerId,
        newName,
        newColor,
    }: IRequestUpdatePlayerMessageData) => {
        const player = this.getPlayer(playerId);

        if (newName) {
            player.name = newName;
        }

        if (newColor) {
            player.color = newColor;
        }
    };

    public updatePlayerScore = (playerId: string, newScore: number) => {
        const player = this.getPlayer(playerId);

        player.score = newScore;
    };
}

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
        return this.scorePads[scorePadId].getScorePadData();
    };

    public createNewScorePad(
        numberOfPlayers: number,
        startScore: number
    ): IScorePadData {
        const newScorePad = new ScorePad(numberOfPlayers, startScore);
        const newScorePadId = newScorePad.getScorePadId();

        this.scorePads[newScorePadId] = newScorePad;

        return this.scorePads[newScorePadId].getScorePadData();
    }
}

export default ScorePads;
