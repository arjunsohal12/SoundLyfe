import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; //webtoken for auth
import User from "../models/user.js"
import mongoose from "mongoose";
import { uploadToS3, getImageURL } from "./imgProcess.js";
import dotenv from "dotenv"
import crypto from 'crypto'
import querystring from 'node:querystring'
/* Register User */

dotenv.config();

const spotifyClientKey = process.env.SPOTIFY_CLIENT_KEY;
const spotifySecretKey = process.env.SPOTIFY_SECRET_KEY;


export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;

        const salt = await bcrypt.genSalt(); // encryption
        const passwordHash = await bcrypt.hash(password, salt)
        const imgName = await uploadToS3(req.file)
        console.log(imgName)
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath: imgName,
            friends,
            location,
            occupation,
            viewedProfile: 0, //placeholder
            impressions: 0,
            userPictureUrl: await getImageURL(imgName) 

        })
        // console.log(req.file) Multer upload.single adds a file object to the request, this is why we call its middleware

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }

}

/* LOGIN */

// NOT EXTREMELY SECURE, PLACEHOLDER MAKE MORE SECURE
// Login -> token, user can use to sign in
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email: email})
        if (!user) {
            return res.status(400).json({msg: "User does not exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({msg:" Invalid credentials "})
        }

        const token = jwt.sign({ id:user._id}, process.env.JWT_SECRET);

        delete user.password;


        res.status(200).json({token, user});
    }
    catch (err){ 
        console.log(err)
        res.status(500).json({ error: err.message })
    }

}

export const spotifyAuth = async(req, res) => {
    const state = crypto.randomBytes(16).toString('hex')
    const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-library-modify user-library-read user-read-currently-playing';
    const url = "https://accounts.spotify.com/authorize?" + "client_id=" + spotifyClientKey + "&response_type=code" +"&redirect_uri=" + encodeURI('http://localhost:3000/home') + "&scope=" + scope +"&state=" +state

    res.status(200).json({redirectUrl: url})
}


