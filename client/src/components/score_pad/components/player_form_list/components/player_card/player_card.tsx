import { useContext, useState, useEffect } from 'react';
import {
    IPlayer,
    IRequestUpdatePlayerData,
    IRequestUpdateScoreData,
} from '../../../../../../../../types';
import ScorepadContext from '../../../../../../contexts/score_pad';
import { PlayerCardFooter } from './components/player_card_footer/player_card_footer';

interface IProps {
    player: IPlayer;
}

const INPUT_REQUEST_DELAY_MS = 1000;

export const PlayerCard = ({ player }: IProps) => {
    const { requestUpdatePlayerData, requestUpdatePlayerScore } =
        useContext(ScorepadContext);

    const [updatePlayerData, setUpdatePlayerData] =
        useState<IRequestUpdatePlayerData | null>(null);
    const [updatePlayerScore, setUpdatePlayerScore] =
        useState<IRequestUpdateScoreData | null>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (updatePlayerData !== null && updatePlayerData !== undefined) {
                requestUpdatePlayerData(updatePlayerData);
                setUpdatePlayerData(null);
            }

            if (updatePlayerScore !== null && updatePlayerScore !== undefined) {
                requestUpdatePlayerScore(updatePlayerScore);
                setUpdatePlayerScore(null);
            }
        }, INPUT_REQUEST_DELAY_MS);

        return () => clearTimeout(timeoutId);
    });

    if (!player || !player.id) {
        return null;
    }

    return (
        <div key={player.id} className='my-2 card'>
            <div className='card-body'>
                <div className='row'>
                    <input
                        className='form-control col mx-1'
                        type='text'
                        value={player.name}
                        onChange={(e) => {
                            requestUpdatePlayerData({
                                playerId: player.id ?? '',
                                newName: e.target.value,
                            });
                        }}
                    ></input>
                    <input
                        className='form-control col mx-1'
                        type='number'
                        value={player.score ?? ''}
                        onChange={(e) => {
                            requestUpdatePlayerScore({
                                playerId: player.id ?? '',
                                newScore: Number.parseInt(e.target.value),
                            });
                        }}
                    ></input>
                </div>
            </div>
            <PlayerCardFooter
                scoreUpdateFunction={(newScore) => {
                    requestUpdatePlayerScore({
                        playerId: player.id ?? '',
                        newScore:
                            typeof newScore === 'string'
                                ? Number.parseInt(newScore)
                                : newScore,
                    });
                }}
                playerId={player.id}
                currentScore={updatePlayerScore?.newScore ?? player.score ?? 0}
            />
        </div>
    );
};

export default PlayerCard;
