export interface IGame {
    players: Player[];
    deck: Deck;
}

export interface IEquation {
    operator: {
        label: string;
        operationFunction: IOperationFunction;
    } | null;
    left: string;
    right: string | null;
}

export type IOperationFunction = (left: string, right: string) => string;

export interface IEquationTransformer {
    (arg0: IEquation): IEquation;
}

export interface ICalculatorButton {
    label: string;
    equationTransformer: IEquationTransformer;
}
