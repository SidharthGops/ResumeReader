import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema({
    email: {
        type: String,
        ref: 'User',
        required: true
    },
    resumeText: {
        type: String,
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    matchedSkills: [String],
    gaps: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;