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
        scorePadData: { players },
        addPlayer,
        requestLeaveExisting,
        requestUpdatePlayerData,
        requestUpdatePlayerScore,
    } = useContext(ScorepadContext);
    const [updatePlayerData, setUpdatePlayerData] = useState<{
        [playerId: string]: IRequestUpdatePlayerData;
    }>({});
    const [updatePlayerScore, setUpdatePlayerScore] = useState<{
        [playerId: string]: IRequestUpdateScoreData;
    }>({});

    const buildScore = (
        score: string | number | undefined | null | typeof NaN
    ) => {
        if (!score) {
            return 0;
        }

        if (Number.isNaN(score)) {
            return 0;
        }

        return Number.parseInt(score.toString());
    };

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
        <div className='container'>
            <div className='row'>
                <h2>
                    <em
                        title='Click to copy shareable url'
                        className='score-pad-heading'
                        onPointerDown={() => {
                            const url = new URL(window.location.href);
                            navigator.clipboard.writeText(url.toString());
                            alert('Copied Url: ' + url.toString());
                        }}
                    >
                        Click to Share this Pad!
                    </em>
                </h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    {Object.values(players).map((player) => (
                        <div key={player.id} className='row my-2'>
                            <input
                                className='form-control col mx-1'
                                type='text'
                                value={
                                    updatePlayerData[player.id ?? '']
                                        ?.newName ?? player.name
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
                                className='form-control col mx-1'
                                type='number'
                                value={
                                    updatePlayerScore[player.id ?? '']
                                        ?.newScore ??
                                    player.score ??
                                    '0'
                                }
                                onChange={(e) => {
                                    if (!player.id) {
                                        console.error('no player id');
                                        return;
                                    }

                                    const newScore = buildScore(e.target.value);

                                    const updateData = {
                                        playerId: player.id,
                                        newScore: newScore,
                                    };

                                    setUpdatePlayerScore({
                                        ...updatePlayerScore,
                                        [player.id]: updateData,
                                    });
                                }}
                            ></input>
                        </div>
                    ))}
                    <div className='row my-1'>
                        <button
                            className='btn btn-primary input-group-text'
                            type='button'
                            onClick={() => {
                                addPlayer(0);
                            }}
                        >
                            Add Player
                        </button>
                    </div>
                    <div className='row my-1'>
                        <button
                            className='btn btn-danger'
                            type='button'
                            onClick={() => {
                                requestLeaveExisting();
                            }}
                        >
                            Leave Score Pad
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
