import express from 'express';
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    searchUser
} from "../controllers/users.js";
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/* READ */

router.get("/:id", verifyToken, getUser); // First verify the token before displaying any user information
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/:userEmail/:userName", verifyToken, searchUser);
/* PATCH */

router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
