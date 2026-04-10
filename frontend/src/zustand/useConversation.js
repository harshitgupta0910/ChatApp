import { create } from "zustand";

const getTimestamp = (value) => {
	if (!value) return 0;
	const time = new Date(value).getTime();
	return Number.isNaN(time) ? 0 : time;
};

const sortConversations = (conversations) =>
	[...conversations].sort((a, b) => getTimestamp(b.lastMessageAt) - getTimestamp(a.lastMessageAt));

const ensureDefaults = (conversation) => ({
	unreadCount: 0,
	lastMessage: "",
	lastMessageAt: null,
	...conversation,
});

const toId = (value) => {
	if (!value) return "";
	if (typeof value === "string") return value;
	if (typeof value === "object" && value._id) return String(value._id);
	if (typeof value.toString === "function") return String(value.toString());
	return String(value);
};

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
	conversations: [],
	setConversations: (conversations) =>
		set({ conversations: sortConversations(conversations.map((conversation) => ensureDefaults(conversation))) }),
	markConversationAsRead: (conversationId) =>
		set((state) => ({
			conversations: state.conversations.map((conversation) =>
				toId(conversation._id) === toId(conversationId) ? { ...conversation, unreadCount: 0 } : conversation
			),
		})),
	updateConversationOnNewMessage: ({ conversationId, messageText, createdAt, incrementUnread = false }) =>
		set((state) => {
			const updatedConversations = state.conversations.map((conversation) => {
				if (toId(conversation._id) !== toId(conversationId)) return conversation;
				return {
					...conversation,
					lastMessage: messageText,
					lastMessageAt: createdAt,
					unreadCount: incrementUnread ? (conversation.unreadCount || 0) + 1 : conversation.unreadCount || 0,
				};
			});

			return { conversations: sortConversations(updatedConversations) };
		}),
	messages: [],
	setMessages: (messagesOrUpdater) =>
		set((state) => ({
			messages:
				typeof messagesOrUpdater === "function"
					? messagesOrUpdater(state.messages)
					: messagesOrUpdater,
		})),
}));

export default useConversation;
