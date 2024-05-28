import express from 'express';
import { sendMessage, getMessages, getConversations, deleteMessage } from '../controllers/messageController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();



router.get('/conversations',protectRoute, getConversations);
router.get('/:usersId',protectRoute, getMessages);
router.delete('/:id',protectRoute, deleteMessage);
router.post('/',protectRoute, sendMessage);



export default router;