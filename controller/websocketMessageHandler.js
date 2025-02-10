"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.websocketMessageHandler = void 0;
const scorePad_1 = require("../class/scorePad");
const globalConstants_1 = require("../globalConstants");
const websocketMessageHandler = (data, scorePads, sourceWebSocket) => {
    const { type, data: requestData, scorePadId } = data;
    let response = {
        type: globalConstants_1.MESSAGE_TYPE.RESPONSE_MESSAGE,
        scorePadId: scorePadId,
        data: {
            success: false,
            request: {
                type: data.type,
            },
            scorePadData: scorePads.getScorePadDataById(scorePadId),
        },
    };
    const existingScorePad = scorePads.getScorePad(scorePadId);
    const buildHandlerErrorMessage = (messageType, providedData) => {
        return `Incorrect data provided to ${messageType}: ${JSON.stringify(providedData)}`;
    };
    const handlers = {
        [globalConstants_1.MESSAGE_TYPE.REQUEST_JOIN_EXISTING]: () => {
            // TODO: better error handling for invalid scorePadId
            if (!existingScorePad) {
                throw new Error(buildHandlerErrorMessage(globalConstants_1.MESSAGE_TYPE.REQUEST_JOIN_EXISTING, data));
            }
            existingScorePad.joinGame(sourceWebSocket);
            return existingScorePad !== null && existingScorePad !== void 0 ? existingScorePad : { players: {}, scorePadId: '' };
        },
        [globalConstants_1.MESSAGE_TYPE.REQUEST_LEAVE_EXISTING]: () => {
            existingScorePad.leaveGame(sourceWebSocket);
            return existingScorePad;
        },
        [globalConstants_1.MESSAGE_TYPE.REQUEST_NEW_PAD]: () => {
            const { numberOfPlayers, startScore } = requestData;
            if (!numberOfPlayers || startScore === undefined) {
                throw new Error(buildHandlerErrorMessage(globalConstants_1.MESSAGE_TYPE.REQUEST_NEW_PAD, data));
            }
            const newScorePad = scorePads.createNewScorePad(numberOfPlayers, startScore, sourceWebSocket);
            return newScorePad;
        },
        [globalConstants_1.MESSAGE_TYPE.REQUEST_ADD_PLAYER]: () => {
            const { startScore } = requestData;
            if (startScore === undefined) {
                throw new Error(buildHandlerErrorMessage(globalConstants_1.MESSAGE_TYPE.REQUEST_ADD_PLAYER, data));
            }
            existingScorePad.addPlayer(startScore);
            return existingScorePad;
        },
        [globalConstants_1.MESSAGE_TYPE.REQUEST_UPDATE_PLAYER]: () => {
            const { playerId, newName, newColor } = requestData;
            if (!playerId) {
                throw new Error(buildHandlerErrorMessage(globalConstants_1.MESSAGE_TYPE.REQUEST_UPDATE_PLAYER, data));
            }
            existingScorePad.updatePlayer({ playerId, newName, newColor });
            return existingScorePad;
        },
        [globalConstants_1.MESSAGE_TYPE.REQUEST_UPDATE_SCORE]: () => {
            const { playerId, newScore } = requestData;
            if (!playerId || !newScore) {
                throw new Error(buildHandlerErrorMessage(globalConstants_1.MESSAGE_TYPE.REQUEST_UPDATE_SCORE, data));
            }
            existingScorePad.updatePlayerScore(playerId, newScore);
            return existingScorePad;
        },
    };
    if (handlers[type]) {
        const scorePad = handlers[type]();
        if (!(scorePad instanceof scorePad_1.ScorePad)) {
            throw new Error(`Incorrect return value of message handler function for type ${type}.`);
        }
        response.data.success = true;
        response.data.scorePadData = scorePad.getScorePadData();
        response.scorePadId = scorePad.getScorePadId();
        scorePad.sendBroadcastMessage(response);
        return;
    }
    throw new Error(`No handler found for type ${type}`);
};
exports.websocketMessageHandler = websocketMessageHandler;
