import { createElement, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './main.css';
import { ScorePadProvider } from './contexts/score_pad';

createRoot(document.getElementById('root')!).render(
    createElement(() => {
        return (
            <StrictMode>
                <ScorePadProvider>
                    <App />
                </ScorePadProvider>
            </StrictMode>
        );
    })
);
