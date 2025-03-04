import { useState } from 'react';
import { Image } from 'react-bootstrap';

const coinSources = ['/coin_heads.svg', '/coin_tails.svg'];
const COIN_FLIP_TIME_MS = 700;

export const Coin = () => {
    const [coinSrcIndex, setCoinSrcIndex] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);

    const flipCoin = (e: React.MouseEvent) => {
        if (isFlipping) return;

        e.preventDefault();

        setIsFlipping(true);

        const numberOfFlips = Math.floor(Math.random() * 6) + 5;

        const interval = setInterval(() => {
            const coinImage = e.target as HTMLImageElement;
            coinImage.animate(
                [
                    {
                        transform: 'rotateX(0deg)',
                        easing: 'ease-in',
                        paddingBottom: '0px',
                        marginBottom: '25px',
                    },
                    {
                        transform: 'rotateX(90deg)',
                        paddingBottom: '25px',
                        marginBottom: '0px',
                    },
                ],
                {
                    duration: COIN_FLIP_TIME_MS / 2,
                    iterations: 1,
                }
            ).onfinish = () => {
                setCoinSrcIndex((c) => (c + 1) % 2);
                coinImage.animate(
                    [
                        {
                            transform: 'rotateX(90deg)',
                            paddingTop: '25px',
                            marginBottom: '0px',
                        },
                        {
                            transform: 'rotateX(0deg)',
                            easing: 'ease-out',
                            paddingTop: '0px',
                            marginBottom: '25px',
                        },
                    ],
                    {
                        duration: COIN_FLIP_TIME_MS / 2,
                        iterations: 1,
                    }
                );
            };
        }, COIN_FLIP_TIME_MS);
        setTimeout(() => {
            clearInterval(interval);
            setIsFlipping(false);
        }, COIN_FLIP_TIME_MS * numberOfFlips);
    };

    return (
        <div className={`p-3 ${isFlipping ? 'pulse' : ''}`}>
            <Image
                src={coinSources[coinSrcIndex]}
                className={`coin`}
                onClick={flipCoin}
            />
        </div>
    );
};

export default Coin;
