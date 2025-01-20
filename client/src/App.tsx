import { useContext } from 'react';
import './App.css';
import ScorepadContext from './contexts/scorepad';
import { Scorepad } from './components/scorepad/scorepad';
import NewScorepad from './components/newscorepad/newscorepad';

export const App = () => {
    const scorepadData = useContext(ScorepadContext);

    const scorepadId = scorepadData.getScorepadId();
    return <>{scorepadId ? <Scorepad /> : <NewScorepad />}</>;
};

export default App;
