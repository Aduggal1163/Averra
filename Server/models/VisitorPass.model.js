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
    visitPurpose: {
        type: String,
        required: true
    },
    visitTime: {
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

const Visitor = mongoose.model("VisitorPass", visitorPassSchema);
export default Visitor