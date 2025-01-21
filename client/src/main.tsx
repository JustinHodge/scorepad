import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import App from './App';
import { ScorePadProvider } from './contexts/score_pad';

ReactDOM.createRoot(document.getElementById('root')!).render(
    React.createElement(() => {
        return (
            <React.StrictMode>
                <ScorePadProvider>
                    <App />
                </ScorePadProvider>
            </React.StrictMode>
        );
    })
);
