import { useContext, useLayoutEffect, useState } from 'react';
import ScorepadContext from '../../contexts/score_pad';

const RECONNECT_DELAY_MS = 5000;
const NUM_WAITING_DOTS = 3;

export const AwaitConnection = () => {
    const { attemptReconnect } = useContext(ScorepadContext);
    const [numberOfAttempts, setNumberOfAttempts] = useState<number>(0);
    const [intervalCounter, setIntervalCounter] = useState<number>(0);

    useLayoutEffect(() => {
        const interval = setInterval(() => {
            setIntervalCounter((c) => c + 1);
            if (!(intervalCounter % 4)) {
                console.log(`Connection Attempt: ${numberOfAttempts}`);
                attemptReconnect();
                setNumberOfAttempts((c) => c + 1);
            }
        }, RECONNECT_DELAY_MS / (NUM_WAITING_DOTS + 1));
        return () => clearInterval(interval);
    });

    const buildWaitingMessage = () => {
        let message = 'Waiting for connection';
        for (let i = 0; i < intervalCounter % (NUM_WAITING_DOTS + 1); i++) {
            message += '.';
        }

        return message;
    };

    return (
        <div>
            <span>{buildWaitingMessage()}</span>
        </div>
    );
};

export default AwaitConnection;
