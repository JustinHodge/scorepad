import './App.css';
import { Scorepad } from './components/score_pad/score_pad';
import NewScorepad from './components/new_score_pad/new_score_pad';
import { useContext } from 'react';
import ScorepadContext from './contexts/score_pad';
import AwaitConnection from './components/await _connection/await_connection';

export const App = () => {
    const {
        scorePadData: { scorePadId },
        isConnected,
    } = useContext(ScorepadContext);

    return (
        <>
            {!isConnected ? (
                <AwaitConnection />
            ) : scorePadId ? (
                <Scorepad />
            ) : (
                <NewScorepad />
            )}
        </>
    );
};

export default App;
