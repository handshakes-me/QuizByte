import dbConnect from "@/config/dbConnect";
import { auth } from "@/middlewares/authMiddleware";
import adminModel from "@/models/admin.model";
import studentModel from "@/models/student.model";
import superAdminModel from "@/models/superAdmin.model";
import { NextRequest, NextResponse } from "next/server";

interface RequestType extends NextRequest {
    user: {
        id: string;
        role: string;
    }
}

export async function POST(req: RequestType) {
    try {

        await dbConnect();

        const authResponse = auth(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        const id = req.user.id;
        const { name } = await req.json() || {};

        let user = await adminModel.findById(id);
        if (!user) user = await superAdminModel.findById(id);
        if (!user) user = await studentModel.findById(id);

        if (!user) {
            return NextResponse.json({
                success: false,
                error: "User not found",
            }, { status: 404 })
        }

        user.name = name;
        await user.save();
        user.password = undefined;

        return NextResponse.json({
            success: true,
            message: "Username updated successfully",
            data: user
        }, { status: 200 })
    } catch (error) {
        console.log("error occurred while updating the username: ", error)
        return NextResponse.json({
            success: false,
            error: "Something went wrong",
        }, { status: 500 })
    }
}