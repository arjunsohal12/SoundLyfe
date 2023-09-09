import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from "@mui/icons-material";
import {Box, Divider, IconButton, Typography, useTheme} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({postId, postUserId, name, description, location, picturePath, userPicturePath, likes, comments}) => {
    const [isComments, setIsComments] = useState(false)
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token)
    const loggedInUserId = useSelector((state) => state.user._id)
    const isLiked = Boolean(likes[loggedInUserId]) // likes is a mapping from userId's to boolean value, so we find the boolean for this users id to determine if they liked the post
    const likeCount = Object.keys(likes).length;
    const {palette} = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
    const patchLike = async () => {
        // TODO: The posts pictureURL property is not part of the Post schema, so it is not being returned, need to fix this
        const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"  // Content-Type tells the API that we are sending it json data
            },
            body: JSON.stringify({userId: loggedInUserId})
        });
        const updatedPost = await response.json();
        updatedPost.postPictureUrl = picturePath;
        updatedPost.userPictureUrl = userPicturePath;


        dispatch(setPost({post:updatedPost}))
    }
    return (
        <WidgetWrapper margin="2rem 0">
            <Friend
                friendId={postUserId}
                name={name}
                subtitle={location}
                userPicturePath={userPicturePath}
            />
            <Typography color={main} sx={{mt: "1rem"}}>
                {description}
            </Typography>
            {picturePath && (
                <img width="100%" height="auto" alt="Post" style={{borderRadius:"0.75rem", mt:"0.75rem"}} src={picturePath}/>
            )}
            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">

                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={patchLike}>
                            {isLiked ? (
                                <FavoriteOutlined sx={{color: primary}}/>
                            ) : (
                                <FavoriteBorderOutlined />
                            )}
                        </IconButton>
                        <Typography> {likeCount} </Typography>
                    </FlexBetween>

                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={() => setIsComments(!isComments)}>
                            <ChatBubbleOutlineOutlined />
                        </IconButton>
                        <Typography> {comments.length} </Typography>
                    </FlexBetween>

                </FlexBetween>

                <IconButton> 
                    <ShareOutlined />
                </IconButton>

            </FlexBetween>
            {isComments && (
                <Box mt="0.5rem">
                    {comments.map((comment, i) => ( // i is the index
                        <Box key={`${name}-${i}`}>
                            <Divider />
                            <Typography sx={{color:main, m:"0.5rem 0", pl:"1rem"}} >
                                {comment}
                            </Typography>
                        </Box>
                    ))}
                    <Divider />
                </Box>
            )}
        </WidgetWrapper>
    )
}
export default PostWidget