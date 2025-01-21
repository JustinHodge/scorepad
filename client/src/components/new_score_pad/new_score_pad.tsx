import JoinExisting from './components/join_existing/join_existing';
import StartNew from './components/start_new/start_new';
import './new_score_pad.css';

export const NewScorepad = () => {
    return (
        <div>
            <StartNew />
            <JoinExisting />
        </div>
    );
};

export default NewScorepad;
