import { useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { IEquation } from '../../../../../../../../../../types';
import {
    BLANK_EQUATION,
    MAX_DIGIT_DISPLAY,
    BUTTONS_PER_ROW,
    CALCULATOR_BUTTONS,
} from './constants';

export const CalculatorTab = () => {
    const [currentEquation, setCurrentEquation] =
        useState<IEquation>(BLANK_EQUATION);

    const renderFriendlyNumber = (numberString: string): string => {
        if (numberString === '') {
            return '';
        }
        const parsedNumber = Number(numberString);
        const parsedNumberString = parsedNumber.toString();

        if (parsedNumberString.length > MAX_DIGIT_DISPLAY) {
            const [wholeNumberPart, decimalNumberPart] =
                parsedNumberString.split('.');

            if (wholeNumberPart.length > MAX_DIGIT_DISPLAY) {
                const firstDigit = wholeNumberPart.slice(0, 1);
                const exponent = (wholeNumberPart.length - 1).toString();
                const decimalDigits = wholeNumberPart.slice(
                    1,
                    MAX_DIGIT_DISPLAY - exponent.length - 2
                );

                return `${firstDigit}.${decimalDigits}e${exponent}`;
            }

            if (parsedNumberString.length > MAX_DIGIT_DISPLAY) {
                return `${wholeNumberPart}.${decimalNumberPart.slice(
                    0,
                    MAX_DIGIT_DISPLAY - 4 - wholeNumberPart.length
                )}...`;
            }
        } else {
            return parsedNumberString;
        }

        return 'Error';
    };

    return (
        <Card border='light' className='p-4 m-4 shadow-lg'>
            <Container>
                <Row className='mb-4'>
                    <Form.Control
                        disabled
                        value={renderFriendlyNumber(
                            currentEquation.right !== null
                                ? currentEquation.right
                                : currentEquation.left
                        )}
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
