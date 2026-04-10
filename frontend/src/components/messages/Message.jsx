import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../utils/extractTime";

const Message = ({ message }) => {
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const fallbackName = fromMe
		? authUser.fullName || authUser.username
		: selectedConversation?.displayName || selectedConversation?.fullName || selectedConversation?.username;
	const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
		fallbackName || "User"
	)}&background=155e75&color=ffffff`;
	const bubbleBgColor = fromMe ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-100";

	const shakeClass = message.shouldShake ? "shake" : "";

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img
						alt='chat avatar'
						src={profilePic || fallbackAvatar}
						onError={(e) => {
							e.currentTarget.src = fallbackAvatar;
						}}
					/>
				</div>
			</div>
			<div className={`chat-bubble ${bubbleBgColor} ${shakeClass} pb-2 shadow-md`}>{message.message}</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
		</div>
	);
};
export default Message;
