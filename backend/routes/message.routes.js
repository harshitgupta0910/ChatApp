import express from "express";
import {
	createGroup,
	getGroupMessages,
	getGroupsForSidebar,
	getMessages,
	sendGroupMessage,
	sendMessage,
} from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/groups", protectRoute, getGroupsForSidebar);
router.post("/groups", protectRoute, createGroup);
router.get("/group/:id", protectRoute, getGroupMessages);
router.post("/group/send/:id", protectRoute, sendGroupMessage);

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router