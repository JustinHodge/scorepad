"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.websocketMessageHandler = void 0;
const globalConstants_1 = require("../globalConstants");
const websocketMessageHandler = (data, scorePads, sourceWebSocket) => {
    const { type } = data;
    if (type === globalConstants_1.MESSAGE_TYPE.SYSTEM_MESSAGE) {
        let response = {
            type: globalConstants_1.MESSAGE_TYPE.SYSTEM_MESSAGE,
            data: {
                message: '',
            },
        };
        if (data.data.message === 'ping') {
            response.data.message = 'pong';
        }
        sourceWebSocket.send(JSON.stringify(response));
        return;
    }
    const { data: requestData, scorePadId } = data;
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
    const handlers = {
        [globalConstants_1.MESSAGE_TYPE.REQUEST_JOIN_EXISTING]: () => {
            existingScorePad === null || existingScorePad === void 0 ? void 0 : existingScorePad.joinGame(sourceWebSocket);
            return existingScorePad;
        },
        [globalConstants_1.MESSAGE_TYPE.REQUEST_LEAVE_EXISTING]: () => {
            existingScorePad === null || existingScorePad === void 0 ? void 0 : existingScorePad.leaveGame(sourceWebSocket);
            return existingScorePad;
        },
        [globalConstants_1.MESSAGE_TYPE.REQUEST_NEW_PAD]: () => {
            const { numberOfPlayers, startScore } = requestData;
            const newScorePad = scorePads.createNewScorePad(numberOfPlayers || 0, startScore || 0, sourceWebSocket);
            return newScorePad;
        },
        [globalConstants_1.MESSAGE_TYPE.REQUEST_ADD_PLAYER]: () => {
            const { startScore } = requestData;
            if (startScore !== undefined) {
                existingScorePad === null || existingScorePad === void 0 ? void 0 : existingScorePad.addPlayer(startScore);
            }
            return existingScorePad;
        },
        [globalConstants_1.MESSAGE_TYPE.REQUEST_UPDATE_PLAYER]: () => {
            const { playerId, newName, newColor } = requestData;
            if (playerId) {
                existingScorePad === null || existingScorePad === void 0 ? void 0 : existingScorePad.updatePlayer({ playerId, newName, newColor });
            }
            return existingScorePad;
        },
        [globalConstants_1.MESSAGE_TYPE.REQUEST_UPDATE_SCORE]: () => {
            const { playerId, newScore } = requestData;
            if (playerId) {
                existingScorePad === null || existingScorePad === void 0 ? void 0 : existingScorePad.updatePlayerScore(playerId, newScore);
            }
            else {
                console.error('No playerId or newScore provided to update score');
            }
            return existingScorePad;
        },
        [globalConstants_1.MESSAGE_TYPE.REQUEST_REMOVE_PLAYER]: () => {
            const { playerId } = requestData;
            if (playerId) {
                existingScorePad === null || existingScorePad === void 0 ? void 0 : existingScorePad.removePlayer(playerId);
            }
            return existingScorePad;
        },
    };
    if (handlers[type]) {
        const scorePad = handlers[type]();
        if (!scorePad) {
            const response = {
                type: globalConstants_1.MESSAGE_TYPE.RESPONSE_MESSAGE,
                scorePadId: '',
                data: {
                    success: true,
                    request: {
                        type: data.type,
                    },
                    scorePadData: { players: {}, scorePadId: '' },
                },
            };
            sourceWebSocket.send(JSON.stringify(response));
            return;
        }
        response.data.success = true;
        response.data.scorePadData = scorePad.getScorePadData();
        response.scorePadId = scorePad.getScorePadId();
        scorePad.sendBroadcastMessage(response);
        return;
    }
    console.error(`No handler found for type ${type}`);
};
exports.websocketMessageHandler = websocketMessageHandler;
