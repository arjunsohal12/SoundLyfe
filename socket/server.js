import dotenv from "dotenv"
import express from "express"
import { Server } from "socket.io";
import { handleSendMessage, handleJoinRoom, handleLeaveRoom, handleDisconnect, handleConnection, handleCreateRoom, handlejoinListeningParty} from "./custom-event-handlers.js";
import redis from "redis";
import {getMessages} from "./models.js";

const app = express();
const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    console.log(`Server is running on port ${ port }`);
});

const redisClient = redis.createClient();
redisClient.on('error', err => console.log('Redis Client Error', err));
await redisClient.connect();


const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    handleConnection(socket);

    socket.on('join-room', (data) => {
        handleJoinRoom(socket, data);
    });
    
    socket.on('leave-room', (data) => {
        handleLeaveRoom(socket, data);
    });

    socket.on('send-message', (data) => {
        handleSendMessage(io, data, socket.id);
    });
    
    socket.on('disconnect', (data) => {
        handleDisconnect(socket);
    });

    socket.on('join-listening-party', (data) => {
        handlejoinListeningParty(socket, data)
    });
});

export default redisClient