import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation, markConversationAsRead } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			try {
				const endpoint = selectedConversation.isGroup
					? `/api/messages/group/${selectedConversation._id}`
					: `/api/messages/${selectedConversation._id}`;
				const res = await fetch(endpoint);
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				setMessages(data);
				markConversationAsRead(selectedConversation._id);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (selectedConversation?._id) getMessages();
	}, [selectedConversation?._id, selectedConversation?.isGroup, setMessages, markConversationAsRead]);

	return { messages, loading };
};
export default useGetMessages;
