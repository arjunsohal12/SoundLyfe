import {Box, useMediaQuery} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import {Typography, Button} from "@mui/material";
import MyPostWidget from "scenes/widgets/MyPostWidget"
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MenuWidget from "scenes/widgets/MenuWidget";
import { setCurrentSong, setSpotifyAuth, setSpotifyToken } from "state";
import { useState, useEffect } from "react";


const HomePage = () => {
    const isNonMobileScreens = useMediaQuery("(min-width:1175px)")
    const {_id, picturePath} = useSelector((state) => state.user)
    const profileURL = useSelector((state) => state.user.userPictureUrl);
    const token = useSelector((state) => state.token)
    const spotifyAuth = useSelector((state) => state.spotifyAuth)

    const [currentlyPlaying, setCurrentlyPlaying] = useState("")
    const dispatch = useDispatch()

    const getSpotifyToken = async () => {
        const URLParams = new URLSearchParams(window.location.search)
        const code = URLParams.get('code')
        const verifier = URLParams.get('state')

        const response = await fetch("http://localhost:3001/music/", {
            method: "POST",
            headers: {Authorization: `Bearer ${token}`, "Content-Type": "application/json"},
            body: JSON.stringify({code, verifier, _id})
        })
        const data = await response.json()

        const date = new Date("February 12, 2004 01:15:00")
        const time = date.getTime()

        const expiryTime = time + 3600000 
        dispatch(setSpotifyAuth({spotifyAuth: {accessToken: data.access_token.access_token, refreshToken: data.access_token.refresh_token, scope: data.access_token.scope, expiryTime: expiryTime }}))
        setTimeout(() => refreshToken(data.access_token.refresh_token), 3450000) // refresh token a little earlier
        return data.access_token.access_token
    }

    const refreshToken = async (refreshToken) => {
        console.log("refresh!")
        const response = await fetch("http://localhost:3001/music/refreshToken", {
            method: "POST",
            headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`},
            body: JSON.stringify(refreshToken)
        })
        const data = await response.json()

        const date = new Date("February 12, 2004 01:15:00")
        const time = date.getTime()
        const expiryTime = time + 3600000 

        dispatch(setSpotifyToken({spotifyAuth: {token: data.token}}))
        setTimeout(() => refreshToken(refreshToken), 3450000)
    }

    const getCurrentSong = async (accessToken) => {
        try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            method: "GET",
            headers: { 'Authorization': `Bearer ${accessToken}`,} 
        })

        const data = await response.json();
        if (data.is_playing) {
            const timeLeft = data.item.duration_ms - data.progress_ms
            console.log(timeLeft)
            console.log(data.item.name)
            console.log(data)
            const song = `Listening to: ${data.item.name}` // \n by: ${data.item.artists[0].name}
            setCurrentlyPlaying(() => song)
            setTimeout(() => getCurrentSong(accessToken), timeLeft + 2500)
        }
        else {
            console.log("User is no longer playing song")
        }
        }
        catch (err) {
            console.log("error " + err)
            // check if error is cause our token is expired, then handleAccessToken, else throw error either user is done watching or spotify acting up
        }
    }

    const handleAccessToken = async () => {
        const date = new Date("February 12, 2004 01:15:00")
        const time = date.getTime()
        var spotifyToken = spotifyAuth.accessToken
        console.log(time/60000)
        console.log(spotifyAuth.expiryTime/60000)
        if (!spotifyAuth || !spotifyToken) {
            spotifyToken = await getSpotifyToken()

        }
        console.log(spotifyToken)

        getCurrentSong(spotifyToken)


    }
    // get song, get time left in song, setTimeOut, call the get song function when timeout runs out
    useEffect(() => {
        handleAccessToken()
    }, [])


    return (
    <Box>
        <Navbar />

        <Box width="100%"
        padding="2rem 6% 2rem 3%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
        flexDirection="row-reverse">
            <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
                <UserWidget userId={_id} picturePath={profileURL} song={currentlyPlaying} />
                {isNonMobileScreens && (
                <Box flexBasis="26%" m="2rem 0">
                    <Box m="2rem 0" />
                    <FriendListWidget userId={_id} />
                </ Box>
                )}
                
            </Box>
            
            <Box flexBasis={isNonMobileScreens ? "47%" : undefined} mt={isNonMobileScreens ? undefined : "2rem"}>
                <MyPostWidget picturePath={profileURL} />
                <PostsWidget userId={_id} />
            </Box>
            {isNonMobileScreens && (
                <Box flexBasis="23%" gap="1.5rem">
                    <MenuWidget />

                </ Box>
            )}
        </Box>
            
    </Box>

    )
}

export default HomePage;