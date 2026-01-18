import express from "express";
import { createMatchRequest, getMatchesForUser, acceptMatch, rejectMatch, getFriendsForUser } from "../controllers/match.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// create requires authentication (follower determined from token)
router.post("/create", verifyToken, createMatchRequest);

// get incoming/outgoing for current user
router.get("/", verifyToken, getMatchesForUser);

// accept/reject by id (user must be the followedUserId)
router.put("/:id/accept", verifyToken, acceptMatch);
router.put("/:id/reject", verifyToken, rejectMatch);

// get accepted buddies (for sidebar)
router.get("/friends", verifyToken, getFriendsForUser);

export default router;
