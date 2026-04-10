import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { setMessages, selectedConversation, updateConversationOnNewMessage } = useConversation();

	const sendMessage = async (message) => {
		setLoading(true);
		try {
			const endpoint = selectedConversation.isGroup
				? `/api/messages/group/send/${selectedConversation._id}`
				: `/api/messages/send/${selectedConversation._id}`;

			const res = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setMessages((prevMessages) => [...prevMessages, data]);
			updateConversationOnNewMessage({
				conversationId: selectedConversation._id,
				messageText: data.message,
				createdAt: data.createdAt,
				incrementUnread: false,
			});
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;
