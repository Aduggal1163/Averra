import mongoose from 'mongoose';
const PollSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true,
        trim:true
    },
    options:[
        {
            text:{
                type:String,
                required:true,
            },
            votes:{
                type:Number,
                required:true
            }
        }
    ],
    votes:[
        {
            user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
    },
    option: String
        }
    ],
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    voters:[
     { 
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
     }
    ],
    expiresAt:{
        type:Date,
        required:true
    }
})
const Poll=mongoose.model("Poll",PollSchema);
export default Poll;