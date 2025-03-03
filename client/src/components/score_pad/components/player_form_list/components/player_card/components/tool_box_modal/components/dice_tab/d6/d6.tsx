import * as React from 'react';
import './d6.css';

const DICE_ROLL_TIME_MS = 3000;
const NUMBER_OF_ROTATIONS = 10;

export const D6 = () => {
    const [isRolling, setIsRolling] = React.useState(false);

    const rollDice = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsRolling(true);
        const Dice = e.currentTarget as HTMLDivElement;

        const numberOfRotations = NUMBER_OF_ROTATIONS;
        const directions = ['X', 'Y', 'Z'];

        const rotations = Array.from({ length: numberOfRotations }, (_, i) => {
            const degreeOfRotation = (Math.floor(Math.random() * 3) + 1) * 90;
            const directionOfRotation =
                directions[Math.floor(Math.random() * directions.length)];

            const rotation: Keyframe = {
                transform: `rotate${directionOfRotation}(${degreeOfRotation}deg)`,
            };

            if (i === 0) {
                rotation.easing = 'ease-in';
            }

            return rotation;
        });
        Dice.animate(rotations, {
            duration: DICE_ROLL_TIME_MS,
            iterations: 1,
            fill: 'forwards',
        }).onfinish = () => {
            setIsRolling(false);
        };
    };

    return (
        <div
            className={`d-flex justify-content-center align-items-center h-100 ${
                isRolling ? 'pulse' : ''
            }`}
        >
            <div className='d6' onClick={rollDice}>
                <div className='d6-face face-1'>
                    <u>1</u>
                </div>
                <div className='d6-face face-2'>
                    <u>2</u>
                </div>
                <div className='d6-face face-3'>
                    <u>3</u>
                </div>
                <div className='d6-face face-4'>
                    <u>4</u>
                </div>
                <div className='d6-face face-5'>
                    <u>5</u>
                </div>
                <div className='d6-face face-6'>
                    <u>6</u>
                </div>
            </div>
        </div>
    );
};

export default D6;
