import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import { Theme } from "@mui/material";
import gradient from "./gradient.css";
import { StyledEngineProvider } from "@mui/material";
const FriendListWidget = ({userId}) => {
    const dispatch = useDispatch();
    const {palette} = useTheme();
    const token = useSelector((state) => state.token)
    const friends = useSelector((state) => state.user.friends)
    const theme = useTheme()
    const getFriends = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}/friends` , {
            method: "GET",
            headers: {Authorization: `Bearer ${token}`}
        });

        const data = await response.json()
        console.log(data)
        dispatch(setFriends({friends:data}))
    };

    useEffect(() => {
        getFriends();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <StyledEngineProvider injectFirst>
        <Box padding="1.5rem 1.5rem 0.75rem 1.5rem" borderRadius="1.34rem" className="FriendList">
            <Typography color="lime" variant="h5" fontWeight="500" sx={{mb:"1.5rem"}}>
                Friend List
            </Typography>
            <Box display="flex" flexDirection="column" gap="1.5rem">
                {friends.length !== 0 ? (friends.map((friend) => (
                    <Friend key={friend._id} friendId={friend._id} name= {`${friend.firstName} ${friend.lastName}`} subtitle={friend.occupation} userPicturePath={friend.userPictureUrl}/>
                ))) : ( 
                    <Typography padding="1.0rem 0rem" variant="h5" color={palette.primary.main}> 
                        Look Like you have no friends! What a loser!
                    </Typography>
                )}
            </Box>
        </Box>
        </StyledEngineProvider>
    )
}

export default FriendListWidget