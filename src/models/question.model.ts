import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }], // Array of answer choices
    correctAnswer: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);
