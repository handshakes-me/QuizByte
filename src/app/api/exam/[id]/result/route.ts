import dbConnect from "@/config/dbConnect";
import { isAdmin } from "@/middlewares/authMiddleware";
import examModel from "@/models/exam.model";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string;
        role: string;
    }
}

export const PATCH = async (req: requestType, { params }: { params: Promise<{ id: string }> }) => {
    try {

        // db connect
        await dbConnect()

        // authenticate user
        const authResponse = isAdmin(req);
        if (authResponse instanceof NextRequest) {
            return authResponse;
        }

        // get data
        const { id: examId } = await params;

        const { status } = await req.json() as { status: boolean }

        // validate exam id
        const exam = await examModel.findById(examId)
        if (!exam) {
            return NextResponse.json({ success: false, message: "Exam not found" }, { status: 404 });
        }

        if (exam.adminId.toString() !== req.user.id) {
            return NextResponse.json({ success: false, message: "You are not authorized to update this exam" }, { status: 401 });
        }

        // update exam
        exam.isResultPublished = status
        await exam.save()
        exam.questions = undefined

        // return response
        return NextResponse.json({ success: true, message: "result status updated successfully", data: exam }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong while creating the exam : ", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}