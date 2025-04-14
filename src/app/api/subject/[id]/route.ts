import dbConnect from "@/config/dbConnect";
import examModel from "@/models/exam.model";
import examGroupModel from "@/models/examGroup.model";
import subjectModel from "@/models/subject.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (rqe: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        // dbConnect
        await dbConnect();

        // get data
        const { id: subjectId } = await params
        const { name, description, code } = await rqe.json()

        // validate id
        if (mongoose.Types.ObjectId.isValid(subjectId) === false) {
            return NextResponse.json({ success: false, error: "Invalid subject id" }, { status: 400 });
        }

        const nameExists = await subjectModel.findOne({ name: name, _id: { $ne: subjectId } })
        if(nameExists) {
            return NextResponse.json({ success: false, error: "Subject with this name already exist" }, { status: 400 });
        }

        const codeExists = await subjectModel.findOne({ code: code, _id: { $ne: subjectId } })
        if(codeExists) {
            return NextResponse.json({ success: false, error: "Subject code is already taken" }, { status: 400 });
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

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {

        // connect db
        await dbConnect();

        // id
        const { id: subjectId } = await params

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

        // don't delete if students are enrolled in for this subject
        if (subject.students.length > 0) {
            return NextResponse.json({ success: false, error: "This subject cannot be deleted" }, { status: 400 });
        }

        // delete associated exams
        await examModel.deleteMany({ subjectId: subject?._id })

        // remove subject from exam group
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