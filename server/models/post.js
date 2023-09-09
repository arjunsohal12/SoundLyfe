import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        location: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        postPictureUrl: {
            type: String,
            default: ""
        },
        userPictureUrl: {
            type: String,
            default: ""
        },
        likes: { // Map is more efficient, O(1) apparently
            type: Map,
            of: Boolean,
        },
        comments: { // Placeholder, replace with its own comment schema later to enable liking and replying to comments
            type: Array,
            default: []
        },
        
    },
    {timestamps: true}
)

const Post = mongoose.model("Post", postSchema);


export default Post;