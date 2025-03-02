import { Card, Col, Container, Row } from 'react-bootstrap';
import './dice_tab.css';
import Coin from './coin/coin';

export const DiceTab = () => {
    return (
        <Card>
            <Container>
                <Row>
                    <Col xs={6}>
                        <Coin />
                    </Col>
                </Row>
            </Container>
        </Card>
    );
};

export default DiceTab;
