import { useContext, useEffect } from 'react';
import ScorepadContext from '../../contexts/score_pad';
import JoinExisting from './components/join_existing/join_existing';
import StartNew from './components/start_new/start_new';
import './new_score_pad.css';

export const NewScorepad = () => {
    const { requestJoinExisting } = useContext(ScorepadContext);

    useEffect(() => {
        const queryParams = new URL(document.location.toString()).searchParams;
        const scorePadId = queryParams.get('pad_id');
        if (scorePadId) {
            console.log('Joining Score Pad: ', scorePadId);
            requestJoinExisting(scorePadId);
        }
    }, [requestJoinExisting]);

    return (
        <div>
            <StartNew />
            <JoinExisting />
        </div>
    );
};

export default NewScorepad;
