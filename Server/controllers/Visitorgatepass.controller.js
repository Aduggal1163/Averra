import VisitorGatePass from "../models/VisitorPass.model.js";
// Resident requests a gatepass
export const requestVisitorGatePass = async (req, res) => {
    try {
        const { visitorName, visitPurpose, visitTime, guardComments } = req.body;
        const residentId = req.user.id;
        const gatepass = await VisitorGatePass.create({
            visitorName, visitPurpose, visitTime, guardComments, residentId
        })
        return res.status(201).json({
            message: "Visitor Gate Pass Requested Successfully",
            data: gatepass
        })
    } catch (error) {
        console.error("Request Gatepass Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
// Guard views all gatepass requests
export const viewAllVisitorGatepass = async (req, res) => {
    try {
        const gatepass = await VisitorGatePass.find()
            .populate('residentId', 'name houseNumber')
            .sort({ createdAt: -1 });
        return res.status(200).json({
            message: "All Visitor Gate Pass Requests",
            data: gatepass
        })
    } catch (error) {
        console.error("Get Gatepass Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const viewAllPendingGatepass=async(req,res)=>{
    try {
        if(req.user.role != 'guard')
        {
            return res.status(403).json({
                message:"Only guard can see the pending gatepasses"
            })
        }
        const pendinggatepass = await VisitorGatePass.find({status:'pending'})
        .populate('residentId', 'name houseNumber')
        .sort({ createdAt: -1 });
        return res.status(200).json({
            message:"All pending gatepass retrieved",
            pendinggatepass
        })
    } catch (error) {
        console.error("Get pending Gatepass Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
// Guard accepts/rejects gatepass
export const acceptRejectVisitorGatepass = async (req, res) => {
    try {
        const { gatepassId } = req.params;
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
            })
        }
        const gatepass = await VisitorGatePass.findById(gatepassId);
        if (!gatepass) {
            return res.status(404).json({
                message: "Gate Pass Not Found",
            })
        }
        if (gatepass.status == 'approved') {
            return res.status(400).json({
                message: "Gate Pass Already Approved",
            })
        }
        if (req.user.role !== 'guard') {
            return res.status(403).json({
                message: "Not Authorized"
            })
        }
        gatepass.status = status;
        await gatepass.save();
        return res.status(200).json({
            message: `Gate Pass Status Updated to ${status}`,
        })
    } catch (error) {
        console.error("Update Gatepass Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
//retrive my gatepass
export const getMyGatepass = async (req, res) => {
    try {
        const residentId = req.user.id;
        const gatepass = await VisitorGatePass.find({residentId}).sort({ createdAt: -1 });
        if (!gatepass) {
            return res.status(404).json({
                message: "Gate Pass Not Found",
            })
        }
        return res.status(200).json({
            message: "Gatepass retrieved successfully",
            gatepass
        })
    } catch (error) {
        console.error("Get Resident Gatepasses Error:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}
// visitor log
// In your controller
export const getTodaysVisitorLog = async (req, res) => {
  try {
    // Get today's date at midnight (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Get tomorrow's date at midnight (end of today)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const logs = await VisitorGatePass.find({
      visitTime: {
        $gte: today,
        $lt: tomorrow
      }
    })
      .populate('residentId', 'name houseNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({ visitorLog: logs });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

