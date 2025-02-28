import dbConnect from "@/config/dbConnect";
import { isStudent } from "@/middlewares/authMiddleware";
import organizationModel from "@/models/organization.model";
import studentModel from "@/models/student.model";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string
        role: string
    }
}

export const GET = async (req: requestType) => {
    try {
        await dbConnect();

        const authResponse = isStudent(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        const userId = req.user.id;

        const user = await studentModel.findById(userId)
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        const organizations = await organizationModel.find({
            students: {
                $elemMatch: { email: user?.email }
            }
        }, {
            name: 1,
            email: 1,
            contactNumber: 1
        });
        if (!organizations) {
            return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "oraganizations found", organizations }, { status: 200 });

    } catch (error) {
        console.error("Error getting student:", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }
};