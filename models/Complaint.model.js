import mongoose from 'mongoose';
const complaintSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    image:{
        type:String,
    },
    issue:{
        type:String,
        required:true,
    },
    urgency: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved'],
        default: 'open'
    }
},{timestamps:true});

const Complaint=mongoose.model("Complaint",complaintSchema);
export default Complaint