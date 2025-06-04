import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    text: {
        type: String,
        maxLength: 500,
        required: true
    },
    img: {
        type: String,
        default: ''
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    replies: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "User"
            },
            text: {
                type: String,
                required: true
            },
            userprofilePic: {
                type: String,
            },
            username: {
                type: String,
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
},{
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

export default Post;