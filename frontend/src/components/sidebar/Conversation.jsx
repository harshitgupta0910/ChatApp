import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx }) => {
	const { selectedConversation, setSelectedConversation, markConversationAsRead } = useConversation();

	const isSelected = selectedConversation?._id === conversation._id;
	const { onlineUsers } = useSocketContext();
	const isOnline = !conversation.isGroup && onlineUsers.includes(conversation._id);
	const displayName = conversation.displayName || conversation.fullName || conversation.username || "Unknown user";
	const unreadCount = conversation.unreadCount || 0;
	const subtitle = conversation.lastMessage || (conversation.isGroup ? "Group chat" : isOnline ? "Online" : "Offline");
	const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
		displayName
	)}&background=0D8ABC&color=ffffff`;

	return (
		<>
			<div
				className={`group flex gap-3 items-center rounded-xl px-3 py-2 cursor-pointer border transition-all duration-200
				${
					isSelected
						? "bg-cyan-600/20 border-cyan-400/50"
						: "bg-slate-900/30 border-transparent hover:bg-slate-800/70 hover:border-slate-600/50"
				}
			`}
				onClick={() => {
					setSelectedConversation(conversation);
					markConversationAsRead(conversation._id);
				}}
			>
				<div className='relative avatar'>
					<div className='w-12 rounded-full'>
						<img
							src={conversation.profilePic || fallbackAvatar}
							onError={(e) => {
								e.currentTarget.src = fallbackAvatar;
							}}
							alt='user avatar'
						/>
					</div>
					<span
						className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
							isOnline ? "bg-emerald-400" : "bg-slate-500"
						}`}
					></span>
				</div>

				<div className='flex flex-col flex-1 min-w-0'>
					<div className='flex items-center justify-between gap-2'>
						<p className='font-semibold text-slate-100 truncate'>{displayName}</p>
						{unreadCount > 0 ? (
							<span className='min-w-5 h-5 px-1.5 rounded-full bg-cyan-500 text-[11px] text-white font-bold flex items-center justify-center'>
								{unreadCount > 99 ? "99+" : unreadCount}
							</span>
						) : null}
					</div>
					<p className='text-xs text-slate-400 truncate'>{subtitle}</p>
				</div>
			</div>

			{!lastIdx && <div className='mx-3 border-b border-slate-800/60' />}
		</>
	);
};
export default Conversation;

// STARTER CODE SNIPPET
// const Conversation = () => {
// 	return (
// 		<>
// 			<div className='flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer'>
// 				<div className='avatar online'>
// 					<div className='w-12 rounded-full'>
// 						<img
// 							src='https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'
// 							alt='user avatar'
// 						/>
// 					</div>
// 				</div>

// 				<div className='flex flex-col flex-1'>
// 					<div className='flex gap-3 justify-between'>
// 						<p className='font-bold text-gray-200'>John Doe</p>
// 						<span className='text-xl'>🎃</span>
// 					</div>
// 				</div>
// 			</div>

// 			<div className='divider my-0 py-0 h-1' />
// 		</>
// 	);
// };
// export default Conversation;






// STARTER CODE SNIPPET
// const Conversation = () => {
// 	return (
// 		<>
// 			<div className='flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer'>
// 				<div className='avatar online'>
// 					<div className='w-12 rounded-full'>
// 						<img
// 							src='https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'
// 							alt='user avatar'
// 						/>
// 					</div>
// 				</div>

// 				<div className='flex flex-col flex-1'>
// 					<div className='flex gap-3 justify-between'>
// 						<p className='font-bold text-gray-200'>John Doe</p>
// 						<span className='text-xl'>🎃</span>
// 					</div>
// 				</div>
// 			</div>

// 			<div className='divider my-0 py-0 h-1' />
// 		</>
// 	);
// };
// export default Conversation;