import dbConnect from "@/config/dbConnect";
import adminModel from "@/models/admin.model";
import studentModel from "@/models/student.model";
import superAdminModel from "@/models/superAdmin.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

type ErrorType = {
    name: string;
    message: string;
    stack?: string;
}

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const { token } = await req.json()

        if (!token) {
            return NextResponse.json({ success: false, error: "Token is required" }, { status: 400 });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
        const email = decode?.email;

        if (!email) {
            return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
        }

        const user =
            await superAdminModel.findOne({ email }) ||
            await adminModel.findOne({ email }) ||
            await studentModel.findOne({ email });

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        if (user?.verified) {
            return NextResponse.json({ success: false, error: "Email already verified" }, { status: 400 });
        }

        user.verified = true;
        await user.save();
        return NextResponse.json({ success: true, message: "Email verified successfully" }, { status: 200 });

    } catch (e: unknown) {
        const error = e as ErrorType;

        console.error("Error verifying email:", e);
        if (error?.name === "TokenExpiredError") {
            return NextResponse.json({ success: false, error: "Token has expired" }, { status: 401 });
        }
        return NextResponse.json({ success: false, error: "Error verifying email" }, { status: 500 });
    }
}