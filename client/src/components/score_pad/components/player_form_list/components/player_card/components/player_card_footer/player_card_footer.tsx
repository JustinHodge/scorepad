import { useContext } from 'react';
import ScorepadContext from '../../../../../../../../contexts/score_pad';

interface IProps {
    playerId: string;
    scoreUpdateFunction: (newScore: number | string) => void;
    currentScore: number;
}

export const PlayerCardFooter = ({
    playerId,
    scoreUpdateFunction,
    currentScore,
}: IProps) => {
    const { requestRemovePlayer } = useContext(ScorepadContext);
    const scoreUpdateButtons = [
        {
            label: '+1',
            value: 1,
        },
        {
            label: '+10',
            value: 10,
        },
        {
            label: '-1',
            value: -1,
        },
        {
            label: '-10',
            value: -10,
        },
    ];
    return (
        <div className='card-footer'>
            <div className='btn-group'>
                {scoreUpdateButtons.map((button) => {
                    return (
                        <button
                            key={button.label}
                            onClick={() => {
                                scoreUpdateFunction(
                                    currentScore + button.value
                                );
                            }}
                            className='btn btn-primary'
                        >
                            {button.label}
                        </button>
                    );
                })}
            </div>
            <button
                onClick={() => {
                    requestRemovePlayer(playerId ?? '');
                }}
                className='btn btn-danger float-end'
            >
                X
            </button>
        </div>
    );
};
