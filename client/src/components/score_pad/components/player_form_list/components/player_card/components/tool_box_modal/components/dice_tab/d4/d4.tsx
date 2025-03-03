import { useState } from 'react';
import './d4.css';

export const D4 = () => {
    const [isRolling, setIsRolling] = useState(false);
    const rollDice = (e: React.MouseEvent) => {
        e.preventDefault();
        return;
    };
    return (
        <div
            className={`d-flex justify-content-center align-items-center ${
                isRolling ? 'pulse' : ''
            } d4-container`}
        >
            <div className='d4' onClick={rollDice}>
                <div className='d4-face face-1'>
                    <u>1</u>
                </div>
                <div className='d4-face face-2'>
                    <u className='mirror'>2</u>
                </div>
                <div className='d4-face face-3'>
                    <u className='mirror'>3</u>
                </div>
                <div className='d4-face face-4'>
                    <u>4</u>
                </div>
            </div>
        </div>
    );
};

export default D4;
