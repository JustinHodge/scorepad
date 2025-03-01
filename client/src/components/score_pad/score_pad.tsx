import { Container } from 'react-bootstrap';
import PlayerFormList from './components/player_form_list/player_form_list';
import ScorepadHeading from './components/scorepad_heading/scorepad_heading';

export const Scorepad = () => {
    return (
        <Container>
            <ScorepadHeading />
            <div className='container'>
                <div className='row'>
                    <PlayerFormList />
                </div>
            </div>
        </Container>
    );
};
