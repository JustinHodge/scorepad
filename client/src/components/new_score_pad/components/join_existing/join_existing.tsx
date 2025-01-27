import { useContext, useState } from 'react';
import './join_existing.css';
import ScorepadContext from '../../../../contexts/score_pad';

export const JoinExisting = () => {
    const { requestJoinExisting } = useContext(ScorepadContext);
    const [scorePadIdToJoin, setScorePadIdToJoin] = useState<string>('');
    return (
        <div>
            <label>Score Pad ID</label>
            <input
                type='string'
                onChange={(e) => setScorePadIdToJoin(e.target.value)}
            ></input>
            <button
                type='button'
                onClick={() => {
                    requestJoinExisting(scorePadIdToJoin);
                }}
            >
                Join Open Score Pad
            </button>
        </div>
    );
};

export default JoinExisting;
