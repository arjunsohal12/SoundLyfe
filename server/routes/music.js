import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { getAccessToken, getUserSpotifyData, getCurrentSong, refreshAccessToken } from "../controllers/spotifyData.js";
const router = express.Router();

router.get('/:id', verifyToken, getUserSpotifyData)
router.post('/', getAccessToken)
router.post('/song', verifyToken, getCurrentSong )
router.post('/refreshToken', verifyToken, refreshAccessToken)

export default router