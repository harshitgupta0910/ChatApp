import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import CreateGroupModal from "./CreateGroupModal";

const Sidebar = () => {
	return (
		<div className='w-full h-full border-r border-slate-700/70 p-3 sm:p-4 flex flex-col bg-slate-950/40'>
			<div className='mb-3 flex items-center justify-between gap-2'>
				<h2 className='text-sm tracking-wide uppercase text-slate-400'>Chats</h2>
				<CreateGroupModal />
			</div>
			<SearchInput />
			<div className='my-3 border-b border-slate-700/70'></div>
			<Conversations />
			<LogoutButton />
		</div>
	);
};
export default Sidebar;






// STARTER CODE FOR THIS FILE
// import SearchInput from "./SearchInput";
// import Conversations from "./Conversations";
// import LogoutButton from "./LogoutButton";

// const Sidebar = () => {
// 	return (
// 		<div className='border-r border-slate-500 p-4 flex flex-col'>
// 			<SearchInput />
// 			<div className='divider px-3'></div>
//              <Conversations />
//              <LogoutButton />
// 		</div>
// 	);
// };
// export default Sidebar;