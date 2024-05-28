import express from 'express';
import connectDB from './database/connectDB.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import cors from 'cors';
import {v2 as cloudinary} from 'cloudinary';


dotenv.config();
connectDB(); 
const app = express();


const PORT = process.env.PORT || 5000;

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



// middleware
app.use(express.json({limit: "50mb"})); // to parse json data from the request body
app.use(express.urlencoded({ extended: true })); // to parse url-encoded data from the request body
app.use(cookieParser()); // to parse cookies from the request headers
app.use(cors()); // to allow cross-origin requests


// routes
app.use('/api/users', userRoutes); // all routes in userRoutes will start with /api/users
app.use('/api/posts', postRoutes); // all routes in postRoutes will start with /api/posts
app.use('/api/messages', messageRoutes); // all routes in messageRoutes will start with /api/messages


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    });