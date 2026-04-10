import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
	{
		isGroup: {
			type: Boolean,
			default: false,
		},
		groupName: {
			type: String,
			trim: true,
			default: "",
		},
		groupAdmin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		lastMessage: {
			type: String,
			default: "",
		},
		lastMessageAt: {
			type: Date,
			default: null,
		},
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",
				default: [],
			},
		],
	},
	{ timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
