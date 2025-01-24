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

export enum EnumMessageType {
    NEW_PAD = 'NEW_PAD',
    UPDATE_PAD = 'UPDATE_PAD',
    CONTROL_MESSAGE = 'CONTROL_MESSAGE',
}

export interface IControlMessage {
    type: EnumMessageType.CONTROL_MESSAGE;
    message?: string;
    data?: any;
}

export interface IPlayers {
    [key: string]: IPlayer;
}

export interface IScorePadMessage {
    type: EnumMessageType;
    players: IPlayers;
    scorePadId?: string;
}
