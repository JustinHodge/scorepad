import { ChangeEventHandler, useContext, useState } from 'react';
import './start_new.css';
import ScorepadContext from '../../../../contexts/score_pad';

const DEFAULT_NUM_PLAYERS = 1;
export const StartNew = () => {
    const { startNewScorePad } = useContext(ScorepadContext);
    const [numberOfPlayers, setNumberOfPlayers] =
        useState<number>(DEFAULT_NUM_PLAYERS);
    const [startingScore, setStartingScore] = useState<number>(0);

    const playerNumberChangeHandler: ChangeEventHandler<HTMLInputElement> = (
        e
    ) => {
        const newValue = Number.parseInt(e.target.value);

        newValue
            ? setNumberOfPlayers(newValue)
            : () => {
                  console.log(
                      'invalid number of players set. resetting to default'
                  );

                  setNumberOfPlayers(DEFAULT_NUM_PLAYERS);
              };
    };

    const startingScoreChangeHandler: ChangeEventHandler<HTMLInputElement> = (
        e
    ) => {
        setStartingScore(Number.parseInt(e.target.value));
    };

    return (
        <div>
            <label>Number of Players</label>
            <input
                type='number'
                value={`${numberOfPlayers}`}
                onChange={playerNumberChangeHandler}
            ></input>
            <label>Starting Score</label>
            <input
                type='number'
                value={`${startingScore}`}
                onChange={startingScoreChangeHandler}
            ></input>
            <button
                type='button'
                onClick={() => {
                    startNewScorePad(numberOfPlayers, startingScore);
                }}
            >
                Start New Score Pad
            </button>
        </div>
    );
};
export default StartNew;
