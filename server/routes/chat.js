import express from "express"
import { verifyToken } from "../middleware/auth.js"
import {userChats, createChat} from "../controllers/chat.js"
const router = express.Router()

router.post("/getChat/:id", verifyToken, userChats)

export default router