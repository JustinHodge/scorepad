import { MESSAGE_TYPE, PLAYER_COLORS } from '../globalConstants';
import { IPlayers, IRequestUpdatePlayerData, IResponseMessage } from '../types';

import { WebSocket } from 'ws';

export class ScorePad {
    private players: IPlayers;
    private scorePadId: string;
    private webSockets: WebSocket[];

    constructor(
        numberOfPlayers: number,
        startScore: number,
        webSocket: WebSocket
    ) {
        this.players = {};
        this.scorePadId = crypto.randomUUID();
        this.buildPlayers(startScore, numberOfPlayers);
        this.webSockets = [webSocket];
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
                Math.random() * Object.keys(PLAYER_COLORS).length
            );
            const randomColorKey =
                PLAYER_COLORS[
                    Object.keys(PLAYER_COLORS)[
                        randomColorIndex
                    ] as keyof typeof PLAYER_COLORS
                ];
            const playerId = crypto.randomUUID();

            const playerNames = Object.values(this.players).map(
                (player) => player.name
            );
            let newPlayerNumber = Object.keys(this.players).length + 1;

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
    }: IRequestUpdatePlayerData) => {
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

    public sendBroadcastMessage = (message: IResponseMessage) => {
        this.webSockets.forEach((webSocket) => {
            webSocket.send(JSON.stringify(message));
        });
    };

    public joinGame = (joiningWebSocket: WebSocket) => {
        this.webSockets.push(joiningWebSocket);
    };

    public leaveGame = (leavingWebSocket: WebSocket) => {
        this.webSockets = this.webSockets.filter(
            (webSocket) => webSocket !== leavingWebSocket
        );

        leavingWebSocket.send(
            JSON.stringify({
                type: MESSAGE_TYPE.RESPONSE_MESSAGE,
                data: {
                    success: true,
                    message: 'You have left the score pad',
                    request: {
                        type: MESSAGE_TYPE.REQUEST_LEAVE_EXISTING,
                        scorePadId: this.scorePadId,
                        data: {},
                    },
                    scorePadData: {
                        players: {},
                        scorePadId: '',
                    },
                },
            })
        );
    };
}
