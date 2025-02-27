import { MESSAGE_TYPE } from './globalConstants';

export interface IPlayer {
    id: string | null;
    name: string;
    color: string;
    score: number;
}

export interface IPlayers {
    [key: string]: IPlayer;
}

export interface IScorePadData {
    players: IPlayers;
    scorePadId: string;
}

interface IMessage {
    type: keyof typeof MESSAGE_TYPE;
    scorePadId: string;
}

export interface ISystemMessageData {
    message: string;
}

export interface ISystemMessage {
    type: typeof MESSAGE_TYPE.SYSTEM_MESSAGE;
    data: ISystemMessageData;
}

export interface IRequestNewPadData {
    numberOfPlayers: number;
    startScore: number;
}

export interface IRequestNewPadMessage extends IMessage {
    type: typeof MESSAGE_TYPE.REQUEST_NEW_PAD;
    data: IRequestNewPadData;
}

export interface IRequestAddPlayerData {
    startScore: number;
}

export interface IRequestAddPlayerMessage extends IMessage {
    type: typeof MESSAGE_TYPE.REQUEST_ADD_PLAYER;
    data: IRequestAddPlayerData;
}

export interface IRequestUpdatePlayerData {
    playerId: string;
    newName?: string;
    newColor?: string;
}

export interface IRequestUpdatePlayerMessage extends IMessage {
    type: typeof MESSAGE_TYPE.REQUEST_UPDATE_PLAYER;
    data: IRequestUpdatePlayerData;
}

export interface IRequestUpdateScoreData {
    playerId: string;
    newScore: number;
}

export interface IRequestUpdateScoreMessage extends IMessage {
    type: typeof MESSAGE_TYPE.REQUEST_UPDATE_SCORE;
    data: IRequestUpdateScoreData;
}

export interface IRequestJoinExistingData {}

export interface IRequestJoinExistingMessage extends IMessage {
    type: typeof MESSAGE_TYPE.REQUEST_JOIN_EXISTING;
    data: IRequestJoinExistingData;
}

export interface IRequestLeaveExistingData {}

export interface IRequestLeaveExistingMessage extends IMessage {
    type: typeof MESSAGE_TYPE.REQUEST_LEAVE_EXISTING;
    data: IRequestLeaveExistingData;
}

export interface IRequestRemovePlayerData {
    playerId: string;
}

export interface IRequestRemovePlayerMessage extends IMessage {
    type: typeof MESSAGE_TYPE.REQUEST_REMOVE_PLAYER;
    data: IRequestRemovePlayerData;
}

export interface IResponseData {
    success: boolean;
    message?: string;
    request: {
        type: keyof typeof MESSAGE_TYPE;
    };
    scorePadData: IScorePadData;
}
export interface IResponseMessage extends IMessage {
    type: typeof MESSAGE_TYPE.RESPONSE_MESSAGE;
    data: IResponseData;
}

export type IRequestMessage =
    | IRequestAddPlayerMessage
    | IRequestUpdateScoreMessage
    | IRequestNewPadMessage
    | IRequestUpdatePlayerMessage
    | IRequestJoinExistingMessage;
