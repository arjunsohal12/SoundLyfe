import User from "../models/user.js"
import dotenv from 'dotenv'
import request from 'request'

var access_token = null;

const spotifyClientKey = process.env.SPOTIFY_CLIENT_KEY;
const spotifySecretKey = process.env.SPOTIFY_SECRET_KEY;

const getAccessToken = async (req, res) => {
    const {code, verifier, _id} = req.body
    console.log(req.body)
    const params = new URLSearchParams();
    params.append("client_id", spotifyClientKey);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:3000/home");
    params.append("code_verifier", verifier);
    console.log(code)
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: 'Basic ' + (new Buffer.from(spotifyClientKey + ':' + spotifySecretKey).toString('base64'))},
        body: params
    });

    access_token = await result.json();
    console.log(access_token)
    res.status(200).json({access_token, _id})
}

const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.body;
        const params = new URLSearchParams();
        params.append("grant_type", "refresh_token")
        params.append("refresh_token", refreshToken)
        const result = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded", Authorization: 'Basic ' + (new Buffer.from(spotifyClientKey + ':' + spotifySecretKey).toString('base64'))},
            body: params
        });
        const data = await result.json();
        res.status(200).json(data)
    }
    catch (err) {
        res.status(500).json({error: err})
    }
}
const getUserSpotifyData = (req, res) => {

}


const getCurrentSong = async (req, res) => {
    try {
        const {accessToken} = req.body;
        console.log(req.body)
        console.log(`Access Token : ${accessToken}`)
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            method: "GET",
            headers: { 'Authorization': `Bearer ${accessToken}`,} //, 'Accept': 'application/x-www-form-urlencoded; application/json'
        })

        const data = await response.json();
        console.log(data)
        res.status(200).json({token: data.access_token})
    }
    catch (err) {
        console.log("error")
        console.log(err)
        res.status(500).json({error: err})
    }
}
    


export {getUserSpotifyData, getAccessToken, getCurrentSong, refreshAccessToken}