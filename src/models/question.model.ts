import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }], // Array of answer choices
    correctAnswer: { type: String, required: true },
    negativeMarks: { type: Number, default: 0 },
    hint: { type: String }, // Optional hint for the question
    explaination: { type: String }, // Optional explanation for the correct answer
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);
