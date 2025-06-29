import User from '../models/User.model.js';
export const getAllUsersWithRole = async(req,res)=>{
    try {
        const {role} = req.params;
        console.log(role);
        if(!role)
        {
            return res.status(400).json({
                message: "Role is required"
            })
        }
        const Users = await User.find({role}).select("-password");
        console.log(Users);
        if (Users.length === 0) {
            return res.status(404).json({ message: "No users found with the specified role" });
        }
        return res.status(200).json({
            message: "Users fetched successfully",
            users: Users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");;
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json({
            message: "Users fetched successfully",
            users: users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getUserById = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id)
        {
            return res.status(400).json({
                message: "User ID is required"
            })
        }
        const user=await User.findById(id).select("-password");;
        if(!user)
        {
            return res.status(404).json({
                message: "User not found"
            });
        }
        return res.status(200).json({
            message: "User fetched successfully",
            user: user
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fields allowed to update
        const { name, email, houseNumber, phone } = req.body;

        // Find user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Optional: Only admin or user can edit
        if (req.user.role !== 'admin' && req.user.id !== user.id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this user" });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (houseNumber) user.houseNumber = houseNumber;
        if (phone) user.phone = phone;

        await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user: user
        });
    } catch (error) {
        console.error("Update User Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
