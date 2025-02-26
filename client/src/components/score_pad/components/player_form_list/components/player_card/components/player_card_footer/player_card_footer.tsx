import { useContext } from 'react';
import ScorepadContext from '../../../../../../../../contexts/score_pad';

interface IProps {
    playerId?: string;
}

export const PlayerCardFooter = ({ playerId }: IProps) => {
    const { requestRemovePlayer } = useContext(ScorepadContext);
    return (
        <div className='card-footer'>
            <div className='btn-group'>
                {}
                <button onClick={() => {}} className='btn btn-primary'>
                    +1
                </button>
                <button className='btn btn-primary'>+10</button>
                <button className='btn btn-primary'>-1</button>
                <button className='btn btn-primary'>-10</button>
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
