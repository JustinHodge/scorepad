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

const INPUT_REQUEST_DELAY_MS = 500;

const buildScore = (score: string | number | undefined | null | typeof NaN) => {
    if (!score) {
        return 0;
    }

    if (Number.isNaN(score)) {
        return 0;
    }

    return Number.parseInt(score.toString());
};

export const PlayerCard = ({ player }: IProps) => {
    const { requestUpdatePlayerData, requestUpdatePlayerScore } =
        useContext(ScorepadContext);

    const [updatePlayerData, setUpdatePlayerData] =
        useState<IRequestUpdatePlayerData | null>(null);
    const [updatePlayerScore, setUpdatePlayerScore] =
        useState<IRequestUpdateScoreData | null>(null);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (updatePlayerData) {
                requestUpdatePlayerData(updatePlayerData);
                setUpdatePlayerData(null);
            }

            if (updatePlayerScore) {
                requestUpdatePlayerScore(updatePlayerScore);
                setUpdatePlayerScore(null);
            }
        }, INPUT_REQUEST_DELAY_MS);

        return () => clearTimeout(timeoutId);
    });

    return (
        <div key={player.id} className='my-2 card'>
            <div className='card-body'>
                <div className='row'>
                    <input
                        className='form-control col mx-1'
                        type='text'
                        value={updatePlayerData?.newName ?? player.name}
                        onChange={(e) => {
                            if (!player.id) {
                                console.error('no player id');
                                return;
                            }

                            const updateData = {
                                playerId: player.id,
                                newName: e.target.value,
                            };

                            setUpdatePlayerData(updateData);
                        }}
                    ></input>
                    <input
                        className='form-control col mx-1'
                        type='number'
                        value={
                            updatePlayerScore?.newScore ?? player.score ?? '0'
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

                            setUpdatePlayerScore(updateData);
                        }}
                    ></input>
                </div>
            </div>
            <PlayerCardFooter />
        </div>
    );
};

export default PlayerCard;
