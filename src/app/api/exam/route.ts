import dbConnect from "@/config/dbConnect";
import { isAdmin } from "@/middlewares/authMiddleware";
import adminModel from "@/models/admin.model";
import examModel from "@/models/exam.model";
import examGroupModel from "@/models/examGroup.model";
import subjectModel from "@/models/subject.model";
import { NextRequest, NextResponse } from "next/server";

interface RequestType extends NextRequest {
    user: {
        id: string;
        role: string;
    }
}

export const POST = async (req: RequestType) => {
    try {

        // connect db
        dbConnect();

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

        // validate data
        if (
            !title ||
            !subjectId ||
            !startTime ||
            !endTime ||
            !duration ||
            !totalMarks ||
            !examGroupId ||
            !numberOfQuestions ||
            !marksPerQuestion ||
            !passingMarks ||
            !attemptCount ||
            hints < 0
        ) {
            return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
        }

        // validate admin id
        const user = await adminModel.findById(admindId)
        if (!user) {
            return NextResponse.json({ success: false, error: "Admin not found" }, { status: 404 });
        }

        // validate subjectId
        const subject = await subjectModel.findById(subjectId)
        if (!subject) {
            return NextResponse.json({ success: false, error: "Subject not found" }, { status: 404 });
        }

        // exam group id 
        const examGroup = await examGroupModel.findById(examGroupId)
        if (!examGroup) {
            return NextResponse.json({ success: false, error: "Exam group not found" }, { status: 404 });
        }

        const examExist = await examModel.findOne({ subjectId });
        if(examExist) {
            return NextResponse.json({ success: false, error: "Exam with selected subject already exists" }, { status: 400 });
        }

        // validate starting and ending time
        const start = new Date(startTime)
        const end = new Date(endTime)
        if (start >= end) {
            return NextResponse.json({ success: false, error: "Start time must be less than end time" }, { status: 400 });
        }

        // validate duration
        if (duration <= 0) {
            return NextResponse.json({ success: false, error: "Duration must be greater than 0" }, { status: 400 });
        }

        // hints validation
        if (hints > numberOfQuestions) {
            return NextResponse.json({ success: false, error: "Hints must be less than or equal to number of questions" }, { status: 400 });
        }

        // validate marks 
        if (totalMarks <= 0) {
            return NextResponse.json({ success: false, error: "Total marks must be greater than 0" }, { status: 400 });
        }

        // validate marks per question
        if (marksPerQuestion <= 0) {
            return NextResponse.json({ success: false, error: "Marks per question must be greater than 0" }, { status: 400 });
        }

        if (marksPerQuestion > totalMarks) {
            return NextResponse.json({ success: false, error: "Marks per question must be less than or equal to total marks" }, { status: 400 });
        }

        // validate totalMarks 
        if (numberOfQuestions * marksPerQuestion !== totalMarks) {
            return NextResponse.json({
                success: false,
                error: "Total marks must be equal to number of questions multiplied by marks per question"
            }, { status: 400 });
        }

        // validate passing marks
        if (passingMarks <= 0) {
            return NextResponse.json({ success: false, error: "Passing marks must be greater than 0" }, { status: 400 });
        }

        if (passingMarks > totalMarks) {
            return NextResponse.json({ success: false, error: "Passing marks must be less than or equal to total marks" }, { status: 400 });
        }

        // validate attemptCount
        if (attemptCount <= 0) {
            return NextResponse.json({ success: false, error: "Attempt count must be greater than 0" }, { status: 400 });
        }

        // validate number of questions
        if (numberOfQuestions <= 0) {
            return NextResponse.json({ success: false, error: "Number of questions must be greater than 0" }, { status: 400 });
        }

        // create instance
        const exam = new examModel({
            title,
            description,
            subjectId,
            examGroupId,
            adminId: admindId,
            startTime,
            endTime,
            duration,
            totalMarks,
            numberOfQuestions,
            marksPerQuestion,
            passingMarks,
            attemptCount,
            hints
        })

        // save exam id in exam group
        examGroup.exams.push(exam._id)
        await examGroup.save()

        // save instance
        await exam.save()

        // return response
        return NextResponse.json({ success: true, message: "Exam created successfully", data: exam }, { status: 201 });

    } catch (error) {
        console.log("Error while creating exam : ", error);
        return NextResponse.json({ success: false, message: "Error while creating exam" }, { status: 500 });
    }
}
