import { useContext, useEffect, useState } from 'react';
import ScorepadContext from '../../contexts/score_pad';
import './score_pad.css';
import {
    IRequestUpdatePlayerData,
    IRequestUpdateScoreData,
} from '../../../../types';

const INPUT_REQUEST_DELAY_MS = 500;

export const Scorepad = () => {
    const {
        scorePadData: { players, scorePadId },
        addPlayer,
        requestLeaveExisting,
        requestUpdatePlayerData,
        requestUpdatePlayerScore,
    } = useContext(ScorepadContext);
    const [newPlayerScore, setNewPlayerScore] = useState<number>(0);
    const [updatePlayerData, setUpdatePlayerData] = useState<{
        [playerId: string]: IRequestUpdatePlayerData;
    }>({});
    const [updatePlayerScore, setUpdatePlayerScore] = useState<{
        [playerId: string]: IRequestUpdateScoreData;
    }>({});
    // TODO add focus lock for rerenders after input

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (Object.keys(updatePlayerData).length > 0) {
                Object.values(updatePlayerData).forEach((data) => {
                    requestUpdatePlayerData(data);
                });
            }

            if (Object.keys(updatePlayerScore).length > 0) {
                Object.values(updatePlayerScore).forEach((data) => {
                    requestUpdatePlayerScore(data);
                });
            }
        }, INPUT_REQUEST_DELAY_MS);

        return () => clearTimeout(timeoutId);
    });

    return (
        <div>
            <h1>ScorePad: {scorePadId}</h1>
            <div className='score-pad'>
                {Object.values(players).map((player) => (
                    <div key={player.id} className='player'>
                        <input
                            type='text'
                            value={
                                updatePlayerData[player.id ?? '']?.newName ??
                                player.name
                            }
                            onChange={(e) => {
                                if (!player.id) {
                                    console.error('no player id');
                                    return;
                                }

                                const updateData = {
                                    playerId: player.id,
                                    newName: e.target.value,
                                };

                                setUpdatePlayerData({
                                    ...updatePlayerData,
                                    [player.id]: updateData,
                                });
                            }}
                        ></input>
                        <input
                            type='number'
                            value={
                                updatePlayerScore[player.id ?? '']?.newScore ??
                                player.score
                            }
                            onChange={(e) => {
                                if (!player.id) {
                                    console.error('no player id');
                                    return;
                                }

                                const updateData = {
                                    playerId: player.id,
                                    newScore: Number.parseInt(e.target.value),
                                };

                                setUpdatePlayerScore({
                                    ...updatePlayerScore,
                                    [player.id]: updateData,
                                });
                            }}
                        ></input>
                    </div>
                ))}
            </div>
            <div>
                <label>NewPlayerScore</label>
                <input
                    type='number'
                    value={newPlayerScore}
                    onChange={(e) =>
                        setNewPlayerScore(Number.parseInt(e.target.value))
                    }
                ></input>
                <button
                    type='button'
                    onClick={() => {
                        addPlayer(newPlayerScore);
                    }}
                >
                    Add Player
                </button>
                <button
                    type='button'
                    onClick={() => {
                        requestLeaveExisting();
                    }}
                >
                    Leave Score Pad
                </button>
            </div>
        </div>
    );
};
