import dbConnect from "@/config/dbConnect";
import examGroupModel from "@/models/examGroup.model";
import subjectModel from "@/models/subject.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (rqe: NextRequest, context: { params: { id: string } }) => {
    try {
        // dbConnect
        await dbConnect();

        // get data
        const subjectId = context.params.id
        const { name, description, code } = await rqe.json()

        // validate id
        if (mongoose.Types.ObjectId.isValid(subjectId) === false) {
            return NextResponse.json({ success: false, error: "Invalid subject id" }, { status: 400 });
        }

        // fetch data
        const subject = await subjectModel.findById(subjectId)

        if (!subject) {
            return NextResponse.json({ success: false, error: "Subject not found" }, { status: 404 });
        }

        // modification
        if (name) subject.name = name
        if (description) subject.description = description
        if (code) subject.code = code

        // save
        await subject.save()

        // response
        return NextResponse.json({ success: true, message: "Subject updated successfully", data: subject }, { status: 200 })

    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export const DELETE = async (req: NextRequest, context: { params: { id: string } }) => {
    try {

        // connect db
        await dbConnect();

        // id
        const subjectId = context.params.id

        // validation 
        if (mongoose.Types.ObjectId.isValid(subjectId) === false) {
            return NextResponse.json({ success: false, error: "Invalid subject id" }, { status: 400 });
        }

        if (!subjectId) {
            return NextResponse.json({ success: false, error: "Subject id is required" }, { status: 400 });
        }

        const subject = await subjectModel.findById(subjectId)

        if (!subject) {
            return NextResponse.json({ success: false, error: "Subject not found" }, { status: 404 });
        }

        if (subject.students.length > 0) {
            return NextResponse.json({ success: false, error: "This subject cannot be deleted" }, { status: 400 });
        }

        const examGroup = await examGroupModel.findById(subject.examGroup)
        if (!examGroup) {
            return NextResponse.json({ success: false, error: "Exam group not found" }, { status: 404 });
        }

        examGroup.subjects.pop(subject._id)
        await examGroup.save()
        await subject.deleteOne()

        return NextResponse.json({ success: true, message: "Subject deleted successfully" }, { status: 200 })

    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}