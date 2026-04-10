import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password").lean();

		const validUsers = filteredUsers.filter((user) => {
			const fullName = user.fullName?.trim();
			const username = user.username?.trim();
			const email = user.email?.trim();
			return Boolean(user._id && (fullName || username || email));
		});

		res.status(200).json(validUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
