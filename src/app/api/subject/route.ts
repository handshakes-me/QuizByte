import dbConnect from "@/config/dbConnect";
import { isAdmin } from "@/middlewares/authMiddleware";
import examGroupModel from "@/models/examGroup.model";
import subjectModel from "@/models/subject.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
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