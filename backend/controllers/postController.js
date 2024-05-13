import Post from '../models/postModel.js';
import User from '../models/userModel.js';

const createPost = async (req, res) => {
    try {
        const {postedBy, text, img} = req.body;

        if(!postedBy || !text){
            return res.status(400).json({ error: 'postedBy and text are required' });
        }

        const user = await User.findById(postedBy);

        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({ error: 'Unauthorized to post' });
        }

        if(text.length > 500){
            return res.status(400).json({ error: 'text must be less than 500 characters' });
        }


        const newPost = new Post({
            postedBy,
            text,
            img
        });
        await newPost.save();
        res.status(201).json(newPost);
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}


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

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Post deleted successfully' });

    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const likeUnlikePost = async (req, res) => {
    try {

        const {id: postId} = req.params;
        const userId = req.user._id;
        const post = await Post.findById(postId);

        const userLiked = post.likes.includes(userId);

        if(!post){
            await res.status(404).json({ error: 'Post not found' });
        }

        if(userLiked){
           await Post.updateOne({_id: postId}, { $pull: { likes: userId } });
           res.status(200).json(post.likes);
        }
        else {
            post.likes.push(userId);
            await post.save();
            res.status(200).json({message: 'Post liked successfully'});
        }


        await post.save();
        res.status(200).json(post.likes);

    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const replyToPost = async (req, res) =>{
    try{
            const { id: postId } = req.params;
            const userId = req.user._id;
            const { text, profilePic, username } = req.body;

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
                userprofilePic: req.user.profilePic,
                username: req.user.username
            }

            post.replies.push(reply);
            await post.save();
            res.status(200).json(post.replies);

        }catch (error) {
            res.status(500).json({ error: error.message });
    }
}


const feedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        const following = user.following;

        const posts = await Post.find({postedBy: { $in: following }}).sort({createdAt: -1});
        res.status(200).json(posts);


    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, feedPosts };