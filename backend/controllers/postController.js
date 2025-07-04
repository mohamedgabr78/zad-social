import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import { v2 as cloudinary } from 'cloudinary';



const createPost = async (req, res) => {
    try {
        const {postedBy, text} = req.body;
        let {img} = req.body;

        if(!postedBy || !text){
            return res.status(400).json({ error: 'PostedBy and text fields are required' });
        }

        const user = await User.findById(postedBy);

        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({ error: 'Unauthorized to post' });
        }

		const maxLength = 300;
		if (text.length > maxLength) {
			return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
		}

        if (img) {
                const uploadedResponse = await cloudinary.uploader.upload(img, {
                    upload_preset: 'ml_default',
                });
                img = uploadedResponse.secure_url;
            }
            const newPost = new Post({ postedBy, text, img });
            await newPost.save();
    
            res.status(201).json(newPost);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    };


const getPost = async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json(post);
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({ error: 'Post not found' });
        }

        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(401).json({ error: 'Unauthorized to delete' });
        }

        if(post.img){
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Post deleted successfully' });

    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const likeUnlikePost = async (req, res) => {
	try {
		const { id: postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
			res.status(200).json({ message: "Post unliked successfully" });
		} else {
			// Like post
			post.likes.push(userId);
			await post.save();
			res.status(200).json({ message: "Post liked successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};


const replyToPost = async (req, res) =>{
    try{
            const { id: postId } = req.params;
            const userId = req.user._id;
            const { text } = req.body;
            const {profilePic,username} = req.user;
            

            if(!text, !userId){
                return res.status(400).json({ error: 'Test and Id are required' });
            }

            const post = await Post.findById(postId);

            if(!post){
                return res.status(404).json({ error: 'Post not found' });
            }

            const reply = {
                userId,
                text,
                userprofilePic: profilePic,
                username,
            }

            post.replies.push(reply);
            await post.save();
            res.status(200).json(post.replies);

        }catch (error) {
            res.status(500).json({ error: error.message });
    }
}


const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        const following = user.following;

        const feedPosts = await Post.find({postedBy: { $in: following }}).sort({createdAt: -1});
        res.status(200).json(feedPosts);


    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUserPosts = async (req, res) => {
    const {username} = req.params;
    try {
        const user = await User.findOne( {username} );
        if(!user){
            return res.status(404).json({ error: 'User not found' });
        }
        const posts = await Post.find({postedBy: user._id}).sort({createdAt: -1});
        res.status(200).json(posts);
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteReply = async (req, res) => {
    try {
        const { postId, replyId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        post.replies = post.replies.filter((r) => r._id.toString() !== replyId);
        await post.save();
        res.status(200).json({ message: "Reply deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts, deleteReply };