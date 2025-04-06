import dbConnect from "@/config/dbConnect";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
import adminModel from "@/models/admin.model";
import examModel from "@/models/exam.model";
import examGroupModel from "@/models/examGroup.model";
import studentModel from "@/models/student.model";
import subjectModel from "@/models/subject.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface reqestType extends NextRequest {
    user: {
        id: string;
        role: string;
    }
}

export const PATCH = async (req: reqestType, { params }: { params: Promise<{ id: string }> }) => {
    try {

        // connect db
        await dbConnect()

        // authenticate
        const authResponse = isAdmin(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        // fetch data
        const {
            title,
            description,
            subjectId,
            examGroupId,
            startTime,
            endTime,
            duration,
            totalMarks,
            numberOfQuestions,
            marksPerQuestion,
            passingMarks,
            attemptCount,
            hints
        } = await req.json()

        const admindId = req.user.id
        const { id: examId } = await params;

        // validate exam
        const exam = await examModel.findById(examId)
        if (!exam) {
            return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });
        }

        // validate admin id
        const user = await adminModel.findById(admindId)
        if (!user) {
            return NextResponse.json({ success: false, message: "Admin not found" }, { status: 404 });
        }

        if (exam.adminId.toString() !== user._id.toString()) {
            return NextResponse.json({ success: false, message: "You are not authorized to update this exam" }, { status: 401 });
        }

        // validate subjectId
        if (subjectId) {
            const subject = await subjectModel.findById(subjectId)
            if (!subject) {
                return NextResponse.json({ success: false, message: "Subject not found" }, { status: 404 });
            }
        }

        // exam group id 
        if (examGroupId) {
            const examGroup = await examGroupModel.findById(examGroupId)
            if (!examGroup) {
                return NextResponse.json({ success: false, message: "Exam group not found" }, { status: 404 });
            }
        }

        // validate starting and ending time
        if (startTime && endTime) {
            const start = new Date(startTime)
            const end = new Date(endTime)
            if (start >= end) {
                return NextResponse.json({ success: false, message: "Start time must be less than end time" }, { status: 400 });
            }
        }

        // validate duration
        if (duration && duration <= 0) {
            return NextResponse.json({ success: false, message: "Duration must be greater than 0" }, { status: 400 });
        }

        // hints validation
        if (hints > numberOfQuestions) {
            return NextResponse.json({ success: false, message: "Hints must be less than or equal to number of questions" }, { status: 400 });
        }

        // validate marks 
        if (totalMarks && totalMarks <= 0) {
            return NextResponse.json({ success: false, message: "Total marks must be greater than 0" }, { status: 400 });
        }

        // validate marks per question
        if (marksPerQuestion && marksPerQuestion <= 0) {
            return NextResponse.json({ success: false, message: "Marks per question must be greater than 0" }, { status: 400 });
        }

        if (marksPerQuestion && totalMarks && marksPerQuestion > totalMarks) {
            return NextResponse.json({ success: false, message: "Marks per question must be less than or equal to total marks" }, { status: 400 });
        }

        // validate totalMarks 
        if (marksPerQuestion && totalMarks && numberOfQuestions && numberOfQuestions * marksPerQuestion !== totalMarks) {
            return NextResponse.json({
                success: false,
                message: "Total marks must be equal to number of questions multiplied by marks per question"
            }, { status: 400 });
        }

        // validate passing marks
        if (passingMarks && passingMarks <= 0) {
            return NextResponse.json({ success: false, message: "Passing marks must be greater than 0" }, { status: 400 });
        }

        if (passingMarks && totalMarks && passingMarks > totalMarks) {
            return NextResponse.json({ success: false, message: "Passing marks must be less than or equal to total marks" }, { status: 400 });
        }

        // validate attemptCount
        if (attemptCount && attemptCount <= 0) {
            return NextResponse.json({ success: false, message: "Attempt count must be greater than 0" }, { status: 400 });
        }

        // validate number of questions
        if (numberOfQuestions && numberOfQuestions <= 0) {
            return NextResponse.json({ success: false, message: "Number of questions must be greater than 0" }, { status: 400 });
        }

        // add new data 
        if (title) {
            exam.title = title
        }

        if (description) {
            exam.description = description
        }

        if (hints) {
            exam.hints = hints
        }

        if (subjectId) {
            exam.subjectId = subjectId
        }

        if (examGroupId) {
            exam.examGroupId = examGroupId
        }

        if (startTime) {
            exam.startTime = startTime
        }

        if (endTime) {
            exam.endTime = endTime
        }

        if (duration) {
            exam.duration = duration
        }

        if (totalMarks) {
            exam.totalMarks = totalMarks
        }

        if (numberOfQuestions) {
            exam.numberOfQuestions = numberOfQuestions
        }

        if (marksPerQuestion) {
            exam.marksPerQuestion = marksPerQuestion
        }

        if (passingMarks) {
            exam.passingMarks = passingMarks
        }

        if (attemptCount) {
            exam.attemptCount = attemptCount
        }

        // save instance
        await exam.save()

        // return response
        return NextResponse.json({ success: true, message: "Exam updated successfully", data: exam }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong while updating the exam : ", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}

export const GET = async (req: reqestType, { params }: { params: Promise<{ id: string }> }) => {
    try {

        // db connect
        await dbConnect()

        // authenticate user
        const authResponse = auth(req)
        if (authResponse instanceof NextResponse) {
            return authResponse
        }

        // authorize user
        const user = await adminModel.findById(req.user.id) || await studentModel.findById(req.user.id)

        // fetch data
        const { id: examId } = await params;
        const exam = await examModel.findById(examId).populate("questions")
        if (!exam) {
            return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });
        }

        const examGroup = await examGroupModel.findById(exam.examGroupId)
        if (!examGroup) {
            return NextResponse.json({ success: false, message: "Exam group not found" }, { status: 404 });
        }

        if (user.role === "ADMIN" && user._id.toString() !== exam.adminId.toString()) {
            return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
        }

        if (user.role === "STUDENT" && examGroup.students.some((e: mongoose.Types.ObjectId) => e.toString() !== user._id.toString())) {
            return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
        }

        if (user.role === "STUDENT") {
            exam.questions = undefined
        }

        // return response
        return NextResponse.json({ success: true, message: "Exam fetched successfully", data: exam }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong while fetching the exam : ", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
} 
