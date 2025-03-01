import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';

const CALCULATOR_BUTTONS = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    0,
    '.',
    '=',
    '+',
    '-',
    '*',
    '/',
];

const BUTTONS_PER_ROW = 4;
export const CalculatorTab = () => {
    return (
        <Card border='light' className='p-4 m-4 shadow-lg'>
            <Container>
                <Row className='mb-4'>
                    <Form.Control
                        className='bg-light text-end text-dark'
                        type='text'
                    />
                </Row>
                <Row xs={BUTTONS_PER_ROW} className='g-2'>
                    {CALCULATOR_BUTTONS.map((button) => {
                        return (
                            <Col className='mb-1' key={button}>
                                <Button
                                    variant='secondary'
                                    style={{ width: '100%' }}
                                    type='button'
                                >
                                    {button}
                                </Button>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </Card>
    );
};
