import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
	const { loading, logout } = useLogout();

	return (
		<div className='mt-auto pt-3'>
			{!loading ? (
				<button
					type='button'
					onClick={logout}
					className='w-full btn btn-sm rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100'
				>
					<BiLogOut className='w-5 h-5' />
					Logout
				</button>
			) : (
				<span className='loading loading-spinner mx-auto block'></span>
			)}
		</div>
	);
};
export default LogoutButton;
