import mongoose from "mongoose";

const visitorPassSchema = new mongoose.Schema({
    residentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    visitorName: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    guardComments: {
        type: String
    }
}, { timestamps: true });

export default Visitor= mongoose.model("VisitorPass", visitorPassSchema);
