import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    text: {
        type: String,
        maxlength: 500,
        required: true
    },
    img: {
        type: String,
        default: ''
    },
    likes: {
        type: Number,
        default: 0
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