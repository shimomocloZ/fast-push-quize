"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const next_1 = __importDefault(require("next"));
const socket_io_1 = __importDefault(require("socket.io"));
const dev = process.env.NODE_ENV !== 'production';
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;
app
    .prepare()
    .then(() => {
    const server = (0, express_1.default)();
    server.use(express_1.default.json());
    server.post('/chat', (req, res) => {
        console.log('body', req.body);
        postIO(req.body);
        res.status(200).json({ message: 'success' });
    });
    server.all('*', async (req, res) => {
        return handle(req, res);
    });
    const httpServer = server.listen(port, (err) => {
        if (err)
            throw err;
        console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
    const socketIOServer = new socket_io_1.default.Server();
    const io = socketIOServer.listen(httpServer);
    io.on('connection', (socket) => {
        console.log('id: ' + socket.id + ' is connected');
    });
    const postIO = (data) => {
        io.emit('update-data', data);
    };
})
    .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
});
