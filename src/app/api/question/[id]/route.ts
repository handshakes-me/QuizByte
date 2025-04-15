import dbConnect from "@/config/dbConnect";
import { isAdmin } from "@/middlewares/authMiddleware";
import examModel from "@/models/exam.model";
import questionModel from "@/models/question.model";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string,
        role: string
    }
}

export const PATCH = async (req: requestType, { params }: { params: Promise<{ id: string }> }) => {
    try {

        // db connect
        await dbConnect();

        // auth 
        const authResponse = isAdmin(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        const { id: userId } = req?.user

        // get data
        const { id: questionId } = await params;

        const { questionText, options, correctAnswer, hint, explaination } = await req.json()

        const question = await questionModel.findById(questionId);

        if (!question) {
            return NextResponse.json({
                success: false,
                message: "Question not found"
            }, { status: 404 })
        }

        const exam = await examModel.findById(question.examId)
        if (!exam) {
            return NextResponse.json({
                success: false,
                message: "Exam not found"
            }, { status: 404 })
        }

        if (exam.adminId.toString() !== userId) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }

        // validate correct answer
        if (correctAnswer && options) {
            const correctAnswerExists = options.some((op: string) => op === correctAnswer);
            if (!correctAnswerExists) {
                return NextResponse.json({
                    success: false,
                    message: "Correct answer must be one of the options"
                }, { status: 400 })
            }
        } else if (correctAnswer && !options) {
            const correctAnswerExists = question.options.find((op: string) => op === correctAnswer)
            if (!correctAnswerExists) {
                return NextResponse.json({
                    success: false,
                    message: "Correct answer must be one of the options"
                }, { status: 400 })
            }
        }

        // update question
        question.questionText = questionText || question.questionText
        question.options = options || question.options
        question.correctAnswer = correctAnswer || question.correctAnswer
        question.hint = hint || question.hint
        question.explaination = explaination || question.explaination

        // save updated question
        await question.save();

        return NextResponse.json({
            success: true,
            message: "Question updated successfully",
            data: question
        }, { status: 200 })

    } catch (error) {
        console.log("Error : ", error)
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
            error: error
        }, { status: 500 })
    }
}

export const DELETE = async (req: requestType, { params }: { params: Promise<{ id: string }> }) => {
    try {

        // db connect
        await dbConnect();

        // auth
        const authResponse = isAdmin(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        const { id: userId } = req?.user

        // get data
        const { id: questionId } = await params;

        const question = await questionModel.findById(questionId);

        if (!question) {
            return NextResponse.json({
                success: false,
                message: "Question not found"
            }, { status: 404 })
        }

        const exam = await examModel.findById(question.examId)
        if (!exam) {
            return NextResponse.json({
                success: false,
                message: "Exam not found"
            }, { status: 404 })
        }

        if (exam.adminId.toString() !== userId) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }

        // delete question
        await question.deleteOne();

        // remove question ref from exam model
        exam.questions = exam.questions.filter((q: any) => q.toString() !== questionId)
        await exam.save()

        return NextResponse.json({
            success: true,
            message: "Question deleted successfully"
        }, { status: 200 })

    } catch (error) {
        console.log("Error : ", error)
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
            error: error
        }, { status: 500 })
    }
}