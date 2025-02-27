import { ChangeEventHandler, useContext, useState } from 'react';
import './start_new.css';
import ScorepadContext from '../../../../contexts/score_pad';

const DEFAULT_NUM_PLAYERS = 1;
export const StartNew = () => {
    const { requestStartNewScorePad } = useContext(ScorepadContext);
    const [numberOfPlayers, setNumberOfPlayers] =
        useState<number>(DEFAULT_NUM_PLAYERS);
    const [startingScore, setStartingScore] = useState<number>(0);

    const playerNumberChangeHandler: ChangeEventHandler<HTMLInputElement> = (
        e
    ) => {
        setNumberOfPlayers(Number.parseInt(e.target.value));
        // const newValue = Number.parseInt(e.target.value);

        // newValue
        //     ? setNumberOfPlayers(newValue)
        //     : () => {
        //           console.log(
        //               'invalid number of players set. resetting to default'
        //           );

        //           setNumberOfPlayers(DEFAULT_NUM_PLAYERS);
        //       };
    };

    const startingScoreChangeHandler: ChangeEventHandler<HTMLInputElement> = (
        e
    ) => {
        setStartingScore(Number.parseInt(e.target.value));
    };

    return (
        <div className='row'>
            <form className='col-12'>
                <div className='pt-2'>
                    <label className='form-label'>Number of Players</label>
                    <input
                        type='number'
                        className='form-control'
                        value={`${numberOfPlayers}`}
                        onChange={playerNumberChangeHandler}
                    ></input>
                </div>
                <div className='pt-2'>
                    <label className='form-label'>Starting Score</label>
                    <input
                        type='number'
                        className='form-control'
                        value={`${startingScore}`}
                        onChange={startingScoreChangeHandler}
                    ></input>
                </div>
                <div className='float-end pt-2'>
                    <button
                        className='btn btn-primary'
                        type='button'
                        onClick={() => {
                            requestStartNewScorePad(
                                numberOfPlayers,
                                startingScore
                            );
                        }}
                    >
                        Start New Score Pad
                    </button>
                </div>
            </form>
        </div>
    );
};
export default StartNew;
