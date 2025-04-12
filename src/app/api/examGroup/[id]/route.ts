import dbConnect from "@/config/dbConnect";
import { auth, isAdmin } from "@/middlewares/authMiddleware";
import adminModel from "@/models/admin.model";
import examGroupModel from "@/models/examGroup.model";
import organizationModel from "@/models/organization.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string
        role: string
    }
}

export async function GET(request: requestType, { params }: { params: Promise<{ id: string }> }) {
    try {

        // db connect
        await dbConnect();

        const authResponse = auth(request);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        // validate id
        const { id: examGroupId } = await params;
        if (!examGroupId) {
            return NextResponse.json({ success: false, error: "Exam group id is required" }, { status: 400 });
        }

        if (mongoose.Types.ObjectId.isValid(examGroupId) === false) {
            return NextResponse.json({ success: false, error: "Invalid exam group id" }, { status: 400 });
        }

        const examGroup = await examGroupModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(examGroupId) } },

            // Lookup subjects collection
            {
                $lookup: {
                    from: "subjects", // Name of the subjects collection
                    localField: "subjects",
                    foreignField: "_id",
                    as: "subjects"
                }
            },

            // Lookup students collection
            // {
            //     $lookup: {
            //         from: "students", // Name of the students collection
            //         localField: "students",
            //         foreignField: "_id",
            //         as: "students"
            //     }
            // },

            {
                $lookup: {
                    from: "exams", // Name of the exams collection
                    localField: "exams",
                    foreignField: "_id",
                    as: "exams"
                }
            },

            // Select only required fields
            {
                $project: {
                    name: 1,
                    description: 1,
                    students: 1,
                    // "students._id": 1,
                    // "students.name": 1,
                    // "students.email": 1,
                    "subjects._id": 1,
                    "subjects.name": 1,
                    "subjects.code": 1,
                    "subjects.description": 1,
                    "exams._id": 1,
                    "exams.title": 1,
                    "exams.description": 1,
                    "exams.subjectId": 1,
                    "exams.startTime": 1,
                    "exams.endTime": 1,
                    "exams.duration": 1,
                    "exams.totalMarks": 1,
                    "exams.passingMarks": 1,
                    "exams.numberOfQuestions": 1,
                    "exams.hints": 1,
                    "exams.attemptCount": 1,
                }
            }
        ]);


        // validate
        if (!examGroup) {
            return NextResponse.json({ success: false, error: "Exam group not found" }, { status: 404 });
        }

        // remove students list from output when student is fetching data
        if (request.user.role === 'STUDENT') {
            examGroup[0].students = undefined
            examGroup[0].exams = undefined
        }

        // response
        return NextResponse.json({ success: true, message: "Exam groups fetched successfully", data: examGroup[0] }, { status: 200 })

    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: requestType, { params }: { params: Promise<{ id: string }> }) {
    try {

        // db connect
        await dbConnect();

        // authenticate user
        const authResponse = isAdmin(request);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        // get data
        const { name, description } = await request.json()
        const { id: examGroupId } = await params
        const userId = request.user.id

        // validate id
        if (mongoose.Types.ObjectId.isValid(examGroupId) === false) {
            return NextResponse.json({ success: false, error: "Invalid exam group id" }, { status: 400 });
        }

        // fetch data
        const examGroup = await examGroupModel.findById(examGroupId)
        if (!examGroup) {
            return NextResponse.json({ success: false, error: "Exam group not found" }, { status: 404 });
        }

        const user = await adminModel.findById(userId)
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        if (user.organizationId.toString() !== examGroup.organizationId.toString()) {
            return NextResponse.json({ success: false, error: "You are not authorized to update this exam group" }, { status: 403 });
        }

        // update
        if (name) examGroup.name = name
        if (description) examGroup.description = description

        // save
        await examGroup.save()

        // response
        return NextResponse.json({ success: true, message: "Exam group updated successfully", data: examGroup }, { status: 200 })

    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: requestType, { params }: { params: Promise<{ id: string }> }) {
    try {

        // db connect
        await dbConnect();

        // authenticate user
        const authResponse = isAdmin(request);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        // get data
        const { id: examGroupId } = await params
        const userId = request.user.id

        // validate id
        if (mongoose.Types.ObjectId.isValid(examGroupId) === false) {
            return NextResponse.json({ success: false, error: "Invalid exam group id" }, { status: 400 });
        }

        // fetch data
        const examGroup = await examGroupModel.findById(examGroupId)
        if (!examGroup) {
            return NextResponse.json({ success: false, error: "Exam group not found" }, { status: 404 });
        }

        // safe check
        if (examGroup?.exams.length > 0 || examGroup?.students.length > 0 || examGroup?.subjects.length > 0) {
            return NextResponse.json({ success: false, error: "This exam group cannot be deleted" }, { status: 400 });
        }

        // fetch organization data
        const organization = await organizationModel.findById(examGroup.organizationId)
        if (!organization) {
            return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
        }

        const user = await adminModel.findById(userId)
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        if (user.organizationId.toString() !== examGroup.organizationId.toString()) {
            return NextResponse.json({ success: false, error: "You are not authorized to delete this exam group" }, { status: 403 });
        }

        // filter
        await organization.examGroups.pop(examGroup._id)

        // save
        await organization.save()

        // delete
        await examGroup.deleteOne()

        // response
        return NextResponse.json({ success: true, message: "Exam group deleted successfully" }, { status: 200 })

    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}