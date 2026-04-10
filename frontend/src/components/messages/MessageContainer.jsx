import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { IoArrowBack } from "react-icons/io5";
import { useSocketContext } from "../../context/SocketContext";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation } = useConversation();
	const { onlineUsers } = useSocketContext();
	const isGroup = Boolean(selectedConversation?.isGroup);
	const isOnline = selectedConversation ? !isGroup && onlineUsers.includes(selectedConversation._id) : false;
	const selectedName = selectedConversation?.displayName || selectedConversation?.fullName || selectedConversation?.username;

	useEffect(() => {
		// cleanup function for restore selected user 
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	return (
		<div className='w-full min-w-0 flex flex-col'>
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					<div className='bg-slate-900/70 border-b border-slate-700 px-3 sm:px-4 py-3 mb-2 flex items-center justify-between gap-2'>
						<div className='flex items-center gap-2 min-w-0'>
						<button
							type='button'
							onClick={() => setSelectedConversation(null)}
							className='sm:hidden btn btn-ghost btn-xs px-1'
						>
							<IoArrowBack className='text-lg' />
						</button>
						<div className='min-w-0'>
							<p className='text-xs uppercase tracking-wide text-slate-400'>Conversation</p>
							<p className='text-slate-100 font-semibold truncate'>{selectedName}</p>
						</div>
						</div>
						<span
							className={`text-xs px-2 py-1 rounded-full border ${
								isGroup
									? "text-cyan-300 border-cyan-400/40 bg-cyan-500/10"
									: isOnline
									? "text-emerald-300 border-emerald-400/40 bg-emerald-500/10"
									: "text-slate-400 border-slate-600 bg-slate-700/40"
							}`}
						>
							{isGroup ? `Group • ${selectedConversation?.memberCount || 0} members` : isOnline ? "Online" : "Offline"}
						</span>
					</div>
					<Messages />
					<MessageInput />
				</>
			)}
		</div>
	);
};
export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className='flex items-center justify-center w-full h-full'>
			<div className='px-4 text-center sm:text-lg text-slate-200 font-semibold flex flex-col items-center gap-2'>
				<p>Welcome, {authUser.fullName}</p>
				<p className='text-slate-400 text-sm font-normal'>Select a real account from the left to start chatting.</p>
				<TiMessages className='text-4xl md:text-6xl text-cyan-300' />
			</div>
		</div>
	);
};




// STARTER CODE SNIPPET
// import Messages from "./Messages";
// import MessageInput from "./MessageInput";

// const MessageContainer = () => {
// 	return (
// 		<div className='md:min-w-[450px] flex flex-col'>
// 			<>
// 				{/* Header */}
// 				<div className='bg-slate-500 px-4 py-2 mb-2'>
// 					<span className='label-text'>To:</span> <span className='text-gray-900 font-bold'>John doe</span>
// 				</div>

// 				<Messages />
// 				<MessageInput />
// 			</>
// 		</div>
// 	);
// };
// export default MessageContainer;