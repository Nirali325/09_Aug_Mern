import express from "express";
import { sendMessage, getAllMessages } from "../controllers/messageController.js"; // use correct folder
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Routes
router.post("/send", sendMessage);
router.get("/getall", isAdminAuthenticated, getAllMessages);

export default router;