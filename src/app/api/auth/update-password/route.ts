import dbConnect from "@/config/dbConnect";
import { auth } from "@/middlewares/authMiddleware";
import adminModel from "@/models/admin.model";
import studentModel from "@/models/student.model";
import superAdminModel from "@/models/superAdmin.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

interface RequestType extends NextRequest {
    user: {
        id: string;
        role: string;
    };
}

export async function POST(req: RequestType) {
    try {

        await dbConnect();

        const authResponse = auth(req);
        if (authResponse instanceof NextResponse) {
            return authResponse;
        }

        const { oldPassword, password, ConfirmPassword } = await req.json();
        const { id } = req.user;

        if (password !== ConfirmPassword) {
            return NextResponse.json({
                success: false,
                message: "Password and Confirm Password does not match",
            }, { status: 400 })
        }

        const user = await adminModel.findById(id) ||
            superAdminModel.findById(id) ||
            studentModel.findById(id);

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found",
            }, { status: 404 })
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({
                success: false,
                message: "Old Password is incorrect",
            }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password updated successfully",
        }, { status: 200 })

    } catch (error) {
        console.log("error ", error)
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
            error: error instanceof Error ? error.message : "Internal server error",
        }, { status: 500 })
    }
}