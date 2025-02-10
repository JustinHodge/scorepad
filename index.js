"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const websocketMessageHandler_1 = require("./controller/websocketMessageHandler");
const scorePads_1 = __importDefault(require("./class/scorePads"));
const ws_1 = require("ws");
const globalConstants_1 = require("./globalConstants");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
const wss = new ws_1.WebSocketServer({ server: server });
const scorePads = new scorePads_1.default();
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.resolve('../public')));
app.get('/', (req, res) => {
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging'
        ? res.sendFile(path_1.default.resolve('../public/client/index.html'))
        : res.send('Development Server. Use Vite Frontend.');
});
app.get('/scorepads', (req, res) => {
    process.env.NODE_ENV === 'development'
        ? res.send(scorePads.getScorePads())
        : res.status(403).send('Forbidden');
});
wss.on('connection', (websocket, request) => {
    websocket.on('error', console.error);
    websocket.on('message', (data) => {
        const parsedData = JSON.parse(data);
        (0, websocketMessageHandler_1.websocketMessageHandler)(parsedData, scorePads, websocket);
    });
    const message = {
        type: globalConstants_1.MESSAGE_TYPE.SYSTEM_MESSAGE,
        data: {
            message: 'Successfully Connected',
        },
    };
    websocket.send(JSON.stringify(message));
});
