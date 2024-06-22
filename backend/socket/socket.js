import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import Message from '../models/messageModel.js';
import Conversation from '../models/conversationModel.js';
import redisAdapter from 'socket.io-redis';
import redis from 'redis';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const pubClient = redis.createClient({
    host: 'redis',
    port: 6379,
    retry_strategy: function(options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with a individual error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
});

const subClient = redis.createClient({
    host: 'redis',
    port: 6379,
    retry_strategy: function(options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with a individual error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
});

pubClient.on('error', function(err) {
    console.error('Redis pubClient Error:', err);
});

subClient.on('error', function(err) {
    console.error('Redis subClient Error:', err);
});

io.adapter(redisAdapter({
    pubClient,
    subClient
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
            console.error('Error marking message as seen:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { httpServer, io, app };
