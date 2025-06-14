import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength:3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['resident', 'admin', 'guard', 'service_provider'],
        default: 'resident',
        required: true
    },
    houseNumber: {
        type: String,
        required:function(){
            return this.role=='resident'
        }
    },
    services_offered: {
        type: [String],
        enum: ['plumber', 'electrician', 'housekeeping', 'cook', 'tutor'],
        required: function () {
            return this.role === 'service_provider'
        }
    },
    availability: {
        type: Boolean,
        default: false
    },
    assignedHouseNo:{
        type:String,
    },
    
}, { timestamps: true })

const User= mongoose.model('user',userModel);
export default User;