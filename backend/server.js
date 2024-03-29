import express from 'express';
import connectDB from './database/connectDB.js';
import dotenv from 'dotenv';

dotenv.config();
connectDB();
const app = express();


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
    });