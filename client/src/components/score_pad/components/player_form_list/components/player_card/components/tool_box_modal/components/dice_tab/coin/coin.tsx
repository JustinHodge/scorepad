import { useState } from 'react';
import { Image } from 'react-bootstrap';

const coinSources = ['/coin_heads.svg', '/coin_tails.svg'];
const COIN_FLIP_TIME_MS = 700;

export const Coin = () => {
    const [coinSrcIndex, setCoinSrcIndex] = useState(0);

    const flipCoin = (e: React.MouseEvent) => {
        e.preventDefault();
        const numberOfFlips = Math.floor(Math.random() * 6) + 5;
        const interval = setInterval(() => {
            const coinImage = e.target as HTMLImageElement;
            coinImage.animate(
                [
                    {
                        transform: 'rotateX(0deg)',
                        easing: 'ease-in',
                        paddingBottom: '0px',
                    },
                    {
                        transform: 'rotateX(90deg)',
                        paddingBottom: '50px',
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
                            paddingTop: '50px',
                        },
                        {
                            transform: 'rotateX(0deg)',
                            easing: 'ease-out',
                            paddingTop: '0px',
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
            console.log(numberOfFlips);
        }, COIN_FLIP_TIME_MS * numberOfFlips);
    };

    return (
        <Image
            src={coinSources[coinSrcIndex]}
            className={`coin`}
            onClick={flipCoin}
        />
    );
};

export default Coin;
