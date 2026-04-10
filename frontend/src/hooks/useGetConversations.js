import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";

const getDisplayName = (user) => {
	if (user?.fullName?.trim()) return user.fullName.trim();
	if (user?.username?.trim()) return user.username.trim();
	if (user?.email?.trim()) return user.email.trim();
	return "";
};

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const { conversations, setConversations } = useConversation();

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const [usersRes, groupsRes] = await Promise.all([fetch("/api/user"), fetch("/api/messages/groups")]);
				const [usersData, groupsData] = await Promise.all([usersRes.json(), groupsRes.json()]);

				if (usersData.error) throw new Error(usersData.error);
				if (groupsData.error) throw new Error(groupsData.error);

				const users = Array.isArray(usersData) ? usersData : [];
				const uniqueUsers = [];
				const seenIds = new Set();

				for (const user of users) {
					if (!user?._id || seenIds.has(user._id)) continue;
					const displayName = getDisplayName(user);
					if (!displayName) continue;
					seenIds.add(user._id);
					uniqueUsers.push({
						...user,
						isGroup: false,
						displayName,
						unreadCount: 0,
						lastMessage: "",
						lastMessageAt: null,
					});
				}

				const groups = (Array.isArray(groupsData) ? groupsData : []).map((group) => ({
					...group,
					isGroup: true,
					displayName: group.displayName || group.groupName || "Unnamed Group",
					unreadCount: group.unreadCount || 0,
					lastMessage: group.lastMessage || "",
					lastMessageAt: group.lastMessageAt || null,
				}));

				setConversations([...groups, ...uniqueUsers]);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		if (conversations.length === 0) getConversations();
	}, [conversations.length, setConversations]);

	return { loading, conversations };
};
export default useGetConversations;

