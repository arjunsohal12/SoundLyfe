import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    mode: "light",
    user: "null",
    token: "null",
    posts: [],
    spotifyAuth: {accessToken: null},
    chatData: {chats: [], currentChat: "null", }
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: { // functions to modify the state
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => { // action is params/args for function
            state.user = action.payload.user; // we get user param from payload, given to us in the action (params)
            state.token = action.payload.token; 
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action) => {
            if (state.user ) { // might need to also check if friends exist
                state.user.friends = action.payload.friends;
            }
            else {
                console.error("User friends non-existant")
            }
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map( (post) => {
                if (post._id === action.payload.post._id) {
                    return action.payload.post;
                }
                else {
                    return post
                }
            })
            state.posts = updatedPosts;
        },
        setSpotifyAuth: (state, action) => {
            state.spotifyAuth = action.payload.spotifyAuth
        },
        setSpotifyToken: (state, action) => {
            state.spotifyAuth.accessToken = action.payload.token
        },
        setChatData: (state, action) => {
            state.chatData = action.payload.chatData
        },

        setChatRoom: (state, action) => {
            state.chatData.currentChat = action.payload.chat
        },
        setChats: (state, action) => {
            state.chatData.chats = action.payload.chats.chats
        }
        
    }
})

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, setProfileURL, setSpotifyAuth, setChatData, setChatRoom, setChats, setSpotifyToken} = authSlice.actions;
export default authSlice.reducer;