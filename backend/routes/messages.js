import express from "express";
import {
  getConversations,
  getMessagesWithBuddy,
  sendMessage,
  markAsRead,
} from "../controllers/message.js";

//  promijeni naziv/import ako ti se middleware drugačije zove
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Lista konverzacija (zadnja poruka + unread count)
router.get("/conversations", verifyToken, getConversations);

// Sve poruke s buddy-em (i mark as read)
router.get("/with/:buddyId", verifyToken, getMessagesWithBuddy);

// Slanje poruke
router.post("/", verifyToken, sendMessage);

// Označi kao pročitano (manual)
router.put("/mark-read", verifyToken, markAsRead);

export default router;
