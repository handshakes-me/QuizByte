import dbConnect from "@/config/dbConnect";
import { isAdmin } from "@/middlewares/authMiddleware";
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {

        // db connect
        await dbConnect();

        // validate id
        const { id: examGroupId } = params;
        if (!examGroupId) {
            return NextResponse.json({ success: false, error: "Exam group id is required" }, { status: 400 });
        }

        if (mongoose.Types.ObjectId.isValid(examGroupId) === false) {
            return NextResponse.json({ success: false, error: "Invalid exam group id" }, { status: 400 });
        }

        // fetch exam groups
        const examGroup = await examGroupModel.findById(examGroupId)

        // validate
        if (!examGroup) {
            return NextResponse.json({ success: false, error: "Exam group not found" }, { status: 404 });
        }

        // response
        return NextResponse.json({ success: true, message: "Exam groups fetched successfully", data: examGroup }, { status: 200 })

    } catch (e) {
        console.error(e);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: requestType, { params }: { params: { id: string } }) {
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
        const examGroupId = params.id
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

export async function DELETE(request: requestType, { params }: { params: { id: string } }) {
    try {

        // db connect
        await dbConnect();

        // authenticate user
        const authResponse = isAdmin(request);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        // get data
        const examGroupId = params.id
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