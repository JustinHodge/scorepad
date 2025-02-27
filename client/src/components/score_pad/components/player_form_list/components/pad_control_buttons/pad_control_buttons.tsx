import { useContext } from 'react';
import ScorepadContext from '../../../../../../contexts/score_pad';

export const PadControlButtons = () => {
    const { requestAddPlayer, requestLeaveExisting } =
        useContext(ScorepadContext);
    return (
        <>
            <div className='row my-1'>
                <button
                    className='btn btn-primary input-group-text'
                    type='button'
                    onClick={() => {
                        requestAddPlayer(0);
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
        </>
    );
};

export default PadControlButtons;
