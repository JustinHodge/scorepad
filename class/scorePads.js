"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScorePads = void 0;
const scorePad_1 = require("./scorePad");
class ScorePads {
    // TODO Flush stale pads.
    constructor() {
        this.getScorePads = () => {
            return this.scorePads;
        };
        this.getScorePad = (scorePadId) => {
            return this.scorePads[scorePadId];
        };
        this.getScorePadDataById = (scorePadId) => {
            const scorePad = this.scorePads[scorePadId];
            if (!scorePad) {
                return {
                    players: {},
                    scorePadId: '',
                };
            }
            return this.scorePads[scorePadId].getScorePadData();
        };
        this.scorePads = {};
    }
    createNewScorePad(numberOfPlayers, startScore, webSocket) {
        const newScorePad = new scorePad_1.ScorePad(numberOfPlayers, startScore, webSocket);
        const newScorePadId = newScorePad.getScorePadId();
        this.scorePads[newScorePadId] = newScorePad;
        return this.scorePads[newScorePadId];
    }
}
exports.ScorePads = ScorePads;
exports.default = ScorePads;
