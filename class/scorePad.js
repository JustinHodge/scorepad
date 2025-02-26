"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScorePad = void 0;
const globalConstants_1 = require("../globalConstants");
class ScorePad {
    constructor(numberOfPlayers, startScore, webSocket) {
        this.getPlayer = (playerId) => {
            const player = this.players[playerId];
            return player;
        };
        this.buildPlayer = (startScore) => {
            this.buildPlayers(startScore, 1);
        };
        this.buildPlayers = (startScore, numberToBuild) => {
            for (let i = 0; i < numberToBuild; i++) {
                const randomColorIndex = Math.floor(Math.random() * Object.keys(globalConstants_1.PLAYER_COLORS).length);
                const randomColorKey = globalConstants_1.PLAYER_COLORS[Object.keys(globalConstants_1.PLAYER_COLORS)[randomColorIndex]];
                const playerId = crypto.randomUUID();
                const playerNames = Object.values(this.players).map((player) => player.name);
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
        this.getScorePadId = () => {
            return this.scorePadId;
        };
        this.addPlayer = (startScore) => {
            this.buildPlayer(startScore);
        };
        this.getScorePadData = () => {
            return {
                players: this.players,
                scorePadId: this.scorePadId,
            };
        };
        this.updatePlayer = ({ playerId, newName, newColor, }) => {
            const player = this.getPlayer(playerId);
            if (newName) {
                player.name = newName;
            }
            if (newColor) {
                player.color = newColor;
            }
        };
        this.updatePlayerScore = (playerId, newScore) => {
            var _a;
            const player = this.getPlayer(playerId);
            player.score = (_a = newScore !== null && newScore !== void 0 ? newScore : player.score) !== null && _a !== void 0 ? _a : 0;
        };
        this.sendBroadcastMessage = (message) => {
            this.webSockets.forEach((webSocket) => {
                webSocket.send(JSON.stringify(message));
            });
        };
        this.joinGame = (joiningWebSocket) => {
            this.webSockets.push(joiningWebSocket);
        };
        this.leaveGame = (leavingWebSocket) => {
            this.webSockets = this.webSockets.filter((webSocket) => webSocket !== leavingWebSocket);
            leavingWebSocket.send(JSON.stringify({
                type: globalConstants_1.MESSAGE_TYPE.RESPONSE_MESSAGE,
                data: {
                    success: true,
                    message: 'You have left the score pad',
                    request: {
                        type: globalConstants_1.MESSAGE_TYPE.REQUEST_LEAVE_EXISTING,
                        scorePadId: this.scorePadId,
                        data: {},
                    },
                    scorePadData: {
                        players: {},
                        scorePadId: '',
                    },
                },
            }));
        };
        this.removePlayer = (playerId) => {
            delete this.players[playerId];
        };
        this.players = {};
        this.scorePadId = crypto.randomUUID();
        this.buildPlayers(startScore, numberOfPlayers);
        this.webSockets = [webSocket];
    }
}
exports.ScorePad = ScorePad;
