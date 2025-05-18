import dbConnect from "@/config/dbConnect";
import { isStudent } from "@/middlewares/authMiddleware";
import examModel from "@/models/exam.model";
import examAttemptModel from "@/models/examAttempt.model";
import questionModel from "@/models/question.model";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string;
        role: string;
    }
}

export const POST = async (req: requestType, { params }: { params: Promise<{ id: string }> }) => {
    try {

        await dbConnect();

        const authResponse = isStudent(req);
        if (authResponse instanceof NextResponse) {
            return authResponse
        }

        const { examAttemptId, questionId } = await req.json();
        const { id: examId } = await params;

        const examAttempt = await examAttemptModel.findById(examAttemptId);
        if (!examAttempt) {
            return NextResponse.json({ success: false, message: "Exam attempt not found" }, { status: 404 })
        }

        const exam = await examModel.findById(examId);
        if (!exam) {
            return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 })
        }

        if (examAttempt.hintsUsed >= exam.hints) {
            return NextResponse.json({ success: false, message: "No hints left" }, { status: 400 })
        }

        const question = await questionModel.findById(questionId);
        if (!question) {
            return NextResponse.json({ success: false, message: "Question not found" }, { status: 404 })
        }
        console.log("question:  ", question);
        if (!question.hint) {
            return NextResponse.json({ success: false, message: "No hint found" }, { status: 404 })
        }

        const hint = question.hint;
        examAttempt.hintsUsed = examAttempt.hintsUsed + 1;

        await examAttempt.save();

        return NextResponse.json({ success: true, message: "Hint used successfully", data: { hint } }, { status: 200 });

    } catch (error) {
        console.log("something went wrong while fetching the hint");
        return NextResponse.json({ success: false, message: 'something went wrong while fetching the hint' }, { status: 500 });
    }
}