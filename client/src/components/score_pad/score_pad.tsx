import { useContext, useState } from 'react';
import ScorepadContext from '../../contexts/score_pad';
import './score_pad.css';

export const Scorepad = () => {
    const { scorePadId, players, addPlayer } = useContext(ScorepadContext);
    const [newPlayerScore, setNewPlayerScore] = useState<number>(0);
    return (
        <div>
            <h1>ScorePad: {scorePadId}</h1>
            <div className='score-pad'>
                {players.map((player) => (
                    <div key={player.name} className='player'>
                        <p>{player.name}</p>
                        <p>{player.score}</p>
                    </div>
                ))}
            </div>
            <div>
                <label>NewPlayerScore</label>
                <input
                    type='number'
                    value={newPlayerScore}
                    onChange={(e) =>
                        setNewPlayerScore(Number.parseInt(e.target.value))
                    }
                ></input>
                <button
                    type='button'
                    onClick={() => {
                        addPlayer(newPlayerScore);
                    }}
                >
                    Add Player
                </button>
            </div>
        </div>
    );
};
