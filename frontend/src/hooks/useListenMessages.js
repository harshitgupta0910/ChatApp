import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { setMessages, selectedConversation, updateConversationOnNewMessage } = useConversation();

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			newMessage.shouldShake = true;
			const sound = new Audio(notificationSound);
			sound.play();

			const isGroupMessage = Boolean(newMessage.isGroup);
			const conversationId = isGroupMessage
				? String(newMessage.conversationId)
				: String(newMessage.senderId);
			const selectedId = selectedConversation?._id ? String(selectedConversation._id) : "";
			const isSameOpenConversation = selectedId && selectedId === conversationId;

			if (isSameOpenConversation) {
				setMessages((prevMessages) => [...prevMessages, newMessage]);
			}

			updateConversationOnNewMessage({
				conversationId,
				messageText: newMessage.message,
				createdAt: newMessage.createdAt,
				incrementUnread: !isSameOpenConversation,
			});
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, selectedConversation?._id, updateConversationOnNewMessage]);
};
export default useListenMessages;
