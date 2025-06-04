import express from 'express';
import { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts, getUserPosts, deleteReply} from '../controllers/postController.js';
import  protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();


router.post('/create', protectRoute , createPost)
router.get('/feed', protectRoute , getFeedPosts)
router.get('/:id', getPost)
router.get('/user/:username', getUserPosts)
router.delete('/delete/:id', protectRoute, deletePost)
router.put('/like/:id', protectRoute, likeUnlikePost)
router.put('/reply/:id', protectRoute, replyToPost)
router.delete('/:postId/reply/:replyId', protectRoute, deleteReply)



export default router;
