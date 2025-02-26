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

    const [updatePlayerData, setUpdatePlayerData] = useState<{
        [playerId: string]: IRequestUpdatePlayerData;
    }>({});
    const [updatePlayerScore, setUpdatePlayerScore] = useState<{
        [playerId: string]: IRequestUpdateScoreData;
    }>({});

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
        <div key={player.id} className='my-2 card'>
            <div className='card-body'>
                <div className='row'>
                    <input
                        className='form-control col mx-1'
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
                        className='form-control col mx-1'
                        type='number'
                        value={
                            updatePlayerScore[player.id ?? '']?.newScore ??
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
            </div>
            <PlayerCardFooter />
        </div>
    );
};

export default PlayerCard;
