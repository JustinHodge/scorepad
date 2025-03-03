import { Card, Col, Container, Row } from 'react-bootstrap';
import './dice_tab.css';
import Coin from './coin/coin';
import D6 from './d6/d6';
import D4 from './d4/d4';

export const DiceTab = () => {
    return (
        <Card>
            <Container>
                <Row>
                    <Col xs={6}>
                        <Coin />
                    </Col>
                    <Col xs={6}>
                        <D6 />
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <D4 />
                    </Col>
                    <Col xs={6}></Col>
                </Row>
            </Container>
        </Card>
    );
};

export default DiceTab;
