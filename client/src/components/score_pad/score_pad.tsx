import { Container, Row } from 'react-bootstrap';
import PlayerFormList from './components/player_form_list/player_form_list';
import ScorepadNavbar from './components/scorepad_navbar/scorepad_navbar';

export const Scorepad = () => {
    return (
        <>
            <ScorepadNavbar />
            <Container>
                <Row>
                    <PlayerFormList />
                </Row>
            </Container>
        </>
    );
};
