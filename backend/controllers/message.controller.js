import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

const mapGroupForSidebar = (conversation, loggedInUserId) => {
	const groupName = conversation.groupName?.trim() || "Unnamed Group";
	return {
		_id: conversation._id,
		isGroup: true,
		displayName: groupName,
		groupName,
		profilePic: "",
		participants: conversation.participants,
		lastMessage: conversation.lastMessage || "",
		lastMessageAt: conversation.lastMessageAt,
		memberCount: Array.isArray(conversation.participants) ? conversation.participants.length : 0,
		unreadCount: 0,
		groupAdmin: conversation.groupAdmin,
		isAdmin: String(conversation.groupAdmin) === String(loggedInUserId),
	};
};

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			isGroup: false,
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				isGroup: false,
				participants: [senderId, receiverId],
			});
		}

		const normalizedMessage = message?.trim();
		if (!normalizedMessage) {
			return res.status(400).json({ error: "Message cannot be empty" });
		}

		const newMessage = new Message({
			senderId,
			conversationId: conversation._id,
			receiverId,
			message: normalizedMessage,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
			conversation.lastMessage = normalizedMessage;
			conversation.lastMessageAt = newMessage.createdAt;
		}

		// await conversation.save();
		// await newMessage.save();

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", {
				...newMessage.toObject(),
				isGroup: false,
			});
		}

		res.status(201).json({ ...newMessage.toObject(), isGroup: false });
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			isGroup: false,
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const createGroup = async (req, res) => {
	try {
		const creatorId = req.user._id;
		const { groupName, participantIds } = req.body;

		const normalizedGroupName = groupName?.trim();
		if (!normalizedGroupName) {
			return res.status(400).json({ error: "Group name is required" });
		}

		const users = Array.isArray(participantIds) ? participantIds.filter(Boolean) : [];
		const uniqueParticipantIds = [...new Set([...users.map(String), String(creatorId)])];

		if (uniqueParticipantIds.length < 3) {
			return res.status(400).json({ error: "A group needs at least 3 members including you" });
		}

		const group = await Conversation.create({
			isGroup: true,
			groupName: normalizedGroupName,
			groupAdmin: creatorId,
			participants: uniqueParticipantIds,
			messages: [],
			lastMessage: "",
			lastMessageAt: null,
		});

		res.status(201).json(mapGroupForSidebar(group, creatorId));
	} catch (error) {
		console.log("Error in createGroup controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getGroupsForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		const groups = await Conversation.find({
			isGroup: true,
			participants: loggedInUserId,
		})
			.select("groupName groupAdmin participants lastMessage lastMessageAt")
			.sort({ lastMessageAt: -1, updatedAt: -1 })
			.lean();

		const sidebarGroups = groups.map((group) => mapGroupForSidebar(group, loggedInUserId));
		res.status(200).json(sidebarGroups);
	} catch (error) {
		console.log("Error in getGroupsForSidebar controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getGroupMessages = async (req, res) => {
	try {
		const { id: conversationId } = req.params;
		const loggedInUserId = req.user._id;

		const conversation = await Conversation.findOne({
			_id: conversationId,
			isGroup: true,
			participants: loggedInUserId,
		}).populate("messages");

		if (!conversation) {
			return res.status(404).json({ error: "Group not found" });
		}

		res.status(200).json(conversation.messages);
	} catch (error) {
		console.log("Error in getGroupMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const sendGroupMessage = async (req, res) => {
	try {
		const { id: conversationId } = req.params;
		const { message } = req.body;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			_id: conversationId,
			isGroup: true,
			participants: senderId,
		});

		if (!conversation) {
			return res.status(404).json({ error: "Group not found" });
		}

		const normalizedMessage = message?.trim();
		if (!normalizedMessage) {
			return res.status(400).json({ error: "Message cannot be empty" });
		}

		const newMessage = new Message({
			senderId,
			conversationId: conversation._id,
			receiverId: null,
			message: normalizedMessage,
		});

		conversation.messages.push(newMessage._id);
		conversation.lastMessage = normalizedMessage;
		conversation.lastMessageAt = newMessage.createdAt;

		await Promise.all([conversation.save(), newMessage.save()]);

		for (const participantId of conversation.participants) {
			if (String(participantId) === String(senderId)) continue;
			const receiverSocketId = getReceiverSocketId(String(participantId));
			if (!receiverSocketId) continue;
			io.to(receiverSocketId).emit("newMessage", {
				...newMessage.toObject(),
				isGroup: true,
				groupName: conversation.groupName,
			});
		}

		res.status(201).json({
			...newMessage.toObject(),
			isGroup: true,
			groupName: conversation.groupName,
		});
	} catch (error) {
		console.log("Error in sendGroupMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
