import { useContext } from 'react';
import ScorepadContext from '../../../../contexts/score_pad';

import PadControlButtons from './components/pad_control_buttons/pad_control_buttons';
import PlayerCard from './components/player_card/player_card';

export const PlayerFormList = () => {
    const {
        scorePadData: { players },
    } = useContext(ScorepadContext);

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            {Object.values(players).map((player) => (
                <PlayerCard player={player} />
            ))}
            <PadControlButtons />
        </form>
    );
};
