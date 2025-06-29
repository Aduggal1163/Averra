import Complaint from "../models/Complaint.model.js";
export const raiseComplaint = async (req,res)=>{
    try {
        const {issue,urgency} = req.body;
        const userId  = req.user.id;
        const image= req.file ? req.file.path : null;
        if(!issue || !urgency)
        {
            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }
        const complaint = await Complaint.create({
            issue:issue,
            urgency:urgency,
            userId ,
            image:image
        })
        res.status(201).json({
            message: "Complaint raised successfully",
            complaint
        });
    } catch (error) {
        console.error("Raise Complaint Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
    }
}
export const getComplaints = async(req,res)=>{
    try {
        const { userId } = req.params;
    const complaints = await Complaint.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ complaints });
    } catch (error) {
        console.error("Fetch Complaints Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
    }
}
export const getAllComplaints = async (req, res) => {
  try {
    // Only admin or guard should be allowed
    const userRole = req.user.role;

    if (userRole !== 'admin' && userRole !== 'guard') {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const complaints = await Complaint.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email houseNumber");

    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Fetch All Complaints Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateComplaintStatus = async(req,res)=>{
    try {
        const {complaintId}=req.params;
        const {status}=req.body;
        // const userId=req.user.id;
        if (!['in_progress', 'resolved', 'cancelled'].includes(status))
        {
            return res.status(400).json({
                message: "Invalid status"
            })
        }
        const complaint= await Complaint.findById(complaintId);
        if(!complaint)
        {
            return res.status(401).json({
                message: "Complaint not found"
            })
        }
        if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Not authorized to update this complaint'
     });
    }
     if(complaint.status === 'resolved')
     {
        return res.status(400).json({ message: 'Complaint already resolved' });
     }
    complaint.status = status;
    await complaint.save();
    res.status(200).json({
      message: `Complaint marked as ${status}`,
      complaint,
    });
    } catch (error) {
        console.error("Update Complaint Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
    }
}