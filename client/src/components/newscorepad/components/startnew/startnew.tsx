import { useContext, useState } from 'react';
import './startnew.css';
import ScorepadContext from '../../../../contexts/scorepad';

const DEFAULT_NUM_PLAYERS = 1;
export const StartNew = () => {
    const scorePad = useContext(ScorepadContext);

    const [numberOfPlayers, setNumberOfPlayers] =
        useState<number>(DEFAULT_NUM_PLAYERS);
    return (
        <div>
            <label>Number of Players</label>
            <input
                type='number'
                value={`${numberOfPlayers}`}
                onChange={(e) => {
                    const newValue = Number.parseInt(e.target.value);

                    newValue
                        ? setNumberOfPlayers(newValue)
                        : () => {
                              console.log(
                                  'invalid number of players set. resetting to default'
                              );

                              setNumberOfPlayers(DEFAULT_NUM_PLAYERS);
                          };
                }}
            ></input>
            <button
                type='button'
                onClick={() => {
                    scorePad.startNewScorePad(numberOfPlayers);
                }}
            >
                Start New Score Pad
            </button>
        </div>
    );
};
export default StartNew;
