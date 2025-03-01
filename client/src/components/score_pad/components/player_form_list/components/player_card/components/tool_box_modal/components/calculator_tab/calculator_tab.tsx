import { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

const MULTIPLICATION_SIGN = '\u00d7';
const DIVISION_SIGN = '\u00f7';
const PLUS_MINUS_SIGN = '\u00b1';
const RESET_SYMBOL = '\u21bb';
const DELETE_SYMBOL = '\u232b';
const PLUS_SIGN = '+';
const MINUS_SIGN = '-';
const EQUALS_SIGN = '=';

type IOperationFunction = (left: number, right: number) => number;

interface IEquation {
    operator: {
        label: string;
        operationFunction: IOperationFunction;
    } | null;
    left: number;
    right: number | null;
}

interface IEquationTransformer {
    (arg0: IEquation): IEquation;
}

interface ICalculatorButton {
    label: string;
    equationTransformer: IEquationTransformer;
}

const BLANK_EQUATION: IEquation = {
    left: 0,
    operator: null,
    right: null,
};

const buildNumberButtonTransformer = (value: number): IEquationTransformer => {
    return ({ left, operator, right }) => {
        const newEquation = {
            left: left,
            operator: operator,
            right: right,
        };

        if (right !== null) {
            newEquation.right = right * 10 + value;
        } else {
            newEquation.left = left * 10 + value;
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

        newEquation.right = 0;

        return newEquation;
    };

const solveEquation = ({ right, left, operator }: IEquation): IEquation => {
    if (right === null || operator === null) {
        return { left: left, operator: operator, right: right };
    }

    return {
        left: operator.operationFunction(left, right),
        operator: null,
        right: null,
    };
};

const CALCULATOR_BUTTONS: ICalculatorButton[] = [
    {
        label: RESET_SYMBOL,
        equationTransformer: () => {
            return BLANK_EQUATION;
        },
    },
    {
        label: 'C',
        equationTransformer: ({ left }) => {
            const newEquation = { left: left, operator: null, right: null };
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

            const deleteLastDigit = (number: number) => Math.floor(number / 10);

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

            const invertNumber = (number: number) => number * -1;

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
        equationTransformer: buildNumberButtonTransformer(1),
    },
    {
        label: '2',
        equationTransformer: buildNumberButtonTransformer(2),
    },
    {
        label: '3',
        equationTransformer: buildNumberButtonTransformer(3),
    },
    {
        label: PLUS_SIGN,
        equationTransformer: buildOperatorButtonTransformer(
            (left, right) => left + right,
            PLUS_SIGN
        ),
    },
    {
        label: '4',
        equationTransformer: buildNumberButtonTransformer(4),
    },
    {
        label: '5',
        equationTransformer: buildNumberButtonTransformer(5),
    },
    {
        label: '6',
        equationTransformer: buildNumberButtonTransformer(6),
    },
    {
        label: MINUS_SIGN,
        equationTransformer: buildOperatorButtonTransformer(
            (left, right) => left - right,
            MINUS_SIGN
        ),
    },
    {
        label: '7',
        equationTransformer: buildNumberButtonTransformer(7),
    },
    {
        label: '8',
        equationTransformer: buildNumberButtonTransformer(8),
    },
    {
        label: '9',
        equationTransformer: buildNumberButtonTransformer(9),
    },
    {
        label: MULTIPLICATION_SIGN,
        equationTransformer: buildOperatorButtonTransformer(
            (left, right) => left * right,
            MULTIPLICATION_SIGN
        ),
    },
    {
        label: '.',
        equationTransformer: (currentEquation) => {
            const newEquation = { left: 0, operator: null, right: null };
            return newEquation;
        },
    },
    {
        label: '0',
        equationTransformer: buildNumberButtonTransformer(0),
    },
    {
        label: EQUALS_SIGN,
        equationTransformer: solveEquation,
    },
    {
        label: DIVISION_SIGN,
        equationTransformer: buildOperatorButtonTransformer(
            (left, right) => left / right,
            DIVISION_SIGN
        ),
    },
];

const BUTTONS_PER_ROW = 4;

export const CalculatorTab = () => {
    const [currentEquation, setCurrentEquation] =
        useState<IEquation>(BLANK_EQUATION);

    return (
        <Card border='light' className='p-4 m-4 shadow-lg'>
            <Container>
                <Row className='mb-4'>
                    <Form.Control
                        disabled
                        value={
                            currentEquation.right !== null
                                ? currentEquation.right
                                : currentEquation.left
                        }
                        className='bg-light text-end text-dark'
                        type='text'
                    />
                </Row>
                <Row xs={BUTTONS_PER_ROW} className='g-2'>
                    {CALCULATOR_BUTTONS.map(
                        ({ label, equationTransformer }) => {
                            return (
                                <Col className='mb-1' key={label}>
                                    <Button
                                        variant='secondary'
                                        style={{ width: '100%' }}
                                        type='button'
                                        onClick={() => {
                                            const newEquation =
                                                equationTransformer(
                                                    currentEquation
                                                );
                                            setCurrentEquation(newEquation);
                                        }}
                                    >
                                        {label}
                                    </Button>
                                </Col>
                            );
                        }
                    )}
                </Row>
            </Container>
        </Card>
    );
};
