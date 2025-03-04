import { Card, Col, Container, Row } from 'react-bootstrap';
import './dice_tab.css';
import Coin from './coin/coin';
import D6 from './d6/d6';

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
            </Container>
        </Card>
    );
};

export default DiceTab;
