import { useContext } from 'react';
import ScorepadContext from '../../../../contexts/score_pad';

import PlayerCard from './components/player_card/player_card';
import { Row } from 'react-bootstrap';

export const PlayerFormList = () => {
    const {
        scorePadData: { players },
    } = useContext(ScorepadContext);

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <Row className='justify-content-center'>
                {Object.values(players).map((player) => (
                    <PlayerCard key={player.id} player={player} />
                ))}
            </Row>
        </form>
    );
};

export default PlayerFormList;
