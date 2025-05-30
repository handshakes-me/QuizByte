import mongoose from "mongoose";
import '@/models/subject.model'

const ExamGroupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., "Semester 1"
    description: { type: String },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    exams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exam" }], // List of subject-wise exams
    students: [
        {
            name: { type: String, required: true },
            email: { type: String, required: true },
            prn: { type: String, required: true},
            joined: { type: Date, default: Date.now }
        }
    ], // List of students in the group
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "INACTIVE"
    },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }], // List of subjects in the group
}, { timestamps: true });

export default mongoose.models.ExamGroup || mongoose.model("ExamGroup", ExamGroupSchema); 