import express from 'express';
import connectDB from './database/connectDB.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import cors from 'cors';


dotenv.config();
connectDB(); 
const app = express();

// fix CORS issue
app.use(cors());


const PORT = process.env.PORT || 5000;


// middleware
app.use(express.json()); // to parse json data from the request body
app.use(express.urlencoded({ extended: true })); // to parse url-encoded data from the request body
app.use(cookieParser()); // to parse cookies from the request headers


// routes
app.use('/api/users', userRoutes); // all routes in userRoutes will start with /api/users
app.use('/api/posts', postRoutes); // all routes in postRoutes will start with /api/posts


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    });