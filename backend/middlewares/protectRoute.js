// create a middleware to protect routes that require authentication

import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');
        req.user = user;

        // call the next middleware in the stack
        next();
    }catch(error){
        res.status(500).json({ message: error.message });
        console.log(error.message);

    }
}

export default protectRoute;
