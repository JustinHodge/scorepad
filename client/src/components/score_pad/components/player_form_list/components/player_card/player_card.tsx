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

const INPUT_REQUEST_DELAY_MS = 300;

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

    const queueUpdateScore = (score: string | number) => {
        const newScore = buildScore(score);

        if (!player.id) {
            console.error('no player id');
            return;
        }

        setUpdatePlayerScore({
            playerId: player.id,
            newScore: newScore,
        });
    };

    const queueUpdateName = (name: string) => {
        if (!player.id) {
            console.error('no player id');
            return;
        }

        setUpdatePlayerData({
            playerId: player.id,
            newName: name,
        });
    };

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
                        value={updatePlayerData?.newName ?? player.name}
                        onChange={(e) => {
                            queueUpdateName(e.target.value);
                        }}
                    ></input>
                    <input
                        className='form-control col mx-1'
                        type='number'
                        value={
                            updatePlayerScore?.newScore ?? player.score ?? '0'
                        }
                        onChange={(e) => {
                            queueUpdateScore(e.target.value);
                        }}
                    ></input>
                </div>
            </div>
            <PlayerCardFooter
                scoreUpdateFunction={queueUpdateScore}
                playerId={player.id}
                currentScore={updatePlayerScore?.newScore ?? player.score ?? 0}
            />
        </div>
    );
};

export default PlayerCard;
