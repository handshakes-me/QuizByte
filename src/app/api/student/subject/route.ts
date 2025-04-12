import dbConnect from "@/config/dbConnect";
import { isStudent } from "@/middlewares/authMiddleware";
import examGroupModel from "@/models/examGroup.model";
import studentModel from "@/models/student.model";
import subjectModel from "@/models/subject.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string;
        role: string;
    };
}

export const POST = async (req: requestType) => {
    try {

        // connect db
        await dbConnect();

        // authenticate
        const authResponse = isStudent(req)
        if (authResponse instanceof NextResponse) {
            return authResponse
        }

        // parameters
        const { id } = req.user
        const { subjects, examGroupId } = await req.json()

        const user = await studentModel.findById(id);
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 400 });
        }

        const examGroup = await examGroupModel.findById(examGroupId)
        if (!examGroup) {
            return NextResponse.json({ success: false, error: "Invalid exam group id" }, { status: 400 });
        }

        const student = examGroup.students.find((student: { email: string }) => student.email === user?.email)
        // console.log("student : ", student);

        if (!student) {
            return NextResponse.json({ success: false, error: `You are not enrolled in ${examGroup.name}` }, { status: 400 });
        }

        const enrolledIn = []
        for (const subjectId of subjects) {
            const subject = await subjectModel.findById(subjectId)
            if (subject) {
                if (!subject.students.includes(id)) {
                    subject.students.push({
                        name: student.name,
                        email: student.email,
                        prn: student.prn,
                        joined: new Date()
                    })
                    enrolledIn.push(subject)
                    await subject.save()
                }
            }
        }

        return NextResponse.json({ success: true, message: "Subjects enrolled successfully", data: enrolledIn }, { status: 200 })


    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}