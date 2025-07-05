import mongoose from "mongoose";
const contactModel =new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    feedback:String,
    ratings:{
        type:Number,
    }
},{ timestamps: true })
const Contact=mongoose.model('Contact',contactModel);
export default Contact;