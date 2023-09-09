import express from "express";
import {login, spotifyAuth} from "../controllers/auth.js";

const router = express.Router();

router.post('/login', login)
router.get('/spotifyAuth', spotifyAuth)
export default router;