import express from 'express';
import { sendMessage, getMessages, getConversations, deleteConversation } from '../controllers/messageController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();



router.get('/conversations',protectRoute, getConversations);
router.get('/:usersId',protectRoute, getMessages);
router.delete('/conversations/:id',protectRoute, deleteConversation);
router.post('/',protectRoute, sendMessage);



export default router;