import express from 'express';
import { sendMessage, getMessages, getConversations } from '../controllers/messageController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();



router.get('/conversations',protectRoute, getConversations);
router.get('/:usersId',protectRoute, getMessages);
router.post('/',protectRoute, sendMessage);



export default router;