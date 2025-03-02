import { Container } from 'react-bootstrap';
import PlayerFormList from './components/player_form_list/player_form_list';
import ScorepadNavbar from './components/scorepad_navbar/scorepad_navbar';

export const Scorepad = () => {
    return (
        <>
            <ScorepadNavbar />
            <Container>
                <div className='container'>
                    <div className='row'>
                        <PlayerFormList />
                    </div>
                </div>
            </Container>
        </>
    );
};
