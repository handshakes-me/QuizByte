import mongoose from "mongoose";
import '@/models/question.model'

const ExamSchema = new mongoose.Schema({
    title: { type: String, required: true }, // e.g., "Mathematics"
    description: { type: String },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    examGroupId: { type: mongoose.Schema.Types.ObjectId, ref: "ExamGroup" }, // Links to Exam Group
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, required: true }, // Time in minutes
    totalMarks: { type: Number, required: true }, // Total marks for the entire exam nu
    numberOfQuestions: { type: Number, required: true },
    marksPerQuestion: { type: Number, required: true },
    passingMarks: { type: Number, required: true },
    hints: { type: Number, default: 0 },
    status: { type: String, enum: ["scheduled", "ongoing", "finished", "cancelled"], default: "scheduled" },
    isResultPublished: { type: Boolean, default: false },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }], // List of questions can be more than the number of questions for shuffled questions
    attemptCount: { type: Number, default: 1 }
}, { timestamps: true });

export default mongoose.models.Exam || mongoose.model("Exam", ExamSchema);