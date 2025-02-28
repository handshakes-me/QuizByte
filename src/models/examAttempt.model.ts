import mongoose from "mongoose";

const ExamAttemptSchema = new mongoose.Schema({
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    startTime: { type: Date, default: Date.now }, // When student started the exam
    status: { type: String, enum: ["pending", "completed", "auto-submitted"], default: "pending" },
    submittedAt: { type: Date },
    timeTaken: { type: Number }, // Time taken in seconds
    totalMarks: { type: Number, required: true }, // Same as exam's totalMarks
    obtainedMarks: { type: Number, default: 0 }, // Student’s actual score
    attemptedQuestions: [
        {
            questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
            selectedAnswer: { type: String, required: true },
            isCorrect: { type: Boolean, required: true } // Backend will validate and update this
        }
    ],
    autoSubmitted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.ExamAttempt || mongoose.model("ExamAttempt", ExamAttemptSchema);