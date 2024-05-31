import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    },
    text: String,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
},{
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

export default Message;