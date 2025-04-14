import dbConnect from "@/config/dbConnect";
import { isAdmin } from "@/middlewares/authMiddleware";
import adminModel from "@/models/admin.model";
import examGroupModel from "@/models/examGroup.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface requestType extends NextRequest {
    user: {
        id: string;
        role: string;
    }
}

export const POST = async (req: requestType, { params }: { params: Promise<{ id: string }> }) => {
    try {

        // dbConnect 
        await dbConnect();

        // auth
        const authResponse = isAdmin(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        const { status } = await req.json();
        const { id: adminId } = req.user;
        const { id: examGroupId } = await params;

        if (!mongoose.Types.ObjectId.isValid(examGroupId)) {
            return NextResponse.json({ success: false, error: "Invalid exam group id" }, { status: 400 });
        }

        if (status !== "ACTIVE" && status !== "INACTIVE") {
            return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
        }

        const user = await adminModel.findById(adminId);
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        const examGroup = await examGroupModel.findById(examGroupId);
        if (!examGroup) {
            return NextResponse.json({ success: false, error: "Exam group not found" }, { status: 404 });
        }

        if (examGroup.organizationId.toString() !== user.organizationId.toString()) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        examGroup.status = status;
        await examGroup.save();

        return NextResponse.json({ success: true, message: "Exam group status updated successfully" }, { status: 200 });
    } catch (error) {
        console.log("error updating examGroup status : ", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}