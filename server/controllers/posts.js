import Post from "../models/post.js";
import User from "../models/user.js"
import { getImageURL, uploadToS3 } from "./imgProcess.js";
/* CREATE */

export const createPost = async (req, res) => {
    try {
        const {userId, description} = req.body;
        const user = await User.findById(userId);
        const imgName = await uploadToS3(req.file);
        const postPictureUrl = await getImageURL(imgName);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.userPicturePath,
            picturePath: imgName,
            likes: {},
            comments: [],
            postPictureUrl: postPictureUrl,
            userPictureUrl: user.userPictureUrl
        })

        await newPost.save(); // save post
        const post = await Post.find(); // grab all posts so we can display updated posts (is this the best way to do it? how does instagram do it?)
        res.status(201).json(post); // return posts to frontend to display
    }

    catch (err){
        console.log(err)
        res.status(409).json({error: err.message});
    }

}

/* READ */

export const getFeedPosts = async (req, res) => {
    try{

        const posts = await Post.find();
        // prob a more efficient way to do this ?
        const formattedPosts = await Promise.all(posts.map(
            async (post) => {
                // const user = await User.findByIdAndUpdate(post.userId,
                //     {userPictureUrl: await getImageURL(post.userPicturePath)},
                //     {new: true}
                //     );
                // const updatedPost = await Post.findByIdAndUpdate(post._id, 
                //     {postPictureUrl: await getImageURL(post.picturePath)},
                //     {new: true}) // the new parameter makes us return the modified object instead of the original
                return {_id: post._id, userId: post.userId, firstName: post.firstName, lastName: post.lastName, location:post.location, description: post.description, picturePath: post.picturePath, 
                userPicturePath: post.userPicturePath, likes: post.likes, comments: post.comments, postPictureUrl: post.postPictureUrl, userPictureUrl: post.userPictureUrl}
            }))
        res.status(200).json(formattedPosts);

    }

    catch (err){
        res.status(404).json({error: err.message});
    }

}


export const getUserPosts = async (req, res) => {
    try{
        const {userId} = req.params
        const post = await Post.find({userId});
        res.status(200).json(post);

    }

    catch (err){
        res.status(404).json({error: err.message});
    }

}

/* UPDATE */

export const likePost = async (req, res) => {
    try{
        const {id} = req.params; // post id
        const {userId} = req.body; // user id from body
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId); // if the userId exists in the likes mapping of Post schema


        if (isLiked) { // if already liked, unlike

            post.likes.delete(userId);
        }
        else { // like
            post.likes.set(userId, true);
        }
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
            {new: true}, // find post, set its likes to our post objects likes, and set new object to true

        );
        res.status(200).json(updatedPost); // send frontend updated post
    }

    catch (err){
        console.log(err)
        res.status(404).json({error: err.message});
    }

}

