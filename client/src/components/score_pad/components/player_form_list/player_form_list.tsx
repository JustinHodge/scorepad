import { useContext } from 'react';
import ScorepadContext from '../../../../contexts/score_pad';

import PlayerCard from './components/player_card/player_card';

export const PlayerFormList = () => {
    const {
        scorePadData: { players },
    } = useContext(ScorepadContext);

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            {Object.values(players).map((player) => (
                <PlayerCard key={player.id} player={player} />
            ))}
        </form>
    );
};

export default PlayerFormList;
