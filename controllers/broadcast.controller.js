import Broadcast from "../models/Broadcast.model.js";
export const createBroadcast = async (req, res) => {
    try {
        const { title, message, type, category, createdAt } = req.body;
        const adminId = req.user.id; // Assuming user ID is stored in req.user after authentication
        if (!title || !message || !type || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!['info', 'warning', 'error'].includes(type)) {
            return res.status(400).json({
                message: "Invalid type"
            })
        }
        if (!['post', 'event'].includes(category)) {
            return res.status(400).json({
                message: "Invalid Category"
            })
        }
        if (req.user.role != 'admin') return res.status(403).json({
            message: "Unauthorized: Admins only"
        })
        const image = req.file ? req.file.path : null;
        const broadcast = await Broadcast.create({
            title,
            message,
            type,
            category,
            image,
            postedBy: adminId
        })
        return res.status(201).json({
            message: "Broadcast created successfully",
            broadcast
        })
    } catch (error) {
        console.error("Error creating broadcast:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getAllBroadcasts = async (req, res) => {
    try {
        const broadcasts = await Broadcast.find().sort({ createdAt: -1 }).populate("adminId", "name email");
        if (broadcasts.length == 0) {
            return res.status(404).json({
                message: "No broadcasts found"
            })
        }
        return res.status(200).json({
            message: "Broadcasts fetched successfully",
            broadcasts
        })
    } catch (error) {
        console.error("Fetch Broadcasts Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const deleteBroadcast = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role != 'admin') {
            return res.status(403).json({
                message: "Unauthorized : admins only"
            })
        }
        const broadcasts = await Broadcast.findById(id);
        if (!broadcasts) {
            return res.status(404).json({
                message: "Broadcasts not found"
            })
        }
        await broadcasts.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Broadcast deleted successfully"
        })
    } catch (error) {
        console.error("Delete Broadcast Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const updateBroadcast = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role != 'admin') {
            return res.status(403).json({
                message: "Unauthorized: Admins only"
            })
        }
        const { title, message, type, category } = req.body;
        const updatedData = {};
        if (title) updatedData.title = title;
        if (message) updatedData.message = message;
        if (type) {
            if (!["info", "warning", "error"].includes(type)) {
                return res.status(400).json({ message: "Invalid type" });
            }
            updatedData.type = type;
        }
        if (category)
        {
            if(!['post','event'].includes('category'))
            {
                return res.status(400).json({
                    message:"Invalid Category"
                })
            }
            updatedData.category = category;
        }
        const updatedBroadcast= await Broadcast.findByIdAndUpdate(id,updatedData,{new:true});
        if(!updatedBroadcast)
        {
            return res.status(404).json({
                "message":"Broadcast not found"
            })
        }
         res.status(200).json({
      message: "Broadcast updated successfully",
      broadcast: updatedBroadcast
    });
  } 
  catch (error) {
    console.error("Update Broadcast Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}