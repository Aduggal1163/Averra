import SOSAlert from "../models/SOSAlert.model.js";
export const createSOSAlert=async(req,res)=>{
    try {
        const {type}= req.body;
        const userId=req.user.id;
        if(!type)
        {
            return res.status(400).json({
                "message":"Write type of alert you want to create"
            })
        }
        if(!['medical','fire','security'].includes(type))
        {
            return res.status(400).json({ message: 'Invalid alert type' });
        }
    const alert = await SOSAlert.create({
      userId,
      type
    });

    res.status(201).json({
      message: 'SOS alert created successfully',
      alert
    });
  } catch (error) {
    console.error('Create SOS Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
export const getAllSOSAlerts = async (req, res) => {
  try {
    const alerts = await SOSAlert.find()
      .populate('userId', 'name role') // optional
      .populate('respondedBy', 'name role') // optional
      .sort({ createdAt: -1 });

    res.status(200).json({ message: 'Alerts fetched', alerts });
  } catch (error) {
    console.error('Get SOS Alerts Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export const respondToSOSAlert=async(req,res)=>{
    try{
    const {alertId}=req.params;
    const respondedId=req.user.id;
    if(!alertId)
    {
        return res.status(400).json({
            message:"Alert id is req"
        })
    }
    const alert=await SOSAlert.findById(alertId);
    if (!alert) {
      return res.status(404).json({ message: 'SOS alert not found' });
    }
    if(alert.isResolved)
    {
        return res.status(400).json({
            message:"This alert is already resolved"
        })
    }
    alert.resovledBy=respondedId;
    alert.isResolved=true;
    await alert.save();
    res.status(200).json({
      message: 'You have successfully responded to the alert',
      alert
    });
  } 
  catch (error) {
    console.error('Respond to SOS Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}