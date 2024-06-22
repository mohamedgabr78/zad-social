// import { Server } from 'socket.io';
// import http from 'http';
// import express from 'express';
// import Message from '../models/messageModel.js';
// import Conversation from '../models/conversationModel.js';
// import redis from 'redis';

// const app = express();
// const httpServer = http.createServer(app);
// const io = new Server(httpServer, {
//     cors: {
//         origin: "http://localhost:3000",
//         methods: ["GET", "POST"]
//     }
// });

// const redisClient = redis.createClient({
//     host: process.env.REDIS_HOST || 'redis',
//     port: process.env.REDIS_PORT || 6379
// });

// redisClient.on('connect', () => {
//     console.log('Redis client connected');
// });

// redisClient.on('error', (error) => {
//     console.error('Redis error:', error);
// });

// const userSocketMap = {}; // Map to store userId to socketId mappings

// // Function to get recipient socketId from Redis
// export const getRecipientSocketId = async (recipientId) => {
//     return new Promise((resolve, reject) => {
//         console.log('Attempting to get recipient socket ID for user:', recipientId);
//         redisClient.get(recipientId, (error, socketId) => {
//             if (error) {
//                 console.error('Error fetching socket ID from Redis:', error);
//                 reject(error);
//             } else {
//                 console.log('Socket ID found in Redis:', socketId);
//                 resolve(socketId);
//             }
//         });
//     });
// };

// io.on('connection', (socket) => {
//     console.log('a user connected', socket.id);

//     const { userId } = socket.handshake.query;
//     if (userId && userId !== 'undefined') {
//         userSocketMap[userId] = socket.id; // Store userId to socketId mapping in memory
//         redisClient.set(userId, socket.id); // Store userId to socketId mapping in Redis
//         io.emit('getOnlineUsers', Object.keys(userSocketMap)); // Emit updated list of online users
//     }

//     socket.on('markMessageSeen', async ({ conversationId, userId }) => {
//         try {
//             await Conversation.updateOne({
//                 _id: conversationId
//             }, {
//                 $set: {
//                     'lastMessage.seen': true
//                 }
//             });

//             await Message.updateMany({
//                 conversationId: conversationId,
//                 seen: false
//             }, {
//                 $set: { seen: true }
//             });

//             const recipientSocketId = await getRecipientSocketId(userId);
//             if (recipientSocketId) {
//                 io.to(recipientSocketId).emit('messageSeen', { conversationId });
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log('user disconnected', socket.id);

//         // Find and remove user from userSocketMap
//         const userIdToRemove = Object.keys(userSocketMap).find(key => userSocketMap[key] === socket.id);
//         if (userIdToRemove) {
//             delete userSocketMap[userIdToRemove];
//             redisClient.del(userIdToRemove); // Remove userId to socketId mapping from Redis
//             io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit updated list of online users
//         }
//     });
// });

// export { httpServer, io, app };

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
