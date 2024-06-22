import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import Message from '../models/messageModel.js';
import Conversation from '../models/conversationModel.js';
import redisAdapter from 'socket.io-redis'; // Import socket.io-redis adapter

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Configure socket.io to use the redis adapter
io.adapter(redisAdapter({
    host: 'redis',
    port: 6379
}));

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
