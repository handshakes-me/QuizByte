import dbConnect from "@/config/dbConnect";
import { isAdmin } from "@/middlewares/authMiddleware";
import adminModel from "@/models/admin.model";
import examGroupModel from "@/models/examGroup.model";
import organizationModel from "@/models/organization.model";
import studentModel from "@/models/student.model";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string
        role: string
    }
}

export async function POST(request: requestType) {
    try {

        // connect db
        await dbConnect();

        // authenticate user
        const authResponse = isAdmin(request);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        // get request data
        const { name, description, organizationId } = await request.json();

        // validate data
        if (!name || !organizationId || !description) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        // validation with db
        const nameExists = await examGroupModel.findOne({ name: name, organizationId: organizationId })

        if (nameExists) {
            return NextResponse.json({ success: false, error: "Exam group with this name already exists" }, { status: 400 });
        }

        // user validation
        const user = await adminModel.findOne({ _id: request.user.id })

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // organization id validation
        if (user?.organizationId.toString() !== organizationId) {
            return NextResponse.json({ success: false, error: "you are not authorized to create exam group for this organization" }, { status: 403 });
        }

        // organization validation
        const organization = await organizationModel.findById(organizationId)

        if (!organization) {
            return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
        }

        // creating new exam group
        const examGroup = new examGroupModel({ name, description, organizationId });
        await examGroup.save();

        // modifying organization schema
        await organization.examGroups.push(examGroup._id);
        await organization.save();

        // response
        return NextResponse.json({ success: true, message: "Exam group created successfully", data: examGroup }, { status: 201 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

