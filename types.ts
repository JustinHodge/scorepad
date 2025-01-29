export interface IPlayer {
    id: string | null;
    name: string;
    color: string;
    score: number;
}

export enum EnumPlayerColors {
    RED = '#FF0000',
    GREEN = '#00FF00',
    BLUE = '#0000FF',
    YELLOW = '#FFFF00',
    PURPLE = '#FF00FF',
    CYAN = '#00FFFF',
    WHITE = '#FFFFFF',
    BLACK = '#000000',
    GRAY = '#8a8a8a',
}

export interface IPlayers {
    [key: string]: IPlayer;
}

export interface IScorePadData {
    players: IPlayers;
    scorePadId: string;
}

export enum EnumMessageType {
    REQUEST_NEW_PAD = 'REQUEST_NEW_PAD',
    REQUEST_ADD_PLAYER = 'REQUEST_ADD_PLAYER',
    REQUEST_UPDATE_PLAYER = 'REQUEST_UPDATE_PLAYER',
    REQUEST_UPDATE_SCORE = 'REQUEST_UPDATE_SCORE',
    REQUEST_JOIN_EXISTING = 'REQUEST_JOIN_EXISTING',
    RESPONSE_MESSAGE = 'RESPONSE_MESSAGE',
    SYSTEM_MESSAGE = 'SYSTEM_MESSAGE',
}

interface IMessage {
    type: EnumMessageType;
    scorePadId: string;
}

export interface ISystemMessageData {
    message: string;
}

export interface ISystemMessage {
    type: EnumMessageType.SYSTEM_MESSAGE;
    data: ISystemMessageData;
}

export interface IRequestNewPadData {
    numberOfPlayers: number;
    startScore: number;
}

export interface IRequestNewPadMessage extends IMessage {
    type: EnumMessageType.REQUEST_NEW_PAD;
    data: IRequestNewPadData;
}

export interface IRequestAddPlayerData {
    startScore: number;
}

export interface IRequestAddPlayerMessage extends IMessage {
    type: EnumMessageType.REQUEST_ADD_PLAYER;
    data: IRequestAddPlayerData;
}

export interface IRequestUpdatePlayerData {
    playerId: string;
    newName?: string;
    newColor?: string;
}

export interface IRequestUpdatePlayerMessage extends IMessage {
    type: EnumMessageType.REQUEST_UPDATE_PLAYER;
    data: IRequestUpdatePlayerData;
}

export interface IRequestUpdateScoreData {
    playerId: string;
    newScore: number;
}

export interface IRequestUpdateScoreMessage extends IMessage {
    type: EnumMessageType.REQUEST_UPDATE_SCORE;
    data: IRequestUpdateScoreData;
}

export interface IRequestJoinExistingData {}

export interface IRequestJoinExistingMessage extends IMessage {
    type: EnumMessageType.REQUEST_JOIN_EXISTING;
    data: IRequestJoinExistingData;
}

export interface IResponseData {
    success: boolean;
    message?: string;
    request: {
        type: EnumMessageType;
    };
    scorePadData: IScorePadData;
}
export interface IResponseMessage extends IMessage {
    type: EnumMessageType.RESPONSE_MESSAGE;
    data: IResponseData;
}

export type IRequestMessage =
    | IRequestAddPlayerMessage
    | IRequestUpdateScoreMessage
    | IRequestNewPadMessage
    | IRequestUpdatePlayerMessage
    | IRequestJoinExistingMessage;
