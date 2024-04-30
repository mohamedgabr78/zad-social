import express from 'express';
import connectDB from './database/connectDB.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
connectDB(); 
const app = express();


const PORT = process.env.PORT || 3000; // if PORT is not defined in .env file, then use 3000 as default


// middleware
app.use(express.json()); // to parse json data from the request body
app.use(express.urlencoded({ extended: true })); // to parse url-encoded data from the request body
app.use(cookieParser()); // to parse cookies from the request headers


// routes
app.use('/api/users', userRoutes); // all routes in userRoutes will start with /api/users


app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
    });