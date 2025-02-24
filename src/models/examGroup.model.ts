import mongoose from "mongoose";

const ExamGroupSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., "Semester 1"
    description: { type: String },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
    exams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exam" }], // List of subject-wise exams
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // List of students in the group
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }], // List of subjects in the group
}, { timestamps: true });

export default mongoose.models.ExamGroup || mongoose.model("ExamGroup", ExamGroupSchema);