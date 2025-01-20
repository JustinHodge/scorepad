export interface IPlayer {
    id: string;
    name: string;
    color: string;
    score: number;
}

export enum IMessageType {
    PLAYERS = 'PLAYERS',
    SCORE = 'SCORE',
    ALL_DATA = 'ALL_DATA',
}

export interface IScorePadMessage {
    type: IMessageType;
    players: IPlayer[];
    scorePadId?: string;
}
