import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import redis from 'redis';
import { createAdapter } from 'socket.io-redis';
import Message from '../models/messageModel.js';
import Conversation from '../models/conversationModel.js';

const app = express();
const httpServer = http.createServer(app);

// Redis configuration
const redisOptions = {
    host: 'localhost',
    port: 6379,
};


const pubClient = redis.createClient(redisOptions);
const subClient = redis.createClient(redisOptions);

pubClient.on('error', (error) => {
    console.error('Redis pubClient error:', error);
});

subClient.on('error', (error) => {
    console.error('Redis subClient error:', error);
});

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Set up Redis adapter for Socket.io
io.adapter(createAdapter({ pubClient, subClient }));

export const getRecipientSocketId = (recipientId) => {
    return userSocketMap[recipientId];
}

const userSocketMap = {};

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    const { userId } = socket.handshake.query;
    if (userId != 'undefined') userSocketMap[userId] = socket.id;
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('markMessageSeen', async ({ conversationId, userId }) => {
        try {
            await Conversation.updateOne({
                _id: conversationId
            }, {
                $set: {
                    'lastMessage.seen': true
                }
            });
            await Message.updateMany({
                conversationId: conversationId,
                seen: false
            }, {
                $set: { seen: true }
            });
            io.to(userSocketMap[userId]).emit('messageSeen', { conversationId });
        } catch (error) {
            console.log(error);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { httpServer, io, app };
