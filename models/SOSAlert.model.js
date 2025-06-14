import mongoose from "mongoose";

const sosAlertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ['medical', 'fire', 'security'],
        required: true
    },
    isResolved: {
        type: Boolean,
        default: false
    },
    respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const SOSAlert=mongoose.model("SOSAlert", sosAlertSchema);
export default SOSAlert