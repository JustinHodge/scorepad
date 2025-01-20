import React, { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';

export interface IGame {}

ReactDOM.createRoot(document.getElementById('root')!).render(
    React.createElement(() => {
        const connection = useRef<WebSocket>();

        return (
            <React.StrictMode>
                <p>Hello</p>
            </React.StrictMode>
        );
    })
);
