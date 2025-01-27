import './App.css';
import { Scorepad } from './components/score_pad/score_pad';
import NewScorepad from './components/new_score_pad/new_score_pad';
import { useContext } from 'react';
import ScorepadContext from './contexts/score_pad';

export const App = () => {
    const {
        scorePadData: { scorePadId },
    } = useContext(ScorepadContext);
    return <>{scorePadId ? <Scorepad /> : <NewScorepad />}</>;
};

export default App;
