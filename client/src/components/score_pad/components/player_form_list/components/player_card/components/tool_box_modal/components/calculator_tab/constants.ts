import {
    ICalculatorButton,
    IEquation,
    IEquationTransformer,
    IOperationFunction,
} from '../../../../../../../../../../types';

export const MULTIPLICATION_SIGN = '\u00d7';
export const DIVISION_SIGN = '\u00f7';
export const PLUS_MINUS_SIGN = '\u00b1';
export const RESET_SYMBOL = '\u21bb';
export const DELETE_SYMBOL = '\u232b';
export const PLUS_SIGN = '+';
export const MINUS_SIGN = '-';
export const EQUALS_SIGN = '=';
export const DECIMAL_SEPARATOR = '.';
export const MAX_DIGIT_DISPLAY = 16;
export const BUTTONS_PER_ROW = 4;

export const BLANK_EQUATION: IEquation = {
    left: '',
    operator: null,
    right: null,
} as const;

const buildNumberButtonTransformer = (value: string): IEquationTransformer => {
    return ({ left, operator, right }) => {
        const newEquation = {
            left: left,
            operator: operator,
            right: right,
        };

        if (right !== null) {
            newEquation.right = `${right}${value}`;
        } else {
            newEquation.left = `${left}${value}`;
        }

        return newEquation;
    };
};

const buildOperatorButtonTransformer =
    (
        operationFunction: IOperationFunction,
        label: string
    ): IEquationTransformer =>
    ({ left, operator, right }) => {
        const newEquation = solveEquation({
            left: left,
            operator: operator,
            right: right,
        });

        newEquation.operator = {
            label: label,
            operationFunction: operationFunction,
        };

        newEquation.right = '';

        return newEquation;
    };

export const solveEquation = ({
    right,
    left,
    operator,
}: IEquation): IEquation => {
    if (right === null || operator === null) {
        return { left: left, operator: operator, right: right };
    }

    return {
        left: operator.operationFunction(left, right).toString(),
        operator: null,
        right: null,
    };
};

export const CALCULATOR_BUTTONS: ICalculatorButton[] = [
    {
        label: RESET_SYMBOL,
        equationTransformer: () => {
            return BLANK_EQUATION;
        },
    },
    {
        label: 'C',
        equationTransformer: ({ left, operator }) => {
            const newEquation = { left: left, operator: null, right: null };

            if (!operator) {
                newEquation.left = '';
            }

            return newEquation;
        },
    },
    {
        label: DELETE_SYMBOL,
        equationTransformer: ({ left, operator, right }) => {
            const newEquation: IEquation = {
                left: left,
                operator: operator,
                right: right,
            };

            const deleteLastDigit = (numberString: string) =>
                numberString.slice(0, numberString.length - 1);

            if (right !== null) {
                newEquation.right = deleteLastDigit(right);
            } else {
                newEquation.left = deleteLastDigit(left);
            }

            return newEquation;
        },
    },
    {
        label: PLUS_MINUS_SIGN,
        equationTransformer: ({ left, right, operator }) => {
            const newEquation: IEquation = {
                left: left,
                operator: operator,
                right: right,
            };

            const invertNumber = (numberString: string) =>
                (Number(numberString) * -1).toString();

            if (right !== null) {
                newEquation.right = invertNumber(right);
            } else {
                newEquation.left = invertNumber(left);
            }

            return newEquation;
        },
    },
    {
        label: '1',
        equationTransformer: buildNumberButtonTransformer('1'),
    },
    {
        label: '2',
        equationTransformer: buildNumberButtonTransformer('2'),
    },
    {
        label: '3',
        equationTransformer: buildNumberButtonTransformer('3'),
    },
    {
        label: PLUS_SIGN,
        equationTransformer: buildOperatorButtonTransformer(
            (left, right) => (Number(left) + Number(right)).toString(),
            PLUS_SIGN
        ),
    },
    {
        label: '4',
        equationTransformer: buildNumberButtonTransformer('4'),
    },
    {
        label: '5',
        equationTransformer: buildNumberButtonTransformer('5'),
    },
    {
        label: '6',
        equationTransformer: buildNumberButtonTransformer('6'),
    },
    {
        label: MINUS_SIGN,
        equationTransformer: buildOperatorButtonTransformer(
            (left, right) => (Number(left) - Number(right)).toString(),
            MINUS_SIGN
        ),
    },
    {
        label: '7',
        equationTransformer: buildNumberButtonTransformer('7'),
    },
    {
        label: '8',
        equationTransformer: buildNumberButtonTransformer('8'),
    },
    {
        label: '9',
        equationTransformer: buildNumberButtonTransformer('9'),
    },
    {
        label: MULTIPLICATION_SIGN,
        equationTransformer: buildOperatorButtonTransformer(
            (left, right) => (Number(left) * Number(right)).toString(),
            MULTIPLICATION_SIGN
        ),
    },
    {
        label: DECIMAL_SEPARATOR,
        equationTransformer: buildNumberButtonTransformer(DECIMAL_SEPARATOR),
    },
    {
        label: '0',
        equationTransformer: buildNumberButtonTransformer('0'),
    },
    {
        label: EQUALS_SIGN,
        equationTransformer: solveEquation,
    },
    {
        label: DIVISION_SIGN,
        equationTransformer: buildOperatorButtonTransformer(
            (left, right) => (Number(left) / Number(right)).toString(),
            DIVISION_SIGN
        ),
    },
] as const;
