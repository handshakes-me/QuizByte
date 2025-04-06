import dbConnect from "@/config/dbConnect";
import adminModel from "@/models/admin.model";
import studentModel from "@/models/student.model";
import superAdminModel from "@/models/superAdmin.model";
import { render } from "@react-email/components";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import PasswordUpdatedEmail from "../../../../../emails/PasswordUpdated";
import { sendMail } from "@/utils/sendmail";

export async function POST(req: NextRequest) {

    await dbConnect();

    const { email, token, password, confirmPassword } = await req.json();

    if(!email || !token || !password || !confirmPassword) {
        return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    if(password !== confirmPassword) {
        return NextResponse.json({ success: false, error: "Passwords do not match" }, { status: 400 });
    }

    try {
        
        const user = 
            await superAdminModel.findOne({ email }) ||
            await adminModel.findOne({ email }) ||
            await studentModel.findOne({ email });


        if(!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        if(user.resetPasswordToken !== token) {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        await user.save();

        const html = await render(PasswordUpdatedEmail({ username: user.name }));
        await sendMail(email, "Password updated", html);

        return NextResponse.json({ success: true, message: "Password updated successfully" }, { status: 200 });

    } catch(e) {    
        console.log("error", e);
        return NextResponse.json({ success: false, error: "Error resetting password" }, { status: 500 });
    }

}