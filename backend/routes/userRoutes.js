// Initialize express router and import the user controller functions and the protectRoute middleware

import express from 'express';
import { signupUser, loginUser, logoutUser,followUnfollowUser, updateUser,getUserProfile, getSuggestedUsers, freezeAccount } from '../controllers/userController.js';
import  protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();


router.get('/profile/:query', getUserProfile)
router.post('/signup', signupUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/follow/:id', protectRoute, followUnfollowUser)
router.put('/update/:id', protectRoute, updateUser)
router.get('/suggested', protectRoute, getSuggestedUsers)
router.put('/freeze', protectRoute, freezeAccount)



export default router;


