import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../../zustand/useConversation";

const CreateGroupModal = () => {
	const [open, setOpen] = useState(false);
	const [groupName, setGroupName] = useState("");
	const [selectedUserIds, setSelectedUserIds] = useState([]);
	const [loading, setLoading] = useState(false);
	const { conversations, setConversations } = useConversation();

	const users = useMemo(() => conversations.filter((conversation) => !conversation.isGroup), [conversations]);

	const toggleUser = (userId) => {
		setSelectedUserIds((prev) =>
			prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
		);
	};

	const resetForm = () => {
		setGroupName("");
		setSelectedUserIds([]);
	};

	const handleCreateGroup = async (e) => {
		e.preventDefault();
		if (!groupName.trim()) {
			toast.error("Please enter group name");
			return;
		}

		if (selectedUserIds.length < 2) {
			toast.error("Select at least 2 users");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/messages/groups", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					groupName: groupName.trim(),
					participantIds: selectedUserIds,
				}),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setConversations([...conversations, data]);
			toast.success("Group created");
			setOpen(false);
			resetForm();
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<button
				type='button'
				onClick={() => setOpen(true)}
				className='btn btn-xs rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-500'
			>
				New Group
			</button>

			{open ? (
				<div className='fixed inset-0 bg-black/65 flex items-center justify-center z-50 px-3'>
					<form
						onSubmit={handleCreateGroup}
						className='w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl'
					>
						<div className='flex items-center justify-between mb-3'>
							<h3 className='text-base font-semibold text-slate-100'>Create Group</h3>
							<button
								type='button'
								onClick={() => {
									setOpen(false);
									resetForm();
								}}
								className='btn btn-xs btn-ghost'
							>
								Close
							</button>
						</div>

						<input
							type='text'
							value={groupName}
							onChange={(e) => setGroupName(e.target.value)}
							placeholder='Group name'
							className='input input-bordered w-full bg-slate-800 border-slate-600 mb-3'
						/>

						<div className='text-xs text-slate-400 mb-2'>Select users (minimum 2)</div>
						<div className='max-h-52 overflow-auto border border-slate-700 rounded-xl p-2 space-y-1'>
							{users.length === 0 ? (
								<div className='text-sm text-slate-400 px-2 py-3'>No users available</div>
							) : (
								users.map((user) => (
									<label
										key={user._id}
										className='flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-800 cursor-pointer'
									>
										<input
											type='checkbox'
											checked={selectedUserIds.includes(user._id)}
											onChange={() => toggleUser(user._id)}
											className='checkbox checkbox-xs'
										/>
										<span className='text-sm text-slate-100 truncate'>
											{user.displayName || user.fullName || user.username}
										</span>
									</label>
								))
							)}
						</div>

						<div className='mt-4 flex justify-end'>
							<button
								type='submit'
								disabled={loading}
								className='btn btn-sm rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-500'
							>
								{loading ? <span className='loading loading-spinner loading-xs'></span> : "Create"}
							</button>
						</div>
					</form>
				</div>
			) : null}
		</>
	);
};

export default CreateGroupModal;
