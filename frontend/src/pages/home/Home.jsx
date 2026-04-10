import Sidebar from "../../components/sidebar/Sidebar";
import MessageContainer from "../../components/messages/MessageContainer";
import useConversation from "../../zustand/useConversation";

const Home = () => {
	const { selectedConversation } = useConversation();

	return (
		<div className='w-full max-w-6xl h-[calc(100vh-1.5rem)] sm:h-[88vh] rounded-2xl overflow-hidden border border-slate-700/70 bg-slate-900/75 backdrop-blur-xl shadow-[0_20px_80px_-30px_rgba(0,0,0,0.8)]'>
			<div className='flex h-full w-full'>
				<div className={`${selectedConversation ? "hidden sm:flex" : "flex"} h-full w-full sm:w-[340px] md:w-[360px]`}>
					<Sidebar />
				</div>
				<div className={`${selectedConversation ? "flex" : "hidden sm:flex"} h-full flex-1 min-w-0 bg-slate-950/35`}>
					<MessageContainer />
				</div>
			</div>
		</div>
	);
};
export default Home;