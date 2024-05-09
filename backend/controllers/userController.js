// Desc: User controller functions for signup, login, logout, follow/unfollow, update user, and get user profile
// Usage: Use the functions in the user controller to handle user requests in the user routes

import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js';


const signupUser = async (req, res) => {
    
    try {
        const { name, email, username, password } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            name,
            email,
            username,
            password: hashedPassword
        });
        await newUser.save();


        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
            });
        }else{
            res.status(400).json({ error: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({username});
        const isMatch = await bcrypt.compare(password, user?.password || "");

        if (!user || !isMatch) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
        });

    }
    catch (error) {
        console.log("hna");
        res.status(500).json({ error: error.message });
    }
}
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const followUnfollowUser = async (req, res) => {

    try {

        const {id} = req.params;
        const currentUser = await User.findById(req.user._id);
        const userModify = await User.findById(id);

        if(id === req.user._id.toString()) {
            return res.status(400).json({ error: 'You cannot follow yourself' });
        }

        if(!userModify || !currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isFollowing = currentUser.following.includes(id);


        if(isFollowing) {
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            await User.findByIdAndUpdate(id, { $pull: { followers: currentUser._id } }); 
            res.status(200).json({ message: 'Unfollowed successfully' });
        }
        else {
            await User.findByIdAndUpdate(currentUser._id, { $push: { following: id } });
            await User.findByIdAndUpdate(userModify._id, { $push: { followers: currentUser._id } });
            res.status(200).json({ message: 'Followed successfully' });
        }


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateUser = async (req, res) => {
    
    const userId = req.user._id;
    const { name, email, username, password, profilePic, bio } = req.body;
    
    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if(req.params.id !== user._id.toString()){
            return res.status(400).json({ error: 'You cannot update other profiles' });
        }

        if(password){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        await user.save();

        res.status(200).json({json: 'User updated successfully'});

    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUserProfile = async (req, res) => {
    const {username} = req.params;
    try {
        const user = await User.findOne({username}).select('-password').select('-updatedAt');
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
        }catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export { signupUser, loginUser, logoutUser,followUnfollowUser, updateUser,getUserProfile };