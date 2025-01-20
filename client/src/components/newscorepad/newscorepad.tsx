import JoinExisting from './components/joinexisting/joinexisting';
import StartNew from './components/startnew/startnew';
import './newscorepad.css';

export const NewScorepad = () => {
    return (
        <div>
            <StartNew />
            <JoinExisting />
        </div>
    );
};

export default NewScorepad;
