import { Card, Col, Container, Row } from 'react-bootstrap';
import './dice_tab.css';
import Coin from './coin/coin';
import D6 from './d6/d6';

export const DiceTab = () => {
    return (
        <Card className='p-4 m-4'>
            <Container>
                <Row className='p-3'>
                    <Col xs={12} md={6}>
                        <Coin />
                    </Col>
                    <Col xs={12} md={6}>
                        <D6 />
                    </Col>
                </Row>
            </Container>
        </Card>
    );
};

export default DiceTab;
