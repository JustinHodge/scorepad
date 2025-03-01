import { useContext, useState } from 'react';
import ScorepadContext from '../../../../contexts/score_pad';

export const JoinExisting = () => {
    const { requestJoinExisting } = useContext(ScorepadContext);
    const [scorePadIdToJoin, setScorePadIdToJoin] = useState<string>('');
    return (
        <div className='row'>
            <form>
                <div className='pt-2'>
                    <label className='form-label'>Score Pad ID</label>
                    <input
                        className='form-control'
                        type='string'
                        onChange={(e) => setScorePadIdToJoin(e.target.value)}
                    ></input>
                </div>
                <div className='float-end pt-2'>
                    <button
                        className='btn btn-primary'
                        type='button'
                        onClick={() => {
                            requestJoinExisting(scorePadIdToJoin);
                        }}
                    >
                        Join Open Score Pad
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JoinExisting;
