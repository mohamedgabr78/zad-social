import User from '../models/userModel.js';
import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import { v2 as cloudinary } from 'cloudinary';

const sendMessage = async (req, res) => {
    try {
        const { message, receiverId } = req.body;
        const senderId = req.user._id;

        const receiver = await User.findById(receiverId);

        if (!receiver) return res.status(404).json({ error: 'User not found' });

        if (receiverId === senderId) return res.status(400).json({ error: 'You cannot send a message to yourself' });

        let conversation = await Conversation.findOne({
            members: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = new Conversation({
                members: [senderId, receiverId],
                lastMessage: {
                    sender: senderId,
                    text: message
                }
            });

            await conversation.save();
        }

        const newMessage = new Message ({
            conversationId: conversation._id,
            sender: senderId,
            text: message
        });

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    sender: senderId,
                    text: message
                }
            })
        ])

        return res.status(200).json(newMessage);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getMessages = async (req, res) => {

    const {usersId} = req.params;
    const userId = req.user._id;

    try{
        const conversation = await Conversation.findOne({
            members: { $all: [userId, usersId] }
        });

        if(!conversation) return res.status(404).json({ error: 'Conversation not found' });

        const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });

        const sortedMessages = messages.sort((a, b) => a.createdAt - b.createdAt);

        return res.status(200).json(sortedMessages);

    }
    catch(error){
        return res.status(500).json({ error: error.message });
    }
}

const getConversations = async (req, res) => {
    const userId = req.user._id;

    try {
        const conversations = await Conversation.find({ members: userId }).populate('members', ['username', 'profilePic']);

        conversations.forEach(conversation => {
            conversation.members = conversation.members.filter(member => member._id.toString() !== userId.toString());
        }
        );

        return res.status(200).json(conversations);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const deleteConversation = async (req, res) => {

    const { id } = req.params;
    const userId = req.user._id;

    try {
        const conversation = await Conversation.findById(id);

        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

        if (!conversation.members.includes(userId)) return res.status(403).json({ error: 'You are not authorized to delete this conversation' });

        await conversation.deleteOne();

        return res.status(200).json({ message: 'Conversation deleted successfully' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


export { sendMessage, getMessages, getConversations, deleteConversation };