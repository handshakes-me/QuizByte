import adminModel from "@/models/admin.model";
import studentModel from "@/models/student.model";
import superAdminModel from "@/models/superAdmin.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"; 
import dbConnect from "@/config/dbConnect";

export async function POST(req: NextRequest) {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    try {

        const user = 
            await superAdminModel.findOne({ email }) ||
            await adminModel.findOne({ email }) ||
            await studentModel.findOne({ email });          

        // console.log("user", user);
            
        if(!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        if(!user.verified) {
            return NextResponse.json({ success: false, error: "User is not verified" }, { status: 400 });
        }

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 400 });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1d" });
        user.password = undefined;

        const response = new NextResponse(
            JSON.stringify({
                success: true,
                message: "User logged in successfully",
                data: user
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        )
    
        response.cookies.set("token", token, {
            httpOnly: true, // Prevents access from JavaScript (for security)
            secure: process.env.NODE_ENV === "production", // Use HTTPS in production
            maxAge: 24 * 60 * 60, // 1 day in seconds
            sameSite: "strict", 
            path: "/",
        });
    
        return response;

    } catch (error) {
        console.log("error : ", error)
        return NextResponse.json({ success: false, error: "Error logging in" }, { status: 500 });
    }
}