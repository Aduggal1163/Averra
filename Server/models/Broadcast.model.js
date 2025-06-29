import mongoose from "mongoose";
const broadcastSchema = new mongoose.Schema({
    adminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    message:{
        type: String,
        required: true,
    },
    image:{
        type: String,
    },
    type:{
        type: String,
        enum: ['info', 'warning', 'error'],
        default: 'info',
        required:true
    },
    category:{
        type:String,
        enum : ['post','event'],
        required: true
    },
    createdAt: {
    type: Date,
    default: Date.now
  }
},{timestamps: true});
const Broadcast = mongoose.model("Broadcast", broadcastSchema);
export default Broadcast;