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

export async function GET(request: requestType) {
    try {

        // connect db
        await dbConnect();

        // authenticate user
        const authResponse = auth(request);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        // get request data
        const organizationId = request?.nextUrl?.searchParams?.get('organizationId');

        // validate data
        if (!organizationId) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        // validation with db
        const organization = await organizationModel.findById(organizationId)

        if (!organization) {
            return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
        }

        const examGroups = await examGroupModel.aggregate([
            { $match: { organizationId: new mongoose.Types.ObjectId(organizationId) } },

            // Lookup subjects collection
            {
                $lookup: {
                    from: "subjects", // Collection name
                    localField: "subjects",
                    foreignField: "_id",
                    as: "subjects"
                }
            },

            // Lookup students collection
            // {
            //     $lookup: {
            //         from: "students", // Collection name
            //         localField: "students",
            //         foreignField: "_id",
            //         as: "students"
            //     }
            // },

            {
                $lookup: {
                    from: "exams", // Collection name
                    localField: "exams",
                    foreignField: "_id",
                    as: "exams"
                }
            },

            // Select only required fields
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    organizationId: 1,
                    students: 1,
                    "subjects._id": 1,
                    "subjects.name": 1,
                    "subjects.code": 1,
                    "subjects.description": 1,
                    "exams._id": 1,
                }
            }
        ]);

        // remove students list from output when student is fetching data
        if (request.user.role === "STUDENT") {
            examGroups.forEach((e) => {
                e.students = undefined
            })
        }

        // response
        return NextResponse.json({ success: true, message: "Exam groups fetched successfully", data: examGroups }, { status: 200 })
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
} 