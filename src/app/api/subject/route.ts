import dbConnect from "@/config/dbConnect";
import { isAdmin } from "@/middlewares/authMiddleware";
import examGroupModel from "@/models/examGroup.model";
import subjectModel from "@/models/subject.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string;
        role: string;
    };
}

export const POST = async (request: requestType) => {
    try {

        // dbConnect
        await dbConnect();

        // authentication
        const authResponse = isAdmin(request);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        // data
        const { name, description, code, examGroupId } = await request.json()

        // validation
        if (!name || !description || !code || !examGroupId) {
            return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
        }

        // validation
        if (mongoose.Types.ObjectId.isValid(examGroupId) === false) {
            return NextResponse.json({ success: false, error: "Invalid exam group id" }, { status: 400 });
        }

        // fetch examgroup
        const examGroup = await examGroupModel.findById(examGroupId)

        // validation
        if (!examGroup) {
            return NextResponse.json({ success: false, error: "Exam group not found" }, { status: 404 });
        }

        // crate subject
        const subject = new subjectModel({ name, description, code, examGroup: examGroupId })

        // modify
        examGroup.subjects.push(subject._id);

        // save
        await examGroup.save()
        await subject.save()

        // response
        return NextResponse.json({ success: true, message: "Subject created successfully", data: subject }, { status: 201 })

    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export const GET = async (request: requestType) => {
    try {

        await dbConnect()

        const authResponse = isAdmin(request);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        const examGroupId = request.nextUrl.searchParams.get('examGroupId')
        if (!examGroupId) {
            return NextResponse.json({ success: false, error: "Invalid exam group id" }, { status: 400 });
        }

        const subjects = await subjectModel.find({ examGroup: examGroupId })

        return NextResponse.json({ success: true, message: "Subjects fetched successfully", data: subjects || [] }, { status: 200 })

    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}