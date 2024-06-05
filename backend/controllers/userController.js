// Desc: User controller functions for signup, login, logout, follow/unfollow, update user, and get user profile
// Usage: Use the functions in the user controller to handle user requests in the user routes

import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import Post from '../models/postModel.js';


const signupUser = async (req, res) => {
    
    try {
        const { name, email, username, password, linkedIn, github } = req.body;
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
            password: hashedPassword,
            linkedIn,
            github
            
        });
        await newUser.save();


        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic,
                linkedIn: newUser.linkedIn,
                github: newUser.github,
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

        if(user.isFrozen){
            user.isFrozen = false;
            await user.save();
        }

        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic,
            linkedin: user.linkedin,
            github: user.github,
        });

    }
    catch (error) {
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
        const isFollowing = currentUser.following.includes(id);

        if(id === req.user._id.toString()) {
            return res.status(400).json({ error: 'You cannot follow yourself' });
        }

        if(!userModify || !currentUser) {
            return res.status(404).json({ error: 'User not found' });
        }

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
	const { name, email, username, password, bio, linkedIn, github } = req.body;
	let { profilePic } = req.body;


	const userId = req.user._id;
	try {
		let user = await User.findById(userId);
		if (!user) return res.status(400).json({ error: "User not found" });

		if (req.params.id !== userId.toString())
			return res.status(400).json({ error: "You cannot update other user's profile" });

		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
			user.password = hashedPassword;
		}

		if (profilePic) {
			if (user.profilePic) {
				await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
			}

			const uploadedResponse = await cloudinary.uploader.upload(profilePic);
			profilePic = uploadedResponse.secure_url;
		}

		user.name = name || user.name;
		user.email = email || user.email;
		user.username = username || user.username;
		user.profilePic = profilePic || user.profilePic;
		user.bio = bio || user.bio;
        user.linkedIn = linkedIn || user.linkedIn;
        user.github = github || user.github;

		user = await user.save();

		// Find all posts that this user replied and update username and userProfilePic fields
		await Post.updateMany(
			{ "replies.userId": userId },
			{
				$set: {
					"replies.$[reply].username": user.username,
					"replies.$[reply].userProfilePic": user.profilePic,
				},
			},
			{ arrayFilters: [{ "reply.userId": userId }] }
		);

		// password should be null in response
		user.password = null;

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in updateUser: ", err.message);
	}
};

const getUserProfile = async (req, res) => {
    // query going to be the username or id
    const {query} = req.params;

    try {
        let user;

        // check if the query is an id
        if(mongoose.Types.ObjectId.isValid(query)){
            user = await User.findOne({_id: query }).select('-password').select('-updatedAt');
        }else{
            user = await User.findOne({username: query }).select('-password').select('-updatedAt');
        }

        if(user.isFrozen){
            return res.status(403).json({ error: 'Account is frozen' });
        }

        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
        }catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getSuggestedUsers = async (req, res) => {
	try {
		// exclude the current user from suggested users array and exclude users that current user is already following
        // also exclude user with frozen account

		const userId = req.user._id;

		const usersFollowedByYou = await User.findById(userId).select("following");
        const frozenUsers = await User.find({isFrozen: true}).select('_id');

		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{
				$sample: { size: 10 },
			},
		]);

        const filteredUsers = users.filter(
            (user) =>
                !usersFollowedByYou.following.includes(user._id) && !frozenUsers.includes(user._id)
        );
		const suggestedUsers = filteredUsers.slice(0, 5);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const freezeAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.isFrozen = true;
        await user.save();
        res.status(200).json({ success: 'Account frozen'});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export { signupUser, loginUser, logoutUser,followUnfollowUser, updateUser,getUserProfile, getSuggestedUsers, freezeAccount };