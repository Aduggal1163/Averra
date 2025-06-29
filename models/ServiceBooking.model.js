import mongoose from 'mongoose';
const serviceBookingSchema=new mongoose.Schema({
    resident_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    serviceprovider_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    service: {
        type: String,
        enum: ['plumber', 'electrician', 'housekeeping', 'cook', 'tutor'],
        required: true
    },
    status:{
        type:String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
        required:true
    },
    dateTime:{
        type:Date,
        required:true
    }
},{timestamps:true})

const serviceBooking=mongoose.model('serviceBooking',serviceBookingSchema);
export default serviceBooking