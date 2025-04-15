import dbConnect from "@/config/dbConnect"
import { isAdmin } from "@/middlewares/authMiddleware"
import examModel from "@/models/exam.model"
import questionModel from "@/models/question.model"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"

interface requestType extends NextRequest {
    user: {
        id: string,
        role: string
    }
}

export const POST = async (req: requestType) => {
    try {

        // db connect
        await dbConnect();

        const authResponse = isAdmin(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        const { id: userId } = req?.user

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }

        // get data
        const { questionText, options, correctAnswer, hint, explaination, examId } = await req.json()

        // data validation
        if (!questionText || !options || !correctAnswer) {
            return NextResponse.json({
                success: false,
                message: "Please fill all the fields"
            }, { status: 400 })
        }

        // options validation
        if (!Array.isArray(options)) {
            return NextResponse.json({
                success: false,
                message: "Options must be an array"
            }, { status: 400 })
        }

        const optionsValid = options.some(op => typeof op !== "string" ? true : false)

        if (optionsValid) {
            return NextResponse.json({
                success: false,
                message: "Options must be an array of strings"
            }, { status: 400 })
        }

        // correct answer validation
        if (typeof correctAnswer !== "string") {
            return NextResponse.json({
                success: false,
                message: "Correct answer must be a string"
            }, { status: 400 })
        }

        const correctAnswerExists = options.some(op => op === correctAnswer);

        if (!correctAnswerExists) {
            return NextResponse.json({
                success: false,
                message: "Correct answer must be one of the options"
            }, { status: 400 })
        }

        // exam validation
        if (mongoose.Types.ObjectId.isValid(examId) === false) {
            return NextResponse.json({
                success: false,
                message: "Invalid exam id"
            }, { status: 400 })
        }

        const exam = await examModel.findById(examId)

        if (!exam) {
            return NextResponse.json({
                success: false,
                message: "Exam not found"
            }, { status: 400 })
        }

        if(exam.adminId.toString() !== userId) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 })
        }

        // create question
        const newQuestion = new questionModel({
            examId,
            questionText,
            options,
            correctAnswer,
            hint,
            explaination
        })

        // create question
        await newQuestion.save()

        // save question ref to exam model
        exam.questions.push(newQuestion._id)
        await exam.save()

        return NextResponse.json({
            success: true,
            message: "Question created successfully",
            data: newQuestion
        }, { status: 201 })

    } catch (error) {
        console.log("Error : ", error)
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
            error: error
        }, { status: 500 })
    }
}